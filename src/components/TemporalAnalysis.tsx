
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const TemporalAnalysis = () => {
  const { user } = useAuth();

  const { data: temporalData, isLoading } = useQuery({
    queryKey: ['temporal-analysis', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      // Buscar transações para diferentes períodos
      const { data: allTransactions, error } = await supabase
        .from('transactions')
        .select('amount, type, created_at')
        .eq('user_id', user.id)
        .gte('created_at', yearStart.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transactions = allTransactions || [];

      // Filtrar por períodos
      const last7DaysTransactions = transactions.filter(t => 
        new Date(t.created_at) >= last7Days
      );
      const last30DaysTransactions = transactions.filter(t => 
        new Date(t.created_at) >= last30Days
      );
      const last90DaysTransactions = transactions.filter(t => 
        new Date(t.created_at) >= last90Days
      );
      const yearTransactions = transactions;

      // Calcular totais por período
      const calculatePeriodTotals = (periodTransactions: any[]) => {
        return periodTransactions.reduce((acc, t) => {
          if (t.type === 'income') {
            acc.income += Number(t.amount);
          } else {
            acc.expenses += Number(t.amount);
          }
          return acc;
        }, { income: 0, expenses: 0 });
      };

      const last7DaysTotals = calculatePeriodTotals(last7DaysTransactions);
      const last30DaysTotals = calculatePeriodTotals(last30DaysTransactions);
      const last90DaysTotals = calculatePeriodTotals(last90DaysTransactions);
      const yearTotals = calculatePeriodTotals(yearTransactions);

      // Calcular variações percentuais
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
      };

      // Comparar períodos similares anteriores
      const prev7Days = transactions.filter(t => {
        const date = new Date(t.created_at);
        return date >= new Date(last7Days.getTime() - 7 * 24 * 60 * 60 * 1000) && date < last7Days;
      });
      const prev30Days = transactions.filter(t => {
        const date = new Date(t.created_at);
        return date >= new Date(last30Days.getTime() - 30 * 24 * 60 * 60 * 1000) && date < last30Days;
      });

      const prev7DaysTotals = calculatePeriodTotals(prev7Days);
      const prev30DaysTotals = calculatePeriodTotals(prev30Days);

      const expensesChange7Days = calculateChange(last7DaysTotals.expenses, prev7DaysTotals.expenses);
      const incomeChange30Days = calculateChange(last30DaysTotals.income, prev30DaysTotals.income);

      // Meta de economia anual (definir como 10% das receitas)
      const yearGoal = yearTotals.income * 0.1;
      const yearSavings = yearTotals.income - yearTotals.expenses;
      const goalProgress = yearGoal > 0 ? (yearSavings / yearGoal) * 100 : 0;

      return {
        last7Days: {
          ...last7DaysTotals,
          expensesChange: expensesChange7Days
        },
        last30Days: {
          ...last30DaysTotals,
          incomeChange: incomeChange30Days
        },
        last90Days: {
          ...last90DaysTotals,
          goalProgress: Math.min(goalProgress, 100)
        },
        year: {
          ...yearTotals,
          savings: yearSavings
        }
      };
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Análise Temporal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
                <div className="h-6 bg-slate-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!temporalData) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Análise Temporal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-500" />
            <p className="text-slate-400">Dados insuficientes para análise</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          Análise Temporal
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-medium text-blue-300 text-sm">Últimos 7 dias:</p>
              {temporalData.last7Days.expensesChange < 0 ? (
                <TrendingDown className="h-3 w-3 text-green-400" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-400" />
              )}
            </div>
            <p className={`font-bold ${temporalData.last7Days.expensesChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
              {temporalData.last7Days.expensesChange < 0 ? '' : '+'}{temporalData.last7Days.expensesChange.toFixed(1)}% gastos
            </p>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-medium text-green-300 text-sm">Últimos 30 dias:</p>
              {temporalData.last30Days.incomeChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
            </div>
            <p className={`font-bold ${temporalData.last30Days.incomeChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {temporalData.last30Days.incomeChange > 0 ? '+' : ''}{temporalData.last30Days.incomeChange.toFixed(1)}% receitas
            </p>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-medium text-purple-300 text-sm">Últimos 90 dias:</p>
              <Activity className="h-3 w-3 text-purple-400" />
            </div>
            <p className="text-purple-400 font-bold">
              Meta: {temporalData.last90Days.goalProgress.toFixed(0)}%
            </p>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
            <p className="font-medium text-orange-300 text-sm mb-2">Ano atual:</p>
            <p className="text-orange-400 font-bold">
              Economia: R$ {temporalData.year.savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemporalAnalysis;
