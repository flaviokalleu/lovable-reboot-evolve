
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Brain, Shield, Users, Kanban, BarChart3, MessageSquare, Star, CheckCircle } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Controle Financeiro Total',
      description: 'Gerencie receitas, despesas e investimentos com precisão absoluta',
      color: 'text-emerald-400'
    },
    {
      icon: Brain,
      title: 'IA Avançada',
      description: 'Análises automáticas e insights personalizados com Gemini AI',
      color: 'text-blue-400'
    },
    {
      icon: Users,
      title: 'CRM Integrado',
      description: 'Gerencie clientes, contatos e relacionamentos comerciais',
      color: 'text-purple-400'
    },
    {
      icon: Kanban,
      title: 'Kanban Board',
      description: 'Organize projetos e tarefas financeiras visualmente',
      color: 'text-orange-400'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Avançados',
      description: 'Dashboards interativos com filtros por período e categoria',
      color: 'text-cyan-400'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp & IA',
      description: 'Integração completa com WhatsApp para automação',
      color: 'text-green-400'
    },
    {
      icon: TrendingUp,
      title: 'Análise Preditiva',
      description: 'Previsões inteligentes baseadas em histórico e tendências',
      color: 'text-yellow-400'
    },
    {
      icon: Shield,
      title: 'Segurança Máxima',
      description: 'Criptografia de ponta e proteção total dos seus dados',
      color: 'text-red-400'
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empresária",
      content: "Revolucionou minha gestão financeira. A IA é impressionante!",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Freelancer",
      content: "O CRM integrado me ajudou a organizar todos os clientes.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Contadora",
      content: "Os relatórios são incríveis, economizo horas de trabalho.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              💰 FinançaIA
            </div>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-0">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            O Futuro das
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent block">
              Finanças Inteligentes
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Plataforma completa com IA, CRM, Kanban e análises avançadas. 
            Transforme sua gestão financeira com tecnologia de ponta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-0">
                Começar Gratuitamente
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Funcionalidades Avançadas
            </h2>
            <p className="text-xl text-gray-300">
              Tudo que você precisa em uma única plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              O que nossos usuários dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para revolucionar suas finanças?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Junte-se a milhares de usuários que já transformaram sua gestão financeira
          </p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-200" />
              <span className="text-emerald-100">Grátis para começar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-200" />
              <span className="text-emerald-100">Setup em 2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-200" />
              <span className="text-emerald-100">Suporte 24/7</span>
            </div>
          </div>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
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
