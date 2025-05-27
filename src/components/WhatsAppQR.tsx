
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QrCode, Smartphone, CheckCircle, XCircle } from 'lucide-react';

const WhatsAppQR = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('*')
        .single();

      if (data) {
        setIsConnected(data.is_connected || false);
        setQrCode(data.qr_code);
      }
    } catch (error) {
      console.log('No WhatsApp config found');
    }
  };

  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-qr');
      
      if (error) throw error;
      
      if (data.qrCode) {
        setQrCode(data.qrCode);
        toast({
          title: 'QR Code gerado!',
          description: 'Escaneie o código com seu WhatsApp.',
        });
      }
    } catch (error: any) {
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
      const { error } = await supabase.functions.invoke('whatsapp-disconnect');
      
      if (error) throw error;
      
      setIsConnected(false);
      setQrCode(null);
      
      toast({
        title: 'WhatsApp desconectado',
        description: 'Sessão do WhatsApp foi encerrada.',
      });
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
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">WhatsApp Conectado!</p>
              <p className="text-green-600 text-sm">
                Agora você pode enviar comprovantes pelo WhatsApp
              </p>
            </div>
            <Button onClick={disconnect} variant="outline" className="w-full">
              Desconectar WhatsApp
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {qrCode ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code" className="max-w-64 max-h-64" />
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <QrCode className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-800 font-medium">Escaneie com seu WhatsApp</p>
                  <p className="text-blue-600 text-sm">
                    Abra o WhatsApp → Menu → Dispositivos conectados → Conectar dispositivo
                  </p>
                </div>
                <Button onClick={generateQRCode} variant="outline" className="w-full">
                  Gerar Novo QR Code
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">WhatsApp não conectado</p>
                </div>
                <Button 
                  onClick={generateQRCode} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Gerando QR Code...' : 'Conectar WhatsApp'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppQR;
