
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const TrendChart = () => {
  const { data: trendData, isLoading } = useQuery({
    queryKey: ['trend-chart'],
    queryFn: async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, created_at')
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
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendência dos Últimos 6 Meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tendência dos Últimos 6 Meses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {trendData && trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  ]}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" name="Receitas" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Despesas" strokeWidth={2} />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Saldo" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Dados insuficientes para gerar o gráfico
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
