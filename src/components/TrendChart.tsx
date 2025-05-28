
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const TrendChart = () => {
  const { user } = useAuth();

  const { data: trendData, isLoading } = useQuery({
    queryKey: ['trend-chart', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      const monthlyData = transactions?.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };
        }
        
        if (transaction.type === 'income') {
          acc[monthKey].income += Number(transaction.amount);
        } else {
          acc[monthKey].expenses += Number(transaction.amount);
        }
        
        return acc;
      }, {} as Record<string, any>) || {};

      return Object.values(monthlyData).map((data: any) => ({
        ...data,
        balance: data.income - data.expenses,
      }));
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <TrendingUp className="h-5 w-5" />
            Tendência dos Últimos 6 Meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          Tendência dos Últimos 6 Meses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80">
          {trendData && trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  ]}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" name="Receitas" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Despesas" strokeWidth={2} />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Saldo" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Dados insuficientes para gerar o gráfico
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
