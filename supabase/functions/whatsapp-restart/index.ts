
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

    // Verificar se o usuário é admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autorização necessário');
    }

    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) throw new Error('Usuário não autenticado');

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error('Apenas administradores podem reiniciar o WhatsApp');
    }

    // Reiniciar conexão do WhatsApp - limpar todas as configurações
    const { error } = await supabaseClient
      .from('whatsapp_config')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Erro ao limpar configurações:', error);
      throw error;
    }

    console.log('WhatsApp reiniciado - todas as configurações foram limpas');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'WhatsApp foi reiniciado com sucesso. Todas as configurações foram removidas.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in whatsapp-restart function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
