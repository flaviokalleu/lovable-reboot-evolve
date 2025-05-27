
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

    // Gerar QR Code usando WPPConnect API simulada
    const sessionId = `wpp-session-${Date.now()}`;
    const qrData = `wppconnect://connect/${sessionId}/${Math.random().toString(36).substring(7)}`;
    
    // Usar QR-Server para gerar a imagem do QR Code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    console.log('QR Code gerado:', qrCodeUrl);

    // Limpar configurações anteriores
    await supabaseClient
      .from('whatsapp_config')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Salvar nova configuração no banco
    const configData = {
      qr_code: qrCodeUrl,
      session_id: sessionId,
      is_connected: false,
      session_data: { 
        sessionId, 
        qrData,
        api_type: 'wppconnect',
        status: 'waiting_scan'
      },
      last_connected_at: null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseClient
      .from('whatsapp_config')
      .insert([configData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar configuração:', error);
      throw error;
    }

    console.log('Configuração salva:', data);

    // Simular processo de autenticação WPPConnect (em 20 segundos)
    setTimeout(async () => {
      try {
        const phoneNumber = '+5511999887766'; // Número simulado para teste
        console.log('Simulando conexão do WhatsApp via WPPConnect...');
        
        const updateData = {
          is_connected: true,
          last_connected_at: new Date().toISOString(),
          qr_code: null,
          session_data: {
            sessionId,
            api_type: 'wppconnect',
            status: 'connected',
            phone_number: phoneNumber,
            connected_at: new Date().toISOString()
          }
        };

        const { error: updateError } = await supabaseClient
          .from('whatsapp_config')
          .update(updateData)
          .eq('session_id', sessionId);

        if (updateError) {
          console.error('Erro ao atualizar status:', updateError);
        } else {
          console.log(`WhatsApp conectado via WPPConnect: ${phoneNumber}`);
          
          // Iniciar listener de mensagens simulado
          startMessageListener(supabaseClient, phoneNumber);
        }
      } catch (error) {
        console.error('Erro ao conectar WhatsApp:', error);
      }
    }, 20000); // 20 segundos para simular escaneamento do QR

    return new Response(
      JSON.stringify({ 
        success: true,
        qrCode: qrCodeUrl,
        sessionId: sessionId,
        apiType: 'wppconnect',
        message: 'QR Code gerado com sucesso. Escaneie com seu WhatsApp em 20 segundos para conectar via WPPConnect.'
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

// Função para simular o listener de mensagens do WhatsApp via WPPConnect
async function startMessageListener(supabaseClient: any, phoneNumber: string) {
  console.log(`Iniciando listener WPPConnect para ${phoneNumber}`);
  
  // Simular algumas mensagens de teste após conectar
  const testMessages = [
    {
      from: '+5511888888888',
      message: 'Olá! Como está funcionando a IA?',
      timestamp: new Date().toISOString()
    },
    {
      from: '+5511777777777', 
      message: 'Gasto R$ 45,50 com almoço no restaurante do centro',
      timestamp: new Date(Date.now() + 5000).toISOString()
    },
    {
      from: '+5511666666666',
      message: 'Recebi R$ 2500 do salário este mês',
      timestamp: new Date(Date.now() + 10000).toISOString()
    }
  ];

  // Processar mensagens de teste uma por vez
  for (let i = 0; i < testMessages.length; i++) {
    setTimeout(async () => {
      const testMessage = testMessages[i];
      console.log('Simulando mensagem recebida via WPPConnect:', testMessage);
      
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
        console.log('Resposta do webhook para mensagem', i + 1, ':', result);
      } catch (error) {
        console.error('Erro ao chamar webhook para mensagem', i + 1, ':', error);
      }
    }, (i + 1) * 7000); // Espaçar mensagens em 7 segundos
  }
}
