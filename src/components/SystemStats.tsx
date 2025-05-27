
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, DollarSign, Activity } from 'lucide-react';

const SystemStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total transactions
      const { count: totalTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      // Get this month's transactions volume
      const startOfMonth = new Date(new Date().setDate(1));
      const { data: monthlyTransactions } = await supabase
        .from('transactions')
        .select('amount, type')
        .gte('created_at', startOfMonth.toISOString());

      const monthlyVolume = monthlyTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      // Get active users (users with transactions in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeUsersData } = await supabase
        .from('transactions')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const activeUsers = new Set(activeUsersData?.map(t => t.user_id)).size;

      return {
        totalUsers: totalUsers || 0,
        totalTransactions: totalTransactions || 0,
        monthlyVolume,
        activeUsers,
      };
    },
  });

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: stats?.totalUsers.toString() || '0',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Transações Totais',
      value: stats?.totalTransactions.toString() || '0',
      icon: CreditCard,
      color: 'text-green-600',
    },
    {
      title: 'Volume Mensal',
      value: `R$ ${stats?.monthlyVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Usuários Ativos',
      value: stats?.activeUsers.toString() || '0',
      icon: Activity,
      color: 'text-orange-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SystemStats;
