
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Zap, Star, CheckCircle } from 'lucide-react';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const MercadoPagoPayment = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const plans: PaymentPlan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: 19.90,
      description: 'Para uso pessoal',
      features: [
        'Até 100 transações por mês',
        'Relatórios básicos',
        'Suporte por email',
        'Sincronização WhatsApp'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 39.90,
      description: 'Para usuários avançados',
      features: [
        'Transações ilimitadas',
        'Relatórios avançados',
        'Suporte prioritário',
        'AI Insights',
        'Exportação de dados',
        'Múltiplas contas bancárias'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 79.90,
      description: 'Para empresas',
      features: [
        'Tudo do Premium',
        'Usuários ilimitados',
        'API personalizada',
        'Suporte 24/7',
        'Consultoria financeira',
        'Dashboard customizado'
      ]
    }
  ];

  const processPayment = async (planId: string) => {
    setIsProcessing(true);
    try {
      // Simular processamento do Mercado Pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em uma implementação real, você faria uma chamada para a API do Mercado Pago
      const paymentData = {
        planId,
        amount: plans.find(p => p.id === planId)?.price,
        payment_method: 'mercado_pago'
      };

      console.log('Processando pagamento:', paymentData);

      // Simular sucesso
      toast({
        title: 'Pagamento processado!',
        description: 'Seu plano foi ativado com sucesso.',
      });

      // Redirecionar para página de sucesso ou dashboard
      window.location.href = '/dashboard';

    } catch (error: any) {
      toast({
        title: 'Erro no pagamento',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Escolha seu Plano
        </h1>
        <p className="text-gray-600 text-lg">
          Gerencie suas finanças com mais eficiência
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-300 hover:shadow-lg cursor-pointer ${
              plan.popular ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'
            } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Mais Popular
                </span>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="text-4xl font-bold text-blue-600 my-4">
                R$ {plan.price.toFixed(2)}
                <span className="text-lg text-gray-500 font-normal">/mês</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full mt-6 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => processPayment(plan.id)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processando...' : 'Escolher Plano'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Finalizar Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Mercado Pago</span>
              </div>
              <p className="text-sm text-blue-700">
                Pagamento seguro processado pelo Mercado Pago
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="seu@email.com" />
              </div>
              <div>
                <Label htmlFor="document">CPF/CNPJ</Label>
                <Input id="document" placeholder="000.000.000-00" />
              </div>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => processPayment(selectedPlan)}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : `Pagar R$ ${plans.find(p => p.id === selectedPlan)?.price.toFixed(2)}`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MercadoPagoPayment;
