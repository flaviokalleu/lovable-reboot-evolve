
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

    const { email } = await req.json();

    // Verificar se o usuário existe no sistema
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado no sistema' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Gerar código de autenticação
    const authCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Salvar código temporário no banco
    const { error: saveError } = await supabaseClient
      .from('whatsapp_config')
      .upsert([{
        id: profile.id,
        auth_code: authCode,
        auth_email: email,
        auth_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos
        is_connected: false,
        updated_at: new Date().toISOString()
      }]);

    if (saveError) throw saveError;

    // Aqui você enviaria o código por email (integrar com SendGrid, etc.)
    console.log(`Código de autenticação para ${email}: ${authCode}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Código de autenticação enviado para o email',
        authCode // Remover em produção
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in whatsapp-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
