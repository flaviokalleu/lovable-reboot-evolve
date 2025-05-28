
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, AlertTriangle } from 'lucide-react';

const DashboardStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Buscar transações
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type, created_at')
        .eq('user_id', user.id);

      // Buscar orçamentos
      const { data: budgets } = await supabase
        .from('budgets')
        .select('amount, category')
        .eq('user_id', user.id);

      // Buscar contas a receber
      const { data: receivables } = await supabase
        .from('accounts_receivable')
        .select('amount, status')
        .eq('user_id', user.id);

      // Buscar contas a pagar
      const { data: payables } = await supabase
        .from('accounts_payable')
        .select('amount, status, due_date')
        .eq('user_id', user.id);

      // Calcular estatísticas
      const totalIncome = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalExpenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const currentBalance = totalIncome - totalExpenses;
      
      const totalBudget = budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
      const budgetUsed = (totalExpenses / totalBudget) * 100;

      const pendingReceivables = receivables?.filter(r => r.status === 'pending').reduce((sum, r) => sum + Number(r.amount), 0) || 0;
      
      const overdueBills = payables?.filter(p => p.status === 'pending' && new Date(p.due_date) < new Date()).length || 0;

      // Calcular tendência mensal
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const thisMonthTransactions = transactions?.filter(t => new Date(t.created_at) >= thisMonth) || [];
      const lastMonthTransactions = transactions?.filter(t => 
        new Date(t.created_at) >= lastMonth && new Date(t.created_at) < thisMonth
      ) || [];

      const thisMonthBalance = thisMonthTransactions.reduce((sum, t) => 
        sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0
      );
      const lastMonthBalance = lastMonthTransactions.reduce((sum, t) => 
        sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0
      );

      const balanceTrend = lastMonthBalance > 0 ? ((thisMonthBalance - lastMonthBalance) / lastMonthBalance) * 100 : 0;

      return {
        currentBalance,
        totalIncome,
        totalExpenses,
        budgetUsed,
        pendingReceivables,
        overdueBills,
        balanceTrend
      };
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Saldo Atual */}
      <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-slate-300">Saldo Atual</CardTitle>
          <div className="p-2 bg-green-500/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-2">
            R$ {stats?.currentBalance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
          </div>
          <div className="flex items-center text-sm">
            {stats?.balanceTrend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            )}
            <span className={stats?.balanceTrend >= 0 ? 'text-green-400' : 'text-red-400'}>
              {Math.abs(stats?.balanceTrend || 0).toFixed(1)}%
            </span>
            <span className="text-slate-400 ml-1">vs mês anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Receitas */}
      <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-slate-300">Receitas</CardTitle>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-2">
            R$ {stats?.totalIncome?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
          </div>
          <p className="text-sm text-slate-400">Total acumulado</p>
        </CardContent>
      </Card>

      {/* Despesas */}
      <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-slate-300">Despesas</CardTitle>
          <div className="p-2 bg-red-500/10 rounded-lg">
            <CreditCard className="h-5 w-5 text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-2">
            R$ {stats?.totalExpenses?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
          </div>
          <div className="flex items-center text-sm">
            <Target className="h-4 w-4 text-orange-400 mr-1" />
            <span className="text-orange-400">
              {stats?.budgetUsed?.toFixed(1) || 0}%
            </span>
            <span className="text-slate-400 ml-1">do orçamento</span>
          </div>
        </CardContent>
      </Card>

      {/* Contas Pendentes */}
      <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-slate-300">Pendências</CardTitle>
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-2">
            R$ {stats?.pendingReceivables?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
          </div>
          <div className="flex items-center text-sm">
            <span className="text-red-400 font-medium">{stats?.overdueBills || 0}</span>
            <span className="text-slate-400 ml-1">contas vencidas</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
