
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

    // Verificar se o usuário é admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error('Apenas administradores podem gerenciar WhatsApp');
    }

    // Gerar QR Code simulado (em produção, você integraria com WhatsApp Web API)
    const qrCodeData = `whatsapp-session-${Date.now()}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCodeData)}`;

    // Salvar configuração no banco
    const { error } = await supabaseClient
      .from('whatsapp_config')
      .upsert([{
        qr_code: qrCodeUrl,
        is_connected: false,
        session_data: { sessionId: qrCodeData },
        updated_at: new Date().toISOString()
      }]);

    if (error) throw error;

    // Simular conexão após 30 segundos (em produção, isso seria feito pelo WhatsApp)
    setTimeout(async () => {
      await supabaseClient
        .from('whatsapp_config')
        .update({
          is_connected: true,
          last_connected_at: new Date().toISOString()
        })
        .eq('qr_code', qrCodeUrl);
    }, 30000);

    return new Response(
      JSON.stringify({ qrCode: qrCodeUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in whatsapp-qr function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
