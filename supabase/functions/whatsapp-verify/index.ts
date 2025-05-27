
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

    const { email, code, phoneNumber } = await req.json();

    // Verificar código
    const { data: config, error: configError } = await supabaseClient
      .from('whatsapp_config')
      .select('*')
      .eq('auth_email', email)
      .eq('auth_code', code)
      .gt('auth_expires_at', new Date().toISOString())
      .single();

    if (configError || !config) {
      return new Response(
        JSON.stringify({ error: 'Código inválido ou expirado' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Atualizar configuração com número do WhatsApp
    const { error: updateError } = await supabaseClient
      .from('whatsapp_config')
      .update({
        whatsapp_number: phoneNumber,
        is_connected: true,
        last_connected_at: new Date().toISOString(),
        auth_code: null,
        auth_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', config.id);

    if (updateError) throw updateError;

    // Atualizar perfil do usuário
    await supabaseClient
      .from('profiles')
      .update({ whatsapp_number: phoneNumber })
      .eq('id', config.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp conectado com sucesso!',
        userId: config.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in whatsapp-verify function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
