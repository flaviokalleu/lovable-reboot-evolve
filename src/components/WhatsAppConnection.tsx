
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Smartphone, Mail, Shield } from 'lucide-react';

const WhatsAppConnection = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendCode = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-auth', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: 'Código enviado!',
        description: 'Verifique seu email para o código de autenticação.',
      });

      setStep(2);
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar código',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || !phoneNumber) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-verify', {
        body: { email, code, phoneNumber }
      });

      if (error) throw error;

      toast({
        title: 'WhatsApp conectado!',
        description: 'Agora você pode enviar suas transações pelo WhatsApp.',
      });

      setStep(3);
    } catch (error: any) {
      toast({
        title: 'Erro na verificação',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Conectar WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Mail className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="font-medium">Autenticação por Email</h3>
              <p className="text-sm text-gray-600">
                Digite seu email cadastrado para receber o código de autenticação
              </p>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            
            <Button onClick={handleSendCode} disabled={isLoading || !email} className="w-full">
              {isLoading ? 'Enviando...' : 'Enviar Código'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Shield className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="font-medium">Verificar Código</h3>
              <p className="text-sm text-gray-600">
                Digite o código recebido no email e seu número do WhatsApp
              </p>
            </div>
            
            <div>
              <Label htmlFor="code">Código de Verificação</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Número do WhatsApp</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+5511999999999"
              />
            </div>
            
            <Button 
              onClick={handleVerifyCode} 
              disabled={isLoading || !code || !phoneNumber} 
              className="w-full"
            >
              {isLoading ? 'Verificando...' : 'Conectar WhatsApp'}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <Smartphone className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="font-medium text-green-800">WhatsApp Conectado!</h3>
              <p className="text-sm text-green-600 mt-2">
                Agora você pode enviar suas transações diretamente pelo WhatsApp.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• "Gasto R$ 50 com almoço"</li>
                <li>• "Recebi R$ 2000 salário"</li>
                <li>• "Paguei R$ 120 conta de luz"</li>
                <li>• "Comprei R$ 80 supermercado"</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppConnection;
