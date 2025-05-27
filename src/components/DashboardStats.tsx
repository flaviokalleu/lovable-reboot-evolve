
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, created_at')
        .gte('created_at', new Date(new Date().setDate(1)).toISOString());

      if (error) throw error;

      const income = transactions
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const expenses = transactions
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const balance = income - expenses;
      const transactionCount = transactions?.length || 0;

      // Calcular percentual de mudança (simulado)
      const incomeChange = 12.5;
      const expenseChange = -8.3;
      const balanceChange = balance >= 0 ? 15.2 : -5.7;

      return { 
        income, 
        expenses, 
        balance, 
        transactionCount,
        incomeChange,
        expenseChange,
        balanceChange
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Receitas',
      value: `R$ ${stats?.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: stats?.incomeChange,
      changeType: 'positive'
    },
    {
      title: 'Despesas',
      value: `R$ ${stats?.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      change: stats?.expenseChange,
      changeType: 'negative'
    },
    {
      title: 'Saldo',
      value: `R$ ${stats?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: stats?.balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats?.balance >= 0 ? 'bg-green-50' : 'bg-red-50',
      borderColor: stats?.balance >= 0 ? 'border-green-200' : 'border-red-200',
      change: stats?.balanceChange,
      changeType: stats?.balance >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Transações',
      value: stats?.transactionCount.toString() || '0',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: 23.1,
      changeType: 'positive'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-lg transition-all duration-300`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor === 'bg-green-50' ? 'bg-green-100' : stat.bgColor === 'bg-red-50' ? 'bg-red-100' : 'bg-blue-100'}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="flex items-center text-sm">
              {stat.changeType === 'positive' ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(stat.change || 0).toFixed(1)}%
              </span>
              <span className="text-gray-600 ml-1">vs mês passado</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
