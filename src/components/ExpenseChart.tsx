
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

const ExpenseChart = () => {
  const { user } = useAuth();

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['expense-chart', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, category, created_at')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const categoryLabels = {
        food: 'Alimentação',
        transport: 'Transporte',
        entertainment: 'Entretenimento',
        health: 'Saúde',
        education: 'Educação',
        shopping: 'Compras',
        bills: 'Contas',
        other: 'Outros'
      };

      const categoryColors = {
        food: '#ef4444',
        transport: '#f97316',
        entertainment: '#eab308',
        health: '#22c55e',
        education: '#3b82f6',
        shopping: '#8b5cf6',
        bills: '#06b6d4',
        other: '#6b7280'
      };

      const categoryTotals = transactions?.reduce((acc, transaction) => {
        const category = transaction.category;
        const amount = Number(transaction.amount);
        
        if (!acc[category]) {
          acc[category] = {
            name: categoryLabels[category] || category,
            value: 0,
            color: categoryColors[category] || '#6b7280'
          };
        }
        
        acc[category].value += amount;
        return acc;
      }, {} as Record<string, any>) || {};

      return Object.values(categoryTotals)
        .filter((item: any) => item.value > 0)
        .sort((a: any, b: any) => b.value - a.value);
    },
    enabled: !!user
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.payload.name}</p>
          <p className="text-cyan-400 font-bold">
            R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Distribuição de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          Distribuição de Despesas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!chartData || chartData.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhuma despesa encontrada
            </h3>
            <p className="text-slate-400">
              Adicione algumas transações de despesa para ver o gráfico
            </p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    fontSize: '12px',
                    color: '#cbd5e1'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
