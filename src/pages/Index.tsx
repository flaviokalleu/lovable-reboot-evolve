
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
      title: 'Controle Financeiro Total',
      description: 'Gerencie receitas, despesas e investimentos com precisão absoluta e categorização inteligente',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      icon: Brain,
      title: 'IA Avançada Gemini',
      description: 'Análises automáticas, insights personalizados e previsões baseadas em machine learning',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Users,
      title: 'CRM Integrado',
      description: 'Gerencie clientes, leads, contratos e relacionamentos comerciais em um só lugar',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Kanban,
      title: 'Kanban Board',
      description: 'Organize projetos financeiros, tarefas e metas com metodologia ágil visual',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Avançados',
      description: 'Dashboards interativos com filtros personalizáveis e exportação completa',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp & IA',
      description: 'Integração nativa com WhatsApp para automação e atendimento inteligente',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Interface responsiva otimizada para dispositivos móveis e tablets',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    },
    {
      icon: Shield,
      title: 'Segurança Máxima',
      description: 'Criptografia end-to-end, autenticação multifator e conformidade LGPD',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "CEO, TechStart",
      content: "Revolucionou minha gestão financeira. A IA do Gemini é impressionante, consegui economizar 40% em apenas 3 meses!",
      rating: 5,
      avatar: "MS",
      company: "Startup de Tecnologia"
    },
    {
      name: "João Santos",
      role: "Freelancer",
      content: "O CRM integrado me ajudou a organizar todos os clientes e aumentar minha receita em 60%. Sistema completo e intuitivo.",
      rating: 5,
      avatar: "JS",
      company: "Designer & Desenvolvedor"
    },
    {
      name: "Ana Costa",
      role: "Contadora",
      content: "Os relatórios são incríveis, economizo 15 horas por semana. A integração com WhatsApp facilitou muito o atendimento.",
      rating: 5,
      avatar: "AC",
      company: "Escritório de Contabilidade"
    },
    {
      name: "Pedro Oliveira",
      role: "E-commerce",
      content: "Kanban financeiro me ajudou a organizar investimentos. Dashboard em tempo real mudou como vejo meu negócio.",
      rating: 5,
      avatar: "PO",
      company: "Loja Online"
    },
    {
      name: "Carla Mendes",
      role: "Consultora",
      content: "Suporte 24/7 excepcional. IA previu tendências que me salvaram de prejuízos. Recomendo para todos!",
      rating: 5,
      avatar: "CM",
      company: "Consultoria Empresarial"
    },
    {
      name: "Rafael Torres",
      role: "Investidor",
      content: "Melhor plataforma financeira que já usei. Análises preditivas me ajudaram a dobrar meus investimentos.",
      rating: 5,
      avatar: "RT",
      company: "Gestor de Investimentos"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "R$ 29",
      period: "/mês",
      description: "Perfeito para freelancers e pequenos negócios",
      features: [
        "Até 100 transações/mês",
        "3 contas bancárias",
        "Relatórios básicos",
        "CRM básico (50 contatos)",
        "Kanban (5 projetos)",
        "Suporte por email"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "R$ 79",
      period: "/mês",
      description: "Ideal para empresas em crescimento",
      features: [
        "Transações ilimitadas",
        "Contas ilimitadas",
        "IA Gemini completa",
        "CRM avançado (ilimitado)",
        "Kanban ilimitado",
        "WhatsApp integrado",
        "Relatórios avançados",
        "API completa",
        "Suporte prioritário"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "R$ 199",
      period: "/mês",
      description: "Para grandes empresas e corporações",
      features: [
        "Tudo do Professional",
        "Multi-usuários (ilimitado)",
        "White label",
        "Servidor dedicado",
        "Integração customizada",
        "Consultoria especializada",
        "SLA garantido",
        "Suporte 24/7"
      ],
      highlighted: false
    }
  ];

  const stats = [
    { value: "50K+", label: "Usuários Ativos" },
    { value: "R$ 2B+", label: "Transações Processadas" },
    { value: "99.9%", label: "Uptime Garantido" },
    { value: "4.9/5", label: "Avaliação Média" }
  ];

  const faqs = [
    {
      question: "Como funciona a IA financeira?",
      answer: "Nossa IA usa o Google Gemini para analisar seus padrões financeiros, identificar oportunidades de economia, prever tendências e sugerir investimentos personalizados baseados no seu perfil de risco."
    },
    {
      question: "É seguro conectar minhas contas bancárias?",
      answer: "Sim, utilizamos criptografia de nível bancário, autenticação multifator e conformidade total com LGPD. Seus dados são protegidos com os mais altos padrões de segurança da indústria."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Absolutamente! Não temos fidelidade. Você pode cancelar quando quiser e seus dados permanecem acessíveis por 90 dias após o cancelamento."
    },
    {
      question: "Como funciona a integração com WhatsApp?",
      answer: "Conectamos diretamente com sua conta WhatsApp Business via API oficial. Você pode receber relatórios, alertas e até mesmo registrar transações por mensagem de forma segura."
    },
    {
      question: "Vocês oferecem suporte técnico?",
      answer: "Sim! Temos suporte por email, chat ao vivo e para clientes Enterprise, suporte telefônico 24/7 com SLA garantido de resposta em até 1 hora."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FinançaIA
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Badge className="mb-6 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/20">
            🚀 Agora com IA Gemini Integrada
          </Badge>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            O Futuro das
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              Finanças Inteligentes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Plataforma completa com IA Gemini, CRM, Kanban e análises avançadas. 
            Transforme sua gestão financeira com tecnologia de ponta e automação inteligente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg">
                <Play className="mr-2 h-5 w-5" />
                Começar Gratuitamente
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-border hover:bg-muted">
              <Globe className="mr-2 h-5 w-5" />
              Ver Demo Interativa
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Funcionalidades Premium
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tudo que Você Precisa em Uma Plataforma
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tecnologia de ponta, interface intuitiva e recursos avançados para revolucionar sua gestão financeira
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
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
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              Depoimentos Reais
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Mais de 50.000 Usuários Satisfeitos
            </h2>
            <p className="text-xl text-muted-foreground">
              Veja como nossa plataforma transformou a vida financeira de empresas e profissionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Planos Flexíveis
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Escolha o Plano Ideal para Você
            </h2>
            <p className="text-xl text-muted-foreground">
              Sem fidelidade, sem taxas ocultas. Cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-border/50 transition-all duration-300 hover:scale-105 ${plan.highlighted ? 'border-primary shadow-xl shadow-primary/20' : ''}`}>
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlighted ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90' : ''}`}>
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
              Dúvidas Frequentes
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Tudo que Você Precisa Saber
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed pl-9">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Pronto para Revolucionar suas Finanças?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Junte-se a mais de 50.000 usuários que já transformaram sua gestão financeira com IA
          </p>
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle className="h-6 w-6" />
              <span>Grátis para começar</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle className="h-6 w-6" />
              <span>Setup em 2 minutos</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle className="h-6 w-6" />
              <span>Suporte 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle className="h-6 w-6" />
              <span>Sem fidelidade</span>
            </div>
          </div>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-background text-foreground hover:bg-background/90 shadow-lg">
              <Zap className="mr-2 h-5 w-5" />
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  FinançaIA
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A revolução da gestão financeira inteligente. Tecnologia de ponta para seu sucesso.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrações</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Segurança</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 FinançaIA. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
