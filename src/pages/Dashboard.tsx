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
import { BarChart3, PieChart, TrendingUp, Calendar, Filter, Brain, Activity, Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import TemporalAnalysis from '@/components/TemporalAnalysis';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-700 pb-6">
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              Dashboard Financeiro
            </h1>
            <p className="text-slate-400 text-lg">
              Visão completa e estratégica das suas finanças empresariais
            </p>
          </div>
          
          {/* Filtros */}
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
          
          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-slate-800 border border-slate-700">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700"
              >
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Análises</span>
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Tendências</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Relatórios</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">IA</span>
              </TabsTrigger>
              <TabsTrigger 
                value="filters" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:text-blue-400 data-[state=active]:bg-slate-700"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ExpenseChart />
                <RecentTransactions />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <CategoryAnalysis />
                <Card className="border-slate-700 bg-slate-800">
                  <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-400" />
                      Performance Financeira
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm font-medium">Taxa de Economia</span>
                          <span className="text-green-400 font-bold">+12.5%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm font-medium">Controle Orçamentário</span>
                          <span className="text-blue-400 font-bold">87%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '87%'}}></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm font-medium">Meta Mensal</span>
                          <span className="text-purple-400 font-bold">92%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <TrendChart />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ModernChart type="line" title="Tendência de Saldo" timeframe="90d" />
                <Card className="border-slate-700 bg-slate-800">
                  <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-slate-100">Previsões Estratégicas</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="text-blue-400 font-semibold text-sm mb-2">Próximo Mês</h4>
                        <p className="text-blue-300 text-sm">
                          Baseado no padrão atual, você terá R$ 1.200 disponível para investimentos.
                        </p>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <h4 className="text-purple-400 font-semibold text-sm mb-2">Meta Trimestral</h4>
                        <p className="text-purple-300 text-sm">
                          Potencial de economia de R$ 3.500 até o final do trimestre.
                        </p>
                      </div>
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <h4 className="text-green-400 font-semibold text-sm mb-2">Oportunidade</h4>
                        <p className="text-green-300 text-sm">
                          Momento ideal para investir em renda fixa com taxa atual.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <MonthlyReport />
                <Card className="border-slate-700 bg-slate-800">
                  <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-slate-100">Exportações e Relatórios</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="p-4 bg-slate-700 rounded-lg border border-slate-600 mb-4">
                      <h4 className="font-semibold text-blue-300 mb-3">Filtros Ativos:</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <p><strong>Período:</strong> {selectedPeriod === 'all' ? 'Todos os períodos' : selectedPeriod}</p>
                        <p><strong>Categoria:</strong> {selectedCategory === 'all' ? 'Todas' : selectedCategory}</p>
                        <p><strong>Tipo:</strong> {selectedType === 'all' ? 'Todos' : selectedType}</p>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                        Relatório PDF Executivo
                      </button>
                      <button className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
                        Dashboard Interativo
                      </button>
                      <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
                        Análise Completa
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <AIInsights />
            </TabsContent>

            <TabsContent value="filters" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TemporalAnalysis />
                <Card className="border-slate-700 bg-slate-800">
                  <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-slate-100">Categorias Empresariais</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                        <h5 className="font-semibold text-blue-300 text-sm mb-1">Operacionais</h5>
                        <p className="text-xs text-slate-300">Salários, Aluguel, Utilities, Manutenção</p>
                      </div>
                      <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                        <h5 className="font-semibold text-green-300 text-sm mb-1">Marketing & Vendas</h5>
                        <p className="text-xs text-slate-300">Publicidade, Eventos, Comissões</p>
                      </div>
                      <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                        <h5 className="font-semibold text-purple-300 text-sm mb-1">Tecnologia</h5>
                        <p className="text-xs text-slate-300">Software, Hardware, Infraestrutura</p>
                      </div>
                      <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                        <h5 className="font-semibold text-orange-300 text-sm mb-1">Investimentos</h5>
                        <p className="text-xs text-slate-300">Equipamentos, P&D, Expansão</p>
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
