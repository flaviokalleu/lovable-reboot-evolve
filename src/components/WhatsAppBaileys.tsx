
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, AlertTriangle, Smartphone } from 'lucide-react';

const WhatsAppBaileys = () => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Smartphone className="h-5 w-5" />
          WhatsApp Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-yellow-800 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-200">
            WhatsApp integration temporarily unavailable due to dependency issues. 
            We're working to restore this functionality.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              status === 'connected' ? 'bg-green-500' : 
              status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-white font-medium">
              Status: {status === 'connected' ? 'Conectado' : 
                      status === 'connecting' ? 'Conectando...' : 'Desconectado'}
            </span>
          </div>
          
          <Button 
            disabled
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Conectar (Em breve)
          </Button>
        </div>

        <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg">
          <p className="mb-2">📱 Recursos planejados:</p>
          <ul className="space-y-1">
            <li>• Conexão direta via WhatsApp Web</li>
            <li>• Processamento automático de transações</li>
            <li>• Respostas inteligentes com IA</li>
            <li>• Geração de relatórios via chat</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppBaileys;
