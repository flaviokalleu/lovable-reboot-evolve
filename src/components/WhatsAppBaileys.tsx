
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Smartphone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';

const WhatsAppBaileys = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [connectedPhone, setConnectedPhone] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingConnection();
    return () => {
      if (socket) {
        socket.end();
      }
    };
  }, []);

  const checkExistingConnection = () => {
    const savedConnection = localStorage.getItem('baileys_connection');
    if (savedConnection) {
      try {
        const connectionInfo = JSON.parse(savedConnection);
        if (connectionInfo.isConnected) {
          setIsConnected(true);
          setConnectedPhone(connectionInfo.phoneNumber);
          setStatusMessage(`Conectado: ${connectionInfo.phoneNumber}`);
        }
      } catch (error) {
        console.error('Erro ao verificar conexão existente:', error);
      }
    }
  };

  const startBaileysConnection = async () => {
    setIsConnecting(true);
    setStatusMessage('Iniciando conexão com Baileys...');
    
    try {
      // Usar autenticação multi-arquivo do Baileys
      const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
      
      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        defaultQueryTimeoutMs: 60_000,
      });

      setSocket(sock);

      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
          // Gerar QR Code real do Baileys
          try {
            const qrDataURL = await QRCode.toDataURL(qr, {
              width: 300,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            setQrCode(qrDataURL);
            setStatusMessage('QR Code gerado! Escaneie com seu WhatsApp.');
            
            toast({
              title: 'QR Code gerado!',
              description: 'Escaneie o código com seu WhatsApp.',
            });
          } catch (error) {
            console.error('Erro ao gerar QR Code:', error);
          }
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
          
          setIsConnected(false);
          setQrCode(null);
          localStorage.removeItem('baileys_connection');
          
          if (shouldReconnect) {
            setStatusMessage('Reconectando...');
            setTimeout(() => startBaileysConnection(), 3000);
          } else {
            setStatusMessage('Desconectado do WhatsApp');
            toast({
              title: 'WhatsApp desconectado',
              description: 'Você foi deslogado do WhatsApp.',
              variant: 'destructive',
            });
          }
        } else if (connection === 'open') {
          setIsConnected(true);
          setQrCode(null);
          setIsConnecting(false);
          
          // Obter informações do número
          const phoneNumber = sock.user?.id?.split(':')[0] || 'Número não disponível';
          setConnectedPhone(phoneNumber);
          setStatusMessage(`Conectado: ${phoneNumber}`);
          
          // Salvar conexão no localStorage
          const connectionInfo = {
            isConnected: true,
            phoneNumber,
            connectedAt: new Date().toISOString(),
          };
          localStorage.setItem('baileys_connection', JSON.stringify(connectionInfo));
          
          toast({
            title: 'WhatsApp conectado!',
            description: `Conectado como: ${phoneNumber}`,
          });
        }
      });

      sock.ev.on('creds.update', saveCreds);
      
      // Listener para mensagens recebidas
      sock.ev.on('messages.upsert', async (m) => {
        const messages = m.messages;
        
        for (const message of messages) {
          if (!message.key.fromMe && message.message) {
            const from = message.key.remoteJid;
            const messageText = message.message.conversation || 
                              message.message.extendedTextMessage?.text || '';
            
            if (messageText) {
              console.log(`Mensagem recebida de ${from}: ${messageText}`);
              
              // Processar mensagem com IA (aqui você pode integrar com sua IA)
              await processMessageWithAI(from, messageText, sock);
            }
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao conectar com Baileys:', error);
      setStatusMessage(`Erro: ${error.message}`);
      setIsConnecting(false);
      
      toast({
        title: 'Erro ao conectar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const processMessageWithAI = async (from: string, message: string, sock: any) => {
    try {
      // Aqui você pode integrar com sua IA (Gemini, OpenAI, etc.)
      // Por agora, vou fazer uma resposta simples
      let response = '';
      
      if (message.toLowerCase().includes('gasto') || message.toLowerCase().includes('paguei')) {
        response = '💰 Transação de despesa registrada! Obrigado por usar nosso sistema.';
      } else if (message.toLowerCase().includes('recebi') || message.toLowerCase().includes('salário')) {
        response = '💰 Transação de receita registrada! Obrigado por usar nosso sistema.';
      } else {
        response = '🤖 Olá! Sou seu assistente financeiro. Envie mensagens como:\n• "Gasto R$ 50 com almoço"\n• "Recebi R$ 2000 salário"';
      }
      
      // Enviar resposta
      await sock.sendMessage(from, { text: response });
      
      toast({
        title: 'Mensagem processada',
        description: `Resposta enviada para ${from}`,
      });
      
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.end();
    }
    setIsConnected(false);
    setConnectedPhone(null);
    setQrCode(null);
    setStatusMessage('Desconectado');
    localStorage.removeItem('baileys_connection');
    
    toast({
      title: 'WhatsApp desconectado',
      description: 'Sessão do Baileys foi encerrada.',
    });
  };

  const refreshConnection = () => {
    setStatusMessage('Verificando conexão...');
    checkExistingConnection();
    
    setTimeout(() => {
      if (!isConnected) {
        setStatusMessage('Nenhuma conexão ativa encontrada');
      }
    }, 1000);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Smartphone className="h-5 w-5" />
          WhatsApp Connection (Baileys)
          {isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400" />
          )}
        </CardTitle>
        <p className="text-sm text-gray-400">{statusMessage}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-900/50 rounded-lg border border-green-700">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-medium">WhatsApp Conectado via Baileys!</p>
              <p className="text-green-300 text-sm">
                Número: {connectedPhone || 'Carregando...'}
              </p>
              <p className="text-green-300 text-sm mt-2">
                Agora você pode receber mensagens reais através do Baileys
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={disconnect} 
                variant="outline" 
                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
              >
                Desconectar WhatsApp
              </Button>
              <Button 
                onClick={refreshConnection} 
                variant="outline" 
                size="icon"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {qrCode ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={qrCode} 
                    alt="QR Code WhatsApp Baileys" 
                    className="max-w-80 max-h-80 border border-gray-700 rounded-lg shadow-lg bg-white p-4"
                  />
                </div>
                <div className="p-4 bg-blue-900/50 rounded-lg border border-blue-700">
                  <QrCode className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 font-medium">Escaneie com seu WhatsApp</p>
                  <p className="text-blue-300 text-sm">
                    Abra o WhatsApp → Menu (⋮) → Dispositivos conectados → Conectar dispositivo
                  </p>
                  <p className="text-blue-200 text-xs mt-2">
                    Conexão real via Baileys - Aguardando escaneamento
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={startBaileysConnection} 
                    variant="outline" 
                    className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                  >
                    Gerar Novo QR Code
                  </Button>
                  <Button 
                    onClick={refreshConnection} 
                    variant="outline" 
                    size="icon"
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Smartphone className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">WhatsApp não conectado</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Conecte seu WhatsApp usando Baileys para receber mensagens reais
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={startBaileysConnection} 
                    disabled={isConnecting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isConnecting ? 'Conectando...' : 'Conectar WhatsApp (Baileys)'}
                  </Button>
                  <Button 
                    onClick={refreshConnection} 
                    variant="outline" 
                    size="icon"
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppBaileys;
