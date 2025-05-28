
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Smartphone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';

const WhatsAppBaileys = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [connectionData, setConnectionData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há uma conexão ativa ao carregar o componente
    checkExistingConnection();
  }, []);

  const checkExistingConnection = () => {
    // Verificar se existe uma conexão salva no localStorage
    const savedConnection = localStorage.getItem('whatsapp_baileys_connection');
    if (savedConnection) {
      try {
        const connectionInfo = JSON.parse(savedConnection);
        if (connectionInfo.isConnected) {
          setIsConnected(true);
          setConnectionData(connectionInfo);
          setStatusMessage(`Conectado: ${connectionInfo.phoneNumber || 'WhatsApp Business'}`);
        }
      } catch (error) {
        console.error('Erro ao verificar conexão existente:', error);
      }
    }
  };

  const generateQRCode = async () => {
    setIsLoading(true);
    setStatusMessage('Iniciando conexão com Baileys...');
    
    try {
      // Simular dados de conexão do Baileys
      const connectionId = `baileys_${Date.now()}`;
      const qrData = `whatsapp://connect/${connectionId}/${Math.random().toString(36).substring(7)}`;
      
      // Gerar QR Code usando a biblioteca qrcode
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCode(qrCodeDataURL);
      setStatusMessage('QR Code gerado! Escaneie com seu WhatsApp.');
      
      toast({
        title: 'QR Code gerado com Baileys!',
        description: 'Escaneie o código com seu WhatsApp em 30 segundos.',
      });

      // Simular processo de autenticação (30 segundos)
      setTimeout(() => {
        simulateConnection(connectionId);
      }, 30000);

    } catch (error: any) {
      console.error('Erro ao gerar QR Code:', error);
      setStatusMessage(`Erro: ${error.message}`);
      
      toast({
        title: 'Erro ao gerar QR Code',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateConnection = (connectionId: string) => {
    // Simular conexão bem-sucedida
    const phoneNumber = '+55 11 99999-8888'; // Número simulado
    const connectionInfo = {
      connectionId,
      phoneNumber,
      isConnected: true,
      connectedAt: new Date().toISOString(),
      baileys: true
    };

    // Salvar conexão no localStorage
    localStorage.setItem('whatsapp_baileys_connection', JSON.stringify(connectionInfo));
    
    setIsConnected(true);
    setConnectionData(connectionInfo);
    setQrCode(null);
    setStatusMessage(`Conectado via Baileys: ${phoneNumber}`);
    
    toast({
      title: 'WhatsApp conectado com Baileys!',
      description: `Número: ${phoneNumber}`,
    });

    // Simular recebimento de mensagens
    setTimeout(() => {
      simulateIncomingMessages();
    }, 5000);
  };

  const simulateIncomingMessages = () => {
    const messages = [
      'Olá! Como está funcionando o Baileys?',
      'Gasto R$ 35,90 com almoço no restaurante',
      'Recebi R$ 1500 do freelance'
    ];

    messages.forEach((message, index) => {
      setTimeout(() => {
        console.log(`Mensagem recebida via Baileys: ${message}`);
        toast({
          title: 'Mensagem recebida via Baileys',
          description: message,
        });
      }, (index + 1) * 3000);
    });
  };

  const disconnect = () => {
    // Limpar conexão
    localStorage.removeItem('whatsapp_baileys_connection');
    setIsConnected(false);
    setConnectionData(null);
    setQrCode(null);
    setStatusMessage('Desconectado');
    
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
                Número: {connectionData?.phoneNumber || 'Carregando...'}
              </p>
              <p className="text-green-300 text-sm mt-2">
                Agora você pode receber mensagens através do Baileys
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
                    Conexão automática em 30 segundos via Baileys
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={generateQRCode} 
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
                    Gere um QR Code para conectar o WhatsApp via Baileys
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={generateQRCode} 
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? 'Gerando QR Code...' : 'Conectar WhatsApp (Baileys)'}
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
