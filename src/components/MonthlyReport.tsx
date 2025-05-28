
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

const MonthlyReport = () => {
  const { user } = useAuth();

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['monthly-report', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // Transações do mês atual
      const { data: currentTransactions } = await supabase
        .from('transactions')
        .select('amount, type, category')
        .eq('user_id', user.id)
        .gte('created_at', currentMonth.toISOString())
        .lt('created_at', nextMonth.toISOString());

      // Transações do mês passado
      const { data: lastTransactions } = await supabase
        .from('transactions')
        .select('amount, type, category')
        .eq('user_id', user.id)
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', currentMonth.toISOString());

      // Orçamentos
      const { data: budgets } = await supabase
        .from('budgets')
        .select('amount, category')
        .eq('user_id', user.id);

      // Calcular totais
      const calculateTotals = (transactions: any[]) => {
        const income = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
        const expenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
        return { income, expenses, balance: income - expenses };
      };

      const current = calculateTotals(currentTransactions || []);
      const last = calculateTotals(lastTransactions || []);
      
      const totalBudget = budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
      const budgetUsage = totalBudget > 0 ? (current.expenses / totalBudget) * 100 : 0;

      // Calcular tendências
      const incomeTrend = last.income > 0 ? ((current.income - last.income) / last.income) * 100 : 0;
      const expensesTrend = last.expenses > 0 ? ((current.expenses - last.expenses) / last.expenses) * 100 : 0;

      return {
        currentMonth: current,
        lastMonth: last,
        trends: { income: incomeTrend, expenses: expensesTrend },
        budget: { total: totalBudget, usage: budgetUsage },
        monthName: currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      };
    },
    enabled: !!user
  });

  const downloadReport = () => {
    if (!reportData) return;

    const reportContent = `
RELATÓRIO MENSAL - ${reportData.monthName.toUpperCase()}
Generated on ${new Date().toLocaleDateString('pt-BR')}

========================================

RESUMO FINANCEIRO:
- Receitas: R$ ${reportData.currentMonth.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Despesas: R$ ${reportData.currentMonth.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Saldo: R$ ${reportData.currentMonth.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

COMPARAÇÃO COM MÊS ANTERIOR:
- Receitas: ${reportData.trends.income >= 0 ? '+' : ''}${reportData.trends.income.toFixed(1)}%
- Despesas: ${reportData.trends.expenses >= 0 ? '+' : ''}${reportData.trends.expenses.toFixed(1)}%

ORÇAMENTO:
- Total: R$ ${reportData.budget.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Utilizado: ${reportData.budget.usage.toFixed(1)}%

========================================
Relatório gerado automaticamente pelo FinançaIA
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-mensal-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Relatório Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded w-48"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-slate-700 rounded w-24"></div>
                  <div className="h-4 bg-slate-700 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="border-b border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-400" />
            Relatório Mensal
          </CardTitle>
          <Button
            onClick={downloadReport}
            size="sm"
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!reportData ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Relatório não disponível
            </h3>
            <p className="text-slate-400">
              Adicione transações para gerar relatórios
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                {reportData.monthName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">Receitas</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    R$ {reportData.currentMonth.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-slate-300">Despesas</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    R$ {reportData.currentMonth.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Saldo</span>
                  </div>
                  <span className={`text-sm font-bold ${reportData.currentMonth.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {reportData.currentMonth.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-slate-300">Orçamento</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {reportData.budget.usage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Comparação com mês anterior:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Receitas:</span>
                  <span className={`font-medium ${reportData.trends.income >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {reportData.trends.income >= 0 ? '+' : ''}{reportData.trends.income.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Despesas:</span>
                  <span className={`font-medium ${reportData.trends.expenses >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {reportData.trends.expenses >= 0 ? '+' : ''}{reportData.trends.expenses.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyReport;
