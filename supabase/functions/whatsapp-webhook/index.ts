
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { message, from, type, mediaUrl } = await req.json();
    console.log('Recebida mensagem WhatsApp:', { message, from, type });

    // Encontrar usuário pelo número do WhatsApp
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('whatsapp_number', from)
      .single();

    if (profileError || !profile) {
      console.log('Usuário não encontrado para o número:', from);
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Salvar mensagem no banco
    const { data: savedMessage, error: messageError } = await supabaseClient
      .from('whatsapp_messages')
      .insert([{
        user_id: profile.id,
        user_phone: from,
        message_content: message,
        message_type: type,
        media_url: mediaUrl,
        processed: false
      }])
      .select()
      .single();

    if (messageError) throw messageError;

    // Processar mensagem com Gemini AI
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    let aiResponse = '';
    let extractedData = null;

    // Contexto para IA sobre extração de dados financeiros
    const financialPrompt = `Você é um assistente financeiro especializado em extrair dados de transações de mensagens do WhatsApp.

Analise a seguinte mensagem e extraia informações financeiras se houver:
"${message}"

Se for uma transação financeira, responda no formato JSON:
{
  "isTransaction": true,
  "type": "income" ou "expense",
  "amount": valor_numerico,
  "category": "food|transport|entertainment|health|education|shopping|bills|salary|investment|other",
  "description": "descrição_da_transação"
}

Se não for uma transação, responda com uma mensagem útil sobre finanças pessoais e inclua:
{
  "isTransaction": false,
  "response": "sua_resposta_helpful"
}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: financialPrompt
            }]
          }]
        }),
      });

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      try {
        extractedData = JSON.parse(aiText);
        
        if (extractedData.isTransaction) {
          // Salvar transação extraída
          const { error: transactionError } = await supabaseClient
            .from('transactions')
            .insert([{
              user_id: profile.id,
              amount: extractedData.amount,
              type: extractedData.type,
              category: extractedData.category,
              description: extractedData.description,
              processed_by_ai: true,
              whatsapp_message_id: savedMessage.id
            }]);

          if (transactionError) throw transactionError;
          
          aiResponse = `✅ Transação registrada!\n\nTipo: ${extractedData.type === 'income' ? 'Receita' : 'Despesa'}\nValor: R$ ${extractedData.amount.toFixed(2)}\nCategoria: ${extractedData.category}\nDescrição: ${extractedData.description}`;
        } else {
          aiResponse = extractedData.response || 'Mensagem recebida, mas não identifiquei uma transação financeira.';
        }
      } catch (parseError) {
        aiResponse = aiText || 'Desculpe, não consegui processar sua mensagem adequadamente.';
      }
    } catch (aiError) {
      console.error('Erro ao processar com Gemini:', aiError);
      aiResponse = 'Mensagem recebida! Para registrar uma transação, envie: "Gasto R$ 50 com almoço" ou "Recebi R$ 2000 salário".';
    }

    // Atualizar mensagem com resposta da IA
    await supabaseClient
      .from('whatsapp_messages')
      .update({
        ai_response: aiResponse,
        processed: true
      })
      .eq('id', savedMessage.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        transactionCreated: extractedData?.isTransaction || false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in whatsapp-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
