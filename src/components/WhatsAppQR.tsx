
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QrCode, Smartphone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const WhatsAppQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
    
    // Verificar status a cada 5 segundos
    const interval = setInterval(checkConnectionStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setIsConnected(data.is_connected || false);
        setQrCode(data.qr_code);
        setPhoneNumber(data.phone_number);
        
        if (data.is_connected) {
          setStatusMessage(`Conectado: ${data.phone_number}`);
        } else if (data.qr_code) {
          setStatusMessage('Aguardando escaneamento do QR Code...');
        } else {
          setStatusMessage('Desconectado');
        }
      } else {
        setIsConnected(false);
        setQrCode(null);
        setPhoneNumber(null);
        setStatusMessage('Nenhuma configuração encontrada');
      }
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      setStatusMessage('Erro ao verificar status');
    }
  };

  const generateQRCode = async () => {
    setIsLoading(true);
    setStatusMessage('Gerando QR Code...');
    
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-qr');
      
      if (error) {
        console.error('Erro da função:', error);
        throw new Error(error.message);
      }
      
      if (data?.success && data.qrCode) {
        setQrCode(data.qrCode);
        setStatusMessage('QR Code gerado! Escaneie com seu WhatsApp.');
        
        toast({
          title: 'QR Code gerado!',
          description: 'Escaneie o código com seu WhatsApp em 15 segundos.',
        });
      } else {
        throw new Error(data?.error || 'Erro ao gerar QR Code');
      }
    } catch (error: any) {
      console.error('Erro completo:', error);
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

  const disconnect = async () => {
    try {
      const { error } = await supabase.functions.invoke('whatsapp-restart');
      
      if (error) throw error;
      
      setIsConnected(false);
      setQrCode(null);
      setPhoneNumber(null);
      setStatusMessage('Desconectado');
      
      toast({
        title: 'WhatsApp desconectado',
        description: 'Sessão do WhatsApp foi encerrada.',
      });
      
      // Verificar status após desconectar
      setTimeout(checkConnectionStatus, 1000);
    } catch (error: any) {
      toast({
        title: 'Erro ao desconectar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          WhatsApp Connection
          {isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </CardTitle>
        <p className="text-sm text-gray-600">{statusMessage}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">WhatsApp Conectado!</p>
              <p className="text-green-600 text-sm">
                Número: {phoneNumber}
              </p>
              <p className="text-green-600 text-sm mt-2">
                Agora os usuários podem enviar mensagens para a IA
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={disconnect} variant="outline" className="flex-1">
                Desconectar WhatsApp
              </Button>
              <Button onClick={checkConnectionStatus} variant="outline" size="icon">
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
                    alt="QR Code WhatsApp" 
                    className="max-w-64 max-h-64 border rounded-lg"
                    onError={() => {
                      setStatusMessage('Erro ao carregar QR Code');
                      setQrCode(null);
                    }}
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <QrCode className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-800 font-medium">Escaneie com seu WhatsApp</p>
                  <p className="text-blue-600 text-sm">
                    Abra o WhatsApp → Menu (⋮) → Dispositivos conectados → Conectar dispositivo
                  </p>
                  <p className="text-blue-500 text-xs mt-2">
                    Conexão automática em 15 segundos após escaneamento
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={generateQRCode} variant="outline" className="flex-1">
                    Gerar Novo QR Code
                  </Button>
                  <Button onClick={checkConnectionStatus} variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">WhatsApp não conectado</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Gere um QR Code para conectar o WhatsApp
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={generateQRCode} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Gerando QR Code...' : 'Conectar WhatsApp'}
                  </Button>
                  <Button onClick={checkConnectionStatus} variant="outline" size="icon">
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

export default WhatsAppQR;
