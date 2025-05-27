
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
      throw new Error('Apenas administradores podem gerenciar WhatsApp');
    }

    // Iniciar WhatsApp usando Baileys (simulado)
    console.log('Iniciando WhatsApp com Baileys...');
    
    // Gerar QR Code para autenticação
    const sessionId = `whatsapp-session-${Date.now()}`;
    const qrCodeData = `https://wa.me/qr/${sessionId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCodeData)}`;

    // Salvar configuração no banco
    const { error } = await supabaseClient
      .from('whatsapp_config')
      .upsert([{
        id: crypto.randomUUID(),
        qr_code: qrCodeUrl,
        session_id: sessionId,
        is_connected: false,
        phone_number: null,
        session_data: { sessionId, qrData: qrCodeData },
        last_connected_at: null,
        updated_at: new Date().toISOString()
      }]);

    if (error) throw error;

    // Simular processo de autenticação (em produção, isso seria feito pelo Baileys)
    setTimeout(async () => {
      try {
        const phoneNumber = '+5511999999999'; // Número simulado
        await supabaseClient
          .from('whatsapp_config')
          .update({
            is_connected: true,
            phone_number: phoneNumber,
            last_connected_at: new Date().toISOString(),
            qr_code: null
          })
          .eq('session_id', sessionId);

        console.log(`WhatsApp conectado com número: ${phoneNumber}`);
        
        // Iniciar webhook listener (simulado)
        startWebhookListener(supabaseClient, phoneNumber);
      } catch (error) {
        console.error('Erro ao conectar WhatsApp:', error);
      }
    }, 30000); // 30 segundos para simular escaneamento do QR

    return new Response(
      JSON.stringify({ 
        qrCode: qrCodeUrl,
        sessionId: sessionId,
        message: 'QR Code gerado. Escaneie com seu WhatsApp.'
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
async function startWebhookListener(supabaseClient: any, phoneNumber: string) {
  console.log(`Iniciando listener para ${phoneNumber}`);
  
  // Em produção, aqui você configuraria o Baileys para escutar mensagens
  // Simulação de mensagens recebidas
  setInterval(async () => {
    // Simular mensagem recebida (apenas para teste)
    const mockMessage = {
      from: '+5511888888888',
      message: 'Gasto R$ 25 com lanche',
      timestamp: new Date().toISOString()
    };
    
    console.log('Mensagem simulada recebida:', mockMessage);
    // Processar mensagem seria feito aqui
  }, 60000); // A cada minuto para teste
}
