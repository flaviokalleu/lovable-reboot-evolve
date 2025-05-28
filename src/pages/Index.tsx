
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Brain, Shield, Users, Kanban, BarChart3, MessageSquare, Star, CheckCircle, Smartphone, Globe, Zap, Target, Award, Clock, ChevronRight, Play, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Controle Financeiro Completo',
      description: 'Gerencie receitas, despesas e investimentos com categorização automática e relatórios em tempo real',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      icon: Brain,
      title: 'IA Financeira Avançada',
      description: 'Análises preditivas, insights personalizados e recomendações automatizadas para otimização financeira',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Users,
      title: 'CRM Empresarial',
      description: 'Gestão completa de clientes, fornecedores e leads com automação de vendas integrada',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Kanban,
      title: 'Gestão de Projetos',
      description: 'Kanban boards para organizar tarefas financeiras, metas e projetos empresariais',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Inteligentes',
      description: 'Dashboards interativos com filtros avançados, exportação e análises comparativas',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Business',
      description: 'Automação comercial via WhatsApp com respostas inteligentes e gestão de leads',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "CEO, TechStart",
      content: "Revolucionou nossa gestão financeira. Reduzimos custos em 35% e aumentamos a eficiência operacional significativamente.",
      rating: 5,
      avatar: "CS",
      company: "Startup Tecnológica"
    },
    {
      name: "Ana Rodrigues",
      role: "CFO, InnovateCorp",
      content: "A IA financeira é impressionante. Previu tendências que nos ajudaram a tomar decisões estratégicas certeiras.",
      rating: 5,
      avatar: "AR",
      company: "Corporação Inovadora"
    },
    {
      name: "Pedro Santos",
      role: "Contador",
      content: "Economizo 20 horas semanais com os relatórios automatizados. Interface intuitiva e dados precisos.",
      rating: 5,
      avatar: "PS",
      company: "Escritório Contábil"
    }
  ];

  const plans = [
    {
      name: "Essencial",
      price: "R$ 49",
      period: "/mês",
      description: "Para pequenos negócios e freelancers",
      features: [
        "Até 500 transações/mês",
        "3 contas bancárias",
        "Relatórios básicos",
        "CRM básico (100 contatos)",
        "Kanban (3 projetos)",
        "Suporte via email"
      ],
      highlighted: false
    },
    {
      name: "Profissional",
      price: "R$ 149",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "Transações ilimitadas",
        "Contas ilimitadas",
        "IA financeira completa",
        "CRM avançado (ilimitado)",
        "Kanban ilimitado",
        "WhatsApp Business",
        "Relatórios avançados",
        "API completa",
        "Suporte prioritário"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "R$ 399",
      period: "/mês",
      description: "Para grandes corporações",
      features: [
        "Tudo do Profissional",
        "Multi-usuários ilimitados",
        "Customização completa",
        "Servidor dedicado",
        "Integrações personalizadas",
        "Consultoria especializada",
        "SLA garantido 99.9%",
        "Suporte 24/7"
      ],
      highlighted: false
    }
  ];

  const stats = [
    { value: "25K+", label: "Empresas Ativas" },
    { value: "R$ 500M+", label: "Processado Mensalmente" },
    { value: "99.8%", label: "Uptime Garantido" },
    { value: "4.9/5", label: "Satisfação do Cliente" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                FinançaIA
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30">
            🚀 Nova Versão com IA Gemini
          </Badge>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Gestão Financeira
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block">
              Inteligente e Automatizada
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Plataforma completa com IA avançada, CRM integrado, automação WhatsApp e relatórios em tempo real. 
            Transforme sua gestão financeira com tecnologia de ponta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-xl">
                <Play className="mr-2 h-5 w-5" />
                Testar Gratuitamente
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-slate-700 text-slate-300 hover:bg-slate-800">
              <Globe className="mr-2 h-5 w-5" />
              Ver Demonstração
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
              Funcionalidades Premium
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Tudo que Sua Empresa Precisa
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Solução completa para gestão financeira empresarial com tecnologia de última geração
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-slate-800 bg-slate-900/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-slate-400">
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
            <Badge className="mb-4 bg-purple-500/10 text-purple-300 border-purple-500/30">
              Casos de Sucesso
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Mais de 25.000 Empresas Confiam
            </h2>
            <p className="text-xl text-slate-300">
              Veja como nossa plataforma transformou negócios de diversos segmentos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-800 bg-slate-900/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                      <p className="text-xs text-slate-500">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
              Planos Flexíveis
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Escolha o Plano Ideal
            </h2>
            <p className="text-xl text-slate-300">
              Sem fidelidade, sem taxas ocultas. Escale conforme cresce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-slate-800 bg-slate-900/50 transition-all duration-300 hover:scale-105 ${plan.highlighted ? 'border-cyan-500 shadow-xl shadow-cyan-500/20' : ''}`}>
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlighted ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para Revolucionar suas Finanças?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Junte-se a mais de 25.000 empresas que já transformaram sua gestão financeira
          </p>
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-6 w-6" />
              <span>Teste grátis 14 dias</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-6 w-6" />
              <span>Setup em 5 minutos</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="h-6 w-6" />
              <span>Suporte especializado</span>
            </div>
          </div>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-slate-900 hover:bg-gray-100 shadow-xl">
              <Zap className="mr-2 h-5 w-5" />
              Começar Gratuitamente
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">F</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  FinançaIA
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Revolucionando a gestão financeira empresarial com inteligência artificial e automação.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Produto</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Empresa</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Suporte</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 FinançaIA. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
