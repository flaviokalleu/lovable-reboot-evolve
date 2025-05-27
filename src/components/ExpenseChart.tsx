
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ExpenseChart = () => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['expense-chart'],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, category, type')
        .eq('type', 'expense')
        .gte('created_at', new Date(new Date().setDate(1)).toISOString());

      if (error) throw error;

      const categoryTotals = transactions?.reduce((acc, transaction) => {
        const category = transaction.category;
        acc[category] = (acc[category] || 0) + Number(transaction.amount);
        return acc;
      }, {} as Record<string, number>) || {};

      const categoryLabels = {
        food: 'Alimentação',
        transport: 'Transporte',
        entertainment: 'Entretenimento',
        health: 'Saúde',
        education: 'Educação',
        shopping: 'Compras',
        bills: 'Contas',
        salary: 'Salário',
        investment: 'Investimento',
        other: 'Outros',
      };

      return Object.entries(categoryTotals).map(([category, amount]) => ({
        name: categoryLabels[category as keyof typeof categoryLabels] || category,
        value: amount,
      }));
    },
  });

  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe',
    '#00c49f', '#ffbb28', '#ff8042', '#8dd1e1', '#d084d0'
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
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
        <CardTitle>Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    'Valor'
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Nenhuma despesa encontrada este mês
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
