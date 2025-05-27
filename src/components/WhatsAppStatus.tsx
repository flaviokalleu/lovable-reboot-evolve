
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Users, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

const WhatsAppStatus = () => {
  const [status, setStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStatus();
    loadStats();
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(() => {
      loadStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('*')
        .single();

      if (data) {
        setStatus(data);
      }
    } catch (error) {
      console.log('No WhatsApp config found');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Contar mensagens dos últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: messageCount } = await supabase
        .from('whatsapp_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Contar usuários únicos que enviaram mensagens
      const { data: uniqueUsers } = await supabase
        .from('whatsapp_messages')
        .select('user_phone')
        .gte('created_at', sevenDaysAgo.toISOString());

      const uniqueUserCount = new Set(uniqueUsers?.map(u => u.user_phone)).size;

      setStats({
        messagesLast7Days: messageCount || 0,
        activeUsers: uniqueUserCount,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const restartWhatsApp = async () => {
    try {
      const { error } = await supabase.functions.invoke('whatsapp-restart');
      
      if (error) throw error;
      
      toast({
        title: 'WhatsApp reiniciado',
        description: 'O serviço do WhatsApp foi reiniciado.',
      });
      
      loadStatus();
    } catch (error: any) {
      toast({
        title: 'Erro ao reiniciar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Status do WhatsApp
          {status?.is_connected ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{stats?.messagesLast7Days || 0}</p>
            <p className="text-sm text-blue-600">Mensagens (7 dias)</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{stats?.activeUsers || 0}</p>
            <p className="text-sm text-green-600">Usuários Ativos</p>
          </div>
        </div>

        {status?.is_connected && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Último ping:</span>
              <span className="text-gray-900">
                {status.last_connected_at ? 
                  new Date(status.last_connected_at).toLocaleString('pt-BR') : 
                  'Nunca'
                }
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Número conectado:</span>
              <span className="text-gray-900">{status.phone_number || 'N/A'}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={restartWhatsApp} variant="outline" className="flex-1">
            Reiniciar Serviço
          </Button>
          <Button onClick={loadStatus} variant="outline" className="flex-1">
            Atualizar Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppStatus;
