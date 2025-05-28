
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardStats from '@/components/DashboardStats';
import RecentTransactions from '@/components/RecentTransactions';
import ExpenseChart from '@/components/ExpenseChart';
import CategoryAnalysis from '@/components/CategoryAnalysis';
import TrendChart from '@/components/TrendChart';
import MonthlyReport from '@/components/MonthlyReport';
import TransactionFilters from '@/components/TransactionFilters';
import AIInsights from '@/components/AIInsights';
import ModernChart from '@/components/ModernChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, Calendar, Filter, Brain, Sparkles, Activity, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleResetFilters = () => {
    setSelectedPeriod('30d');
    setSelectedCategory('all');
    setSelectedType('all');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 lg:p-6">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header Section */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 lg:mb-4">
              Dashboard Financeiro Inteligente
            </h1>
            <p className="text-slate-300 text-sm sm:text-base lg:text-xl max-w-3xl mx-auto px-4">
              Visão completa e interativa das suas finanças pessoais com IA integrada
            </p>
          </div>
          
          {/* Interactive Filters */}
          <TransactionFilters
            selectedPeriod={selectedPeriod}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            onPeriodChange={setSelectedPeriod}
            onCategoryChange={setSelectedCategory}
            onTypeChange={setSelectedType}
            onReset={handleResetFilters}
          />
          
          {/* Stats Cards */}
          <DashboardStats />
          
          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className={`grid grid-cols-3 gap-1 sm:gap-2 lg:w-auto lg:grid-cols-6 bg-slate-800/50 border border-slate-700 ${isMobile ? 'w-full' : ''}`}>
                <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-300 data-[state=active]:text-cyan-400 px-2 sm:px-3">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Visão</span>
                  <span className="sm:hidden">📊</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-300 data-[state=active]:text-purple-400 px-2 sm:px-3">
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">IA</span>
                  <span className="sm:hidden">🤖</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-300 data-[state=active]:text-pink-400 px-2 sm:px-3">
                  <PieChart className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Análise</span>
                  <span className="sm:hidden">📈</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-300 data-[state=active]:text-green-400 px-2 sm:px-3">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Trend</span>
                  <span className="sm:hidden">📊</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-300 data-[state=active]:text-orange-400 px-2 sm:px-3">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Relatório</span>
                  <span className="sm:hidden">📋</span>
                </TabsTrigger>
                <TabsTrigger value="filters" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-300 data-[state=active]:text-blue-400 px-2 sm:px-3">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Filtros</span>
                  <span className="sm:hidden">🔍</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <ExpenseChart />
                <RecentTransactions />
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <AIInsights />
                <div className="grid gap-4 sm:gap-6">
                  <ModernChart type="pie" title="🎯 Análise de Categorias IA" timeframe="30d" />
                  <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-slate-900/50 backdrop-blur-sm">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-base sm:text-lg">
                        <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-purple-400" />
                        Insights Rápidos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                      <div className="grid gap-2 sm:gap-3">
                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <h4 className="text-green-400 font-semibold text-xs sm:text-sm mb-1">💡 Economia Detectada</h4>
                          <p className="text-green-300 text-xs">
                            Você gastou 12% menos que a média mensal. Continue assim!
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <h4 className="text-yellow-400 font-semibold text-xs sm:text-sm mb-1">⚠️ Atenção</h4>
                          <p className="text-yellow-300 text-xs">
                            Gastos com alimentação aumentaram 15% este mês.
                          </p>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <h4 className="text-purple-400 font-semibold text-xs sm:text-sm mb-1">🎯 Oportunidade</h4>
                          <p className="text-purple-300 text-xs">
                            Potencial de economia de R$ 350 em entretenimento.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <CategoryAnalysis />
                <ModernChart type="bar" title="📊 Comparativo Futurista" timeframe="90d" />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <ModernChart type="area" title="⚡ Fluxo Temporal" timeframe="30d" />
                <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-900/30 to-slate-900/50 backdrop-blur-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-base sm:text-lg">
                      <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-cyan-400" />
                      Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Taxa de Economia</span>
                        <span className="text-green-400 font-bold">+12.5%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Controle Orçamentário</span>
                        <span className="text-blue-400 font-bold">87%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '87%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Meta Mensal</span>
                        <span className="text-purple-400 font-bold">92%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4 sm:space-y-6">
              <TrendChart />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <ModernChart type="line" title="📈 Tendência de Saldo" timeframe="90d" />
                <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-900/30 to-slate-900/50 backdrop-blur-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-white text-base sm:text-lg">Previsões IA</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="text-blue-400 font-semibold text-xs sm:text-sm mb-1">📊 Próximo Mês</h4>
                        <p className="text-blue-300 text-xs">
                          Baseado no padrão atual, você terá R$ 1.200 de sobra para investimentos.
                        </p>
                      </div>
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <h4 className="text-purple-400 font-semibold text-xs sm:text-sm mb-1">🎯 Meta Trimestral</h4>
                        <p className="text-purple-300 text-xs">
                          Potencial de economia de R$ 3.500 até o final do trimestre.
                        </p>
                      </div>
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <h4 className="text-green-400 font-semibold text-xs sm:text-sm mb-1">💰 Oportunidade de Investimento</h4>
                        <p className="text-green-300 text-xs">
                          Momento ideal para investir em renda fixa com taxa atual.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <MonthlyReport />
                <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-white text-base sm:text-lg">Exportações Inteligentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                      <h4 className="font-semibold text-blue-300 mb-2 text-sm">Filtros Ativos:</h4>
                      <div className="space-y-1 text-xs sm:text-sm text-slate-300">
                        <p><strong>Período:</strong> {selectedPeriod === 'all' ? 'Todos os períodos' : selectedPeriod}</p>
                        <p><strong>Categoria:</strong> {selectedCategory === 'all' ? 'Todas' : selectedCategory}</p>
                        <p><strong>Tipo:</strong> {selectedType === 'all' ? 'Todos' : selectedType}</p>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:gap-3">
                      <button className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-xs sm:text-sm font-medium">
                        📄 Relatório PDF com IA
                      </button>
                      <button className="w-full p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-xs sm:text-sm font-medium">
                        📊 Dashboard Interativo
                      </button>
                      <button className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-xs sm:text-sm font-medium">
                        🤖 Análise Completa IA
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-white text-base sm:text-lg">Análise Temporal Avançada</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                          <p className="font-medium text-blue-300">Últimos 7 dias:</p>
                          <p className="text-green-400">-15% gastos</p>
                        </div>
                        <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                          <p className="font-medium text-green-300">Últimos 30 dias:</p>
                          <p className="text-blue-400">+5% receitas</p>
                        </div>
                        <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                          <p className="font-medium text-purple-300">Últimos 90 dias:</p>
                          <p className="text-purple-400">Meta: 87%</p>
                        </div>
                        <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
                          <p className="font-medium text-orange-300">Ano atual:</p>
                          <p className="text-orange-400">Economia: R$ 2.4K</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-white text-base sm:text-lg">Categorias Inteligentes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h5 className="font-semibold text-blue-300 text-xs sm:text-sm">💼 Essenciais</h5>
                        <p className="text-xs text-blue-200">Moradia, Alimentação, Saúde, Transporte</p>
                      </div>
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <h5 className="font-semibold text-green-300 text-xs sm:text-sm">🎯 Pessoais</h5>
                        <p className="text-xs text-green-200">Entretenimento, Fitness, Beleza, Viagens</p>
                      </div>
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <h5 className="font-semibold text-purple-300 text-xs sm:text-sm">🚀 Profissionais</h5>
                        <p className="text-xs text-purple-200">Equipamentos, Software, Marketing</p>
                      </div>
                      <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <h5 className="font-semibold text-orange-300 text-xs sm:text-sm">💰 Investimentos</h5>
                        <p className="text-xs text-orange-200">Dividendos, Aluguel, Poupança</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
