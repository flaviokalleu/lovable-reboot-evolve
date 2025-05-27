
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

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) throw new Error('Usuário não autenticado');

    console.log('Usuario autenticado:', user.id);

    // Verificar se é admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error('Apenas administradores podem gerenciar WhatsApp');
    }

    console.log('Admin verificado, gerando QR Code...');

    // Gerar QR Code para autenticação
    const sessionId = `whatsapp-session-${Date.now()}`;
    const qrCodeData = `https://wa.me/qr/${sessionId}-${Math.random().toString(36).substring(7)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCodeData)}`;

    console.log('QR Code gerado:', qrCodeUrl);

    // Limpar configurações anteriores
    await supabaseClient
      .from('whatsapp_config')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Salvar nova configuração no banco
    const { data, error } = await supabaseClient
      .from('whatsapp_config')
      .insert([{
        qr_code: qrCodeUrl,
        session_id: sessionId,
        is_connected: false,
        phone_number: null,
        session_data: { sessionId, qrData: qrCodeData },
        last_connected_at: null,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar configuração:', error);
      throw error;
    }

    console.log('Configuração salva:', data);

    // Simular processo de autenticação (em 15 segundos)
    setTimeout(async () => {
      try {
        const phoneNumber = '+5511999887766'; // Número simulado para teste
        console.log('Simulando conexão do WhatsApp...');
        
        const { error: updateError } = await supabaseClient
          .from('whatsapp_config')
          .update({
            is_connected: true,
            phone_number: phoneNumber,
            last_connected_at: new Date().toISOString(),
            qr_code: null
          })
          .eq('session_id', sessionId);

        if (updateError) {
          console.error('Erro ao atualizar status:', updateError);
        } else {
          console.log(`WhatsApp conectado com número: ${phoneNumber}`);
          
          // Iniciar listener de mensagens simulado
          startMessageListener(supabaseClient, phoneNumber);
        }
      } catch (error) {
        console.error('Erro ao conectar WhatsApp:', error);
      }
    }, 15000); // 15 segundos para simular escaneamento do QR

    return new Response(
      JSON.stringify({ 
        success: true,
        qrCode: qrCodeUrl,
        sessionId: sessionId,
        message: 'QR Code gerado com sucesso. Escaneie com seu WhatsApp em 15 segundos.'
      }),
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

// Função para simular o listener de mensagens do WhatsApp
async function startMessageListener(supabaseClient: any, phoneNumber: string) {
  console.log(`Iniciando listener para ${phoneNumber}`);
  
  // Simular mensagem de teste após conectar
  setTimeout(async () => {
    const testMessage = {
      from: '+5511888888888',
      message: 'Gasto R$ 35 com almoço no restaurante',
      timestamp: new Date().toISOString()
    };
    
    console.log('Simulando mensagem recebida:', testMessage);
    
    // Processar mensagem via webhook
    try {
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify(testMessage)
      });
      
      const result = await response.json();
      console.log('Resposta do webhook:', result);
    } catch (error) {
      console.error('Erro ao chamar webhook:', error);
    }
  }, 5000); // 5 segundos após conectar
}
