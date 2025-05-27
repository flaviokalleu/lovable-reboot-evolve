
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

    const { message, from, type = 'text', mediaUrl, timestamp } = await req.json();
    console.log('Mensagem WhatsApp recebida:', { message, from, type, timestamp });

    // Verificar se o WhatsApp está conectado
    const { data: config } = await supabaseClient
      .from('whatsapp_config')
      .select('*')
      .eq('is_connected', true)
      .maybeSingle();

    if (!config) {
      console.log('WhatsApp não está conectado');
      return new Response(
        JSON.stringify({ error: 'WhatsApp não conectado' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Procurar usuário pelo número do WhatsApp
    let userId = null;
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('whatsapp_number', from)
      .maybeSingle();

    if (profile) {
      userId = profile.id;
      console.log('Usuário encontrado:', userId);
    } else {
      console.log('Usuário não encontrado para o número:', from);
    }

    // Salvar mensagem no banco
    const { data: savedMessage, error: messageError } = await supabaseClient
      .from('whatsapp_messages')
      .insert([{
        user_id: userId,
        user_phone: from,
        message_content: message,
        message_type: type,
        media_url: mediaUrl,
        processed: false
      }])
      .select()
      .single();

    if (messageError) {
      console.error('Erro ao salvar mensagem:', messageError);
      throw messageError;
    }

    console.log('Mensagem salva:', savedMessage);

    // Processar mensagem com Gemini AI
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY não configurada');
      throw new Error('GEMINI_API_KEY não configurada');
    }

    let aiResponse = '';
    let extractedData = null;

    const financialPrompt = `Você é um assistente financeiro IA especializado em extrair dados de transações de mensagens do WhatsApp.

Analise a seguinte mensagem e determine se contém informações financeiras:
"${message}"

Se for uma transação financeira, responda APENAS com um JSON válido no formato:
{
  "isTransaction": true,
  "type": "income" ou "expense",
  "amount": valor_numerico,
  "category": "food|transport|entertainment|health|education|shopping|bills|salary|investment|other",
  "description": "descrição_clara_da_transação"
}

Se NÃO for uma transação financeira, responda com um JSON no formato:
{
  "isTransaction": false,
  "response": "resposta_útil_sobre_finanças_pessoais_ou_cumprimento"
}

Exemplos de transações:
- "Gasto R$ 50 com almoço" = {"isTransaction": true, "type": "expense", "amount": 50, "category": "food", "description": "Almoço"}
- "Recebi R$ 2000 salário" = {"isTransaction": true, "type": "income", "amount": 2000, "category": "salary", "description": "Salário"}
- "Paguei R$ 120 conta de luz" = {"isTransaction": true, "type": "expense", "amount": 120, "category": "bills", "description": "Conta de luz"}

IMPORTANTE: Responda APENAS com JSON válido, sem texto adicional.`;

    try {
      console.log('Processando com Gemini...');
      
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Resposta completa do Gemini:', JSON.stringify(data, null, 2));
      
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('Texto da IA:', aiText);
      
      if (!aiText) {
        throw new Error('Resposta vazia do Gemini');
      }
      
      try {
        // Limpar resposta para extrair apenas o JSON
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? jsonMatch[0] : aiText;
        
        extractedData = JSON.parse(jsonText);
        console.log('Dados extraídos:', extractedData);
        
        if (extractedData.isTransaction && userId) {
          // Salvar transação extraída apenas se o usuário estiver cadastrado
          const { error: transactionError } = await supabaseClient
            .from('transactions')
            .insert([{
              user_id: userId,
              amount: extractedData.amount,
              type: extractedData.type,
              category: extractedData.category,
              description: extractedData.description,
              processed_by_ai: true,
              whatsapp_message_id: savedMessage.id
            }]);

          if (transactionError) {
            console.error('Erro ao salvar transação:', transactionError);
            aiResponse = `❌ Erro ao registrar transação: ${transactionError.message}`;
          } else {
            aiResponse = `✅ *Transação registrada com sucesso!*

💰 *Valor:* R$ ${extractedData.amount.toFixed(2)}
📊 *Tipo:* ${extractedData.type === 'income' ? 'Receita' : 'Despesa'}
🏷️ *Categoria:* ${getCategoryName(extractedData.category)}
📝 *Descrição:* ${extractedData.description}

_Transação processada automaticamente pela IA via WPPConnect._`;
            console.log('Transação salva com sucesso');
          }
        } else if (extractedData.isTransaction && !userId) {
          aiResponse = `🤖 *Transação identificada!*

Para registrar automaticamente suas transações, você precisa se cadastrar no sistema com este número de WhatsApp.

💰 *Transação detectada:*
- Valor: R$ ${extractedData.amount.toFixed(2)}
- Tipo: ${extractedData.type === 'income' ? 'Receita' : 'Despesa'}
- Categoria: ${getCategoryName(extractedData.category)}

Entre em contato com o administrador para vincular seu número.`;
        } else {
          aiResponse = extractedData.response || '🤖 Olá! Sou seu assistente financeiro via WhatsApp! 

Para registrar transações, envie mensagens como:
• "Gasto R$ 50 com almoço"
• "Recebi R$ 2000 salário"  
• "Paguei R$ 120 conta de luz"

Posso ajudar com dúvidas sobre finanças pessoais também! 💰';
        }
      } catch (parseError) {
        console.error('Erro ao fazer parse do JSON:', parseError);
        console.error('Texto que causou erro:', aiText);
        aiResponse = '🤖 Olá! Sou seu assistente financeiro via WhatsApp!

Para registrar transações, envie mensagens como:
• "Gasto R$ 50 com almoço"
• "Recebi R$ 2000 salário"
• "Paguei R$ 120 conta de luz"

Posso ajudar com dúvidas sobre finanças pessoais também! 💰';
      }
    } catch (aiError) {
      console.error('Erro ao processar com Gemini:', aiError);
      aiResponse = '🤖 Olá! Sou seu assistente financeiro via WhatsApp!

No momento estou com dificuldades técnicas para processar sua mensagem. Tente novamente em alguns instantes.

Para registrar transações, envie mensagens como:
• "Gasto R$ 50 com almoço"
• "Recebi R$ 2000 salário"';
    }

    // Atualizar mensagem com resposta da IA
    const { error: updateError } = await supabaseClient
      .from('whatsapp_messages')
      .update({
        ai_response: aiResponse,
        processed: true
      })
      .eq('id', savedMessage.id);

    if (updateError) {
      console.error('Erro ao atualizar mensagem:', updateError);
    }

    console.log(`Resposta enviada para ${from}:`, aiResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        transactionCreated: extractedData?.isTransaction && userId ? true : false,
        userRegistered: userId ? true : false,
        apiType: 'wppconnect'
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

function getCategoryName(category: string): string {
  const categories: Record<string, string> = {
    food: 'Alimentação',
    transport: 'Transporte',
    entertainment: 'Entretenimento',
    health: 'Saúde',
    education: 'Educação',
    shopping: 'Compras',
    bills: 'Contas',
    salary: 'Salário',
    investment: 'Investimento',
    other: 'Outros',
  };
  
  return categories[category] || category;
}
