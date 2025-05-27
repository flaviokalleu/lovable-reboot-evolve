
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, Calendar, Filter } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Dashboard Financeiro Inteligente</h1>
          <p className="text-blue-100">Visão completa e interativa das suas finanças pessoais</p>
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Análises
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tendências
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros Avançados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseChart />
              <RecentTransactions />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CategoryAnalysis />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Insights Financeiros IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">💡 Dica de Economia</h4>
                      <p className="text-green-700 text-sm">
                        Suas despesas com alimentação representam 35% do orçamento. 
                        Considere meal prep para economizar até R$ 400/mês.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">📊 Análise Período: {selectedPeriod}</h4>
                      <p className="text-blue-700 text-sm">
                        Com os filtros atuais, você está gastando 12% menos que a média. 
                        Excelente controle financeiro!
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">🎯 Meta Inteligente</h4>
                      <p className="text-purple-700 text-sm">
                        Baseado no seu padrão, você pode economizar R$ 350 este mês 
                        reduzindo gastos em entretenimento.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">🔮 Previsão IA</h4>
                      <p className="text-orange-700 text-sm">
                        Tendência: Se mantiver o padrão atual, você terminará o mês 
                        com R$ 1.200 de sobra para investimentos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <TrendChart />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyReport />
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Personalizados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <h4 className="font-semibold mb-2">Filtros Ativos:</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Período:</strong> {selectedPeriod === 'all' ? 'Todos os períodos' : selectedPeriod}</p>
                      <p><strong>Categoria:</strong> {selectedCategory === 'all' ? 'Todas' : selectedCategory}</p>
                      <p><strong>Tipo:</strong> {selectedType === 'all' ? 'Todos' : selectedType}</p>
                    </div>
                  </div>
                  <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    📄 Exportar PDF Filtrado
                  </button>
                  <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    📊 Exportar Excel com Filtros
                  </button>
                  <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    📈 Relatório Analítico IA
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise por Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Comparativo de Períodos</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Últimos 7 dias:</p>
                          <p className="text-green-600">-15% gastos</p>
                        </div>
                        <div>
                          <p className="font-medium">Últimos 30 dias:</p>
                          <p className="text-blue-600">+5% receitas</p>
                        </div>
                        <div>
                          <p className="font-medium">Últimos 90 dias:</p>
                          <p className="text-purple-600">Meta: 87%</p>
                        </div>
                        <div>
                          <p className="font-medium">Ano atual:</p>
                          <p className="text-orange-600">Economia: R$ 2.4K</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categorias Expandidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-800">Essenciais</h5>
                      <p className="text-sm text-blue-600">Moradia, Alimentação, Saúde, Transporte</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-800">Pessoais</h5>
                      <p className="text-sm text-green-600">Entretenimento, Fitness, Beleza, Viagens</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-semibold text-purple-800">Profissionais</h5>
                      <p className="text-sm text-purple-600">Equipamentos, Software, Marketing</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-semibold text-orange-800">Investimentos</h5>
                      <p className="text-sm text-orange-600">Dividendos, Aluguel, Poupança</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
