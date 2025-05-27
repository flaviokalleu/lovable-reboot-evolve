
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Brain, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-gray-900">
              💰 FinançaIA
            </div>
            <Link to="/auth">
              <Button>Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Controle suas finanças com
            <span className="text-blue-600"> Inteligência Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            O sistema financeiro mais inteligente do Brasil. Análises automáticas, 
            integração com WhatsApp e insights personalizados para suas finanças.
          </p>
          <div className="space-x-4">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-3">
                Começar Gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Avançadas
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para controlar suas finanças
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <DollarSign className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Controle Total</CardTitle>
                <CardDescription>
                  Gerencie todas suas receitas e despesas em um só lugar
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>IA Avançada</CardTitle>
                <CardDescription>
                  Análises automáticas e insights personalizados sobre seus gastos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>
                  Visualizações claras e relatórios detalhados das suas finanças
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Seus dados protegidos com a mais alta segurança
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece gratuitamente hoje mesmo e descubra o poder da IA em suas finanças
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4">
              💰 FinançaIA
            </div>
            <p className="text-gray-400">
              © 2024 FinançaIA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
