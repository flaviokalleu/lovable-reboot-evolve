
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Smartphone, Wifi, WifiOff, QrCode, Power, RotateCcw } from 'lucide-react';

interface WhatsAppStatus {
  isConnected: boolean;
  qrCode?: string;
  lastConnected?: string;
}

const WhatsAppBaileys = () => {
  const [status, setStatus] = useState<WhatsAppStatus>({ isConnected: false });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const customLogger = {
    level: 'info',
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    child: () => customLogger,
    trace: console.trace
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-verify');
      if (error) throw error;
      
      setStatus(data);
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      toast({
        title: 'Erro ao verificar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const generateQR = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-qr');
      if (error) throw error;
      
      setStatus(data);
      toast({
        title: 'QR Code gerado',
        description: 'Escaneie o código QR com seu WhatsApp',
      });
    } catch (error: any) {
      console.error('Erro ao gerar QR:', error);
      toast({
        title: 'Erro ao gerar QR',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('whatsapp-disconnect');
      if (error) throw error;
      
      setStatus({ isConnected: false });
      toast({
        title: 'Desconectado',
        description: 'WhatsApp desconectado com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao desconectar:', error);
      toast({
        title: 'Erro ao desconectar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restart = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('whatsapp-restart');
      if (error) throw error;
      
      await checkStatus();
      toast({
        title: 'Reiniciado',
        description: 'Serviço WhatsApp reiniciado',
      });
    } catch (error: any) {
      console.error('Erro ao reiniciar:', error);
      toast({
        title: 'Erro ao reiniciar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            WhatsApp Baileys
          </h1>
          <p className="text-slate-300 text-lg">
            Conecte seu WhatsApp usando a biblioteca Baileys
          </p>
        </div>

        <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <Smartphone className="h-6 w-6" />
              </div>
              Status da Conexão
              {status.isConnected ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Wifi className="h-5 w-5" />
                  <span className="text-sm">Conectado</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <WifiOff className="h-5 w-5" />
                  <span className="text-sm">Desconectado</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={generateQR}
                disabled={isLoading || status.isConnected}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Gerar QR Code
              </Button>
              
              <Button
                onClick={disconnect}
                disabled={isLoading || !status.isConnected}
                variant="destructive"
                className="h-12"
              >
                <Power className="h-5 w-5 mr-2" />
                Desconectar
              </Button>
              
              <Button
                onClick={restart}
                disabled={isLoading}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 h-12"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reiniciar
              </Button>
            </div>

            {status.qrCode && (
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <img src={status.qrCode} alt="QR Code WhatsApp" className="max-w-xs" />
              </div>
            )}

            {status.lastConnected && (
              <div className="text-center text-slate-400">
                Última conexão: {new Date(status.lastConnected).toLocaleString('pt-BR')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppBaileys;
