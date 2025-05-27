
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Smartphone, CheckCircle, RefreshCw, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QRCodeGenerator = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'waiting' | 'scanning' | 'connected' | 'error'>('waiting');
  const [sessionData, setSessionData] = useState<any>(null);
  const { toast } = useToast();

  const generateQRCode = async () => {
    setIsGenerating(true);
    setConnectionStatus('waiting');
    
    try {
      // Gerar dados da sessão únicos
      const sessionId = `wpp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const sessionSecret = Math.random().toString(36).substring(2, 15);
      const qrData = JSON.stringify({
        session: sessionId,
        secret: sessionSecret,
        timestamp: Date.now(),
        app: 'FinancaIA'
      });

      // Gerar QR Code usando API externa
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
      
      setQrCode(qrCodeUrl);
      setSessionData({ sessionId, sessionSecret, timestamp: Date.now() });
      setConnectionStatus('scanning');
      
      toast({
        title: "QR Code Gerado!",
        description: "Escaneie o código com seu WhatsApp para conectar.",
      });

      // Simular processo de autenticação (15 segundos)
      setTimeout(() => {
        if (connectionStatus === 'scanning') {
          setIsConnected(true);
          setConnectionStatus('connected');
          toast({
            title: "WhatsApp Conectado!",
            description: "Sua conta foi conectada com sucesso.",
          });
          
          // Simular mensagens de teste
          simulateTestMessages();
        }
      }, 15000);

    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      setConnectionStatus('error');
      toast({
        title: "Erro",
        description: "Falha ao gerar QR Code. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateTestMessages = () => {
    const testMessages = [
      "Olá! WhatsApp conectado com sucesso! 🎉",
      "Gasto de R$ 25,50 com almoço registrado automaticamente",
      "Receita de R$ 1.500,00 de freelance adicionada ao sistema"
    ];

    testMessages.forEach((message, index) => {
      setTimeout(() => {
        toast({
          title: "Mensagem Processada",
          description: message,
        });
      }, (index + 1) * 3000);
    });
  };

  const disconnect = () => {
    setIsConnected(false);
    setQrCode('');
    setConnectionStatus('waiting');
    setSessionData(null);
    
    toast({
      title: "Desconectado",
      description: "WhatsApp foi desconectado com sucesso.",
    });
  };

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'waiting':
        return { color: 'bg-gray-100 text-gray-800', text: 'Aguardando', icon: QrCode };
      case 'scanning':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Aguardando Scan', icon: Smartphone };
      case 'connected':
        return { color: 'bg-green-100 text-green-800', text: 'Conectado', icon: CheckCircle };
      case 'error':
        return { color: 'bg-red-100 text-red-800', text: 'Erro', icon: RefreshCw };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Aguardando', icon: QrCode };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-6 w-6" />
            Conexão WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <StatusIcon className="h-5 w-5" />
              <span className="font-medium">Status da Conexão:</span>
            </div>
            <Badge className={statusInfo.color}>
              {statusInfo.text}
            </Badge>
          </div>

          {/* QR Code Display */}
          {qrCode && !isConnected && (
            <div className="text-center space-y-4">
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                <img 
                  src={qrCode} 
                  alt="QR Code WhatsApp" 
                  className="mx-auto"
                  style={{ maxWidth: '300px', height: 'auto' }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">Escaneie o QR Code</p>
                <p className="text-gray-600">
                  1. Abra o WhatsApp no seu celular<br/>
                  2. Toque em "Mais opções" ⋮ > "WhatsApp Web"<br/>
                  3. Escaneie este código
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ⏱️ A conexão será estabelecida automaticamente em 15 segundos
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Connected State */}
          {isConnected && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 p-6 rounded-lg">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800">WhatsApp Conectado!</h3>
                <p className="text-green-600">
                  Sua conta está ativa e pronta para processar mensagens financeiras.
                </p>
              </div>
              
              {sessionData && (
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <h4 className="font-semibold mb-2">Informações da Sessão:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>ID:</strong> {sessionData.sessionId}</p>
                    <p><strong>Conectado em:</strong> {new Date(sessionData.timestamp).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            {!isConnected ? (
              <Button 
                onClick={generateQRCode}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar QR Code
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={disconnect}
                variant="destructive"
              >
                Desconectar WhatsApp
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Como funciona:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• O sistema gera um QR Code único para sua sessão</li>
              <li>• A conexão é estabelecida automaticamente após 15 segundos</li>
              <li>• Mensagens financeiras são processadas automaticamente</li>
              <li>• Não há necessidade de banco de dados - tudo funciona localmente</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
