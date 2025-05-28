
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, userId } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar se o usuário existe
    const { data: user, error: userError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key do Gemini não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar dados financeiros do usuário
    const { data: transactions } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: budgets } = await supabaseClient
      .from('budgets')
      .select('*')
      .eq('user_id', userId)

    // Preparar contexto financeiro
    const financialContext = {
      transactions: transactions || [],
      budgets: budgets || [],
      totalTransactions: transactions?.length || 0
    }

    const systemPrompt = `Você é um assistente financeiro especializado em análise de dados financeiros. 
    Você tem acesso aos seguintes dados do usuário autenticado (ID: ${userId}):
    
    Transações recentes: ${JSON.stringify(financialContext.transactions)}
    Orçamentos: ${JSON.stringify(financialContext.budgets)}
    
    Forneça conselhos financeiros personalizados, análises de gastos e sugestões de economia baseadas nos dados reais do usuário.
    Seja preciso, útil e mantenha suas respostas em português brasileiro.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nPergunta do usuário: ${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Erro na API do Gemini:', error)
      return new Response(
        JSON.stringify({ error: 'Erro ao processar solicitação com IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar sua solicitação.'

    // Salvar análise no banco
    await supabaseClient
      .from('ai_analysis')
      .insert({
        user_id: userId,
        analysis_type: 'financial_advice',
        content: aiResponse,
        metadata: { prompt, financialContext }
      })

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
