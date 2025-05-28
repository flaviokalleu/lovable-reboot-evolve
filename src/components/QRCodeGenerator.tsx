
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, AlertTriangle } from 'lucide-react';

const QRCodeGenerator = () => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <QrCode className="h-5 w-5" />
          QR Code WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-yellow-800 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-200">
            Geração de QR Code temporariamente indisponível. 
            Funcionalidade será restaurada em breve.
          </AlertDescription>
        </Alert>

        <div className="bg-gray-800 p-8 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <QrCode className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">QR Code será exibido aqui</p>
            <p className="text-sm text-gray-500 mt-2">
              Escaneie com o WhatsApp para conectar
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-800 p-3 rounded">
          <p>ℹ️ Como usar (quando disponível):</p>
          <ol className="mt-2 space-y-1 list-decimal list-inside">
            <li>Abra o WhatsApp no seu celular</li>
            <li>Vá em Configurações → Aparelhos conectados</li>
            <li>Toque em "Conectar um aparelho"</li>
            <li>Escaneie o QR Code que aparecerá aqui</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
