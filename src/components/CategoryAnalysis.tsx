
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart } from 'lucide-react';

const CategoryAnalysis = () => {
  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['category-analysis'],
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
        category: categoryLabels[category as keyof typeof categoryLabels] || category,
        amount: amount,
      })).sort((a, b) => b.amount - a.amount);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Análise por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
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
          <PieChart className="h-5 w-5" />
          Análise por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {categoryData && categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    'Gasto'
                  ]}
                />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
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

export default CategoryAnalysis;
