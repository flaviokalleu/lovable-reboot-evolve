
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { question } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    // Buscar dados financeiros do usuário
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: transactions } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Preparar contexto financeiro
    const financialContext = transactions ? 
      `Dados financeiros do usuário (últimas 50 transações):
      ${transactions.map(t => `${t.type === 'income' ? 'Receita' : 'Despesa'}: R$ ${t.amount} - ${t.category} - ${t.description || 'Sem descrição'}`).join('\n')}` 
      : 'Nenhuma transação encontrada.';

    const prompt = `Você é um consultor financeiro especializado em finanças pessoais. 
    Analise os dados financeiros do usuário e responda à pergunta de forma clara e útil.
    
    ${financialContext}
    
    Pergunta do usuário: ${question}
    
    Forneça uma resposta prática e personalizada baseada nos dados financeiros apresentados.
    Se não houver dados suficientes, forneça conselhos gerais sobre o tópico perguntado.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar sua pergunta.';

    // Salvar análise no banco
    await supabaseClient
      .from('ai_analysis')
      .insert([{
        user_id: user.id,
        analysis_type: 'financial_question',
        content: aiResponse,
        metadata: { question }
      }]);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-financial-advisor function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
