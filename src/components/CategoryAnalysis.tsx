
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';

const CategoryAnalysis = () => {
  const { user } = useAuth();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['category-analysis', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Buscar transações dos últimos 2 meses para comparação
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, category, created_at')
        .eq('user_id', user.id)
        .gte('created_at', twoMonthsAgo.toISOString())
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
        salary: 'Salário',
        investment: 'Investimento',
        other: 'Outros'
      };

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Separar transações por mês
      const thisMonthTransactions = transactions?.filter(t => 
        new Date(t.created_at) >= thisMonth
      ) || [];
      
      const lastMonthTransactions = transactions?.filter(t => 
        new Date(t.created_at) >= lastMonth && new Date(t.created_at) < thisMonth
      ) || [];

      // Calcular totais por categoria
      const calculateCategoryTotals = (transactions: any[]) => {
        return transactions.reduce((acc, t) => {
          if (!acc[t.category]) acc[t.category] = 0;
          acc[t.category] += Number(t.amount);
          return acc;
        }, {});
      };

      const thisMonthTotals = calculateCategoryTotals(thisMonthTransactions);
      const lastMonthTotals = calculateCategoryTotals(lastMonthTransactions);

      // Calcular total geral deste mês
      const totalThisMonth = Object.values(thisMonthTotals).reduce((sum: number, amount: any) => sum + Number(amount), 0);

      // Criar análise por categoria
      const categoryAnalysis = Object.keys({...thisMonthTotals, ...lastMonthTotals}).map(category => {
        const thisMonthAmount = Number(thisMonthTotals[category]) || 0;
        const lastMonthAmount = Number(lastMonthTotals[category]) || 0;
        const percentage = totalThisMonth > 0 ? (thisMonthAmount / totalThisMonth) * 100 : 0;
        const trend = lastMonthAmount > 0 ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 : 0;

        return {
          category,
          name: categoryLabels[category] || category,
          thisMonth: thisMonthAmount,
          lastMonth: lastMonthAmount,
          percentage,
          trend
        };
      }).filter(item => item.thisMonth > 0).sort((a, b) => b.thisMonth - a.thisMonth);

      return categoryAnalysis;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Análise por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 bg-slate-700 rounded w-24"></div>
                  <div className="h-4 bg-slate-700 rounded w-16"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="text-white flex items-center gap-2">
          <PieChart className="h-5 w-5 text-pink-400" />
          Análise por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!analysis || analysis.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <PieChart className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-slate-400">
              Adicione transações para ver a análise por categoria
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {analysis.map((item, index) => (
              <div key={item.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{item.name}</span>
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      R$ {item.thisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-red-400" />
                      ) : item.trend < 0 ? (
                        <TrendingDown className="h-3 w-3 text-green-400" />
                      ) : null}
                      <span className={`text-xs ${
                        item.trend > 0 ? 'text-red-400' : item.trend < 0 ? 'text-green-400' : 'text-slate-400'
                      }`}>
                        {item.trend !== 0 ? `${Math.abs(item.trend).toFixed(1)}%` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
                <Progress 
                  value={item.percentage} 
                  className="h-2 bg-slate-800"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Mês atual</span>
                  <span>
                    Mês anterior: R$ {item.lastMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryAnalysis;
