
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('user_id', user.id)
        .eq('analysis_type', 'financial_insights')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const generateInsights = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Buscar dados financeiros para análise
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type, category, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      const { data: budgets } = await supabase
        .from('budgets')
        .select('amount, category')
        .eq('user_id', user.id);

      const totalIncome = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalExpenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalBudget = budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

      const prompt = `Analise os dados financeiros do usuário e forneça insights detalhados:

Dados Financeiros:
- Receitas totais: R$ ${totalIncome.toLocaleString('pt-BR')}
- Despesas totais: R$ ${totalExpenses.toLocaleString('pt-BR')}
- Saldo atual: R$ ${(totalIncome - totalExpenses).toLocaleString('pt-BR')}
- Orçamento total: R$ ${totalBudget.toLocaleString('pt-BR')}
- Total de transações: ${transactions?.length || 0}

Forneça insights práticos sobre:
1. Padrões de gastos identificados
2. Oportunidades de economia
3. Alertas sobre gastos excessivos
4. Recomendações para melhorar o controle financeiro
5. Sugestões de metas financeiras

Seja específico e prático nas recomendações.`;

      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: { prompt, userId: user.id }
      });

      if (error) throw error;

      // Salvar insights no banco
      const { error: saveError } = await supabase
        .from('ai_analysis')
        .insert({
          user_id: user.id,
          analysis_type: 'financial_insights',
          content: data.response,
          metadata: {
            total_income: totalIncome,
            total_expenses: totalExpenses,
            total_budget: totalBudget,
            transaction_count: transactions?.length || 0
          }
        });

      if (saveError) throw saveError;

      return data.response;
    },
    onSuccess: () => {
      toast({
        title: 'Insights gerados com sucesso!',
        description: 'Análise IA concluída. Confira as recomendações.',
      });
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
    onError: (error: any) => {
      console.error('Erro ao gerar insights:', error);
      toast({
        title: 'Erro ao gerar insights',
        description: error.message || 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    }
  });

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      await generateInsights.mutateAsync();
    } finally {
      setIsGenerating(false);
    }
  };

  const formatInsights = (content: string) => {
    const sections = content.split(/\d+\./).filter(section => section.trim());
    return sections.map((section, index) => {
      const lines = section.trim().split('\n').filter(line => line.trim());
      const title = lines[0]?.replace(/[:-]/g, '').trim();
      const description = lines.slice(1).join(' ').trim();
      
      return { title, description, id: index };
    });
  };

  if (isLoading) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Insights IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
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
            <Brain className="h-5 w-5 text-purple-400" />
            Insights Financeiros IA
          </CardTitle>
          <Button
            onClick={handleGenerateInsights}
            disabled={isGenerating}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Analisando...' : 'Gerar Insights'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!insights || insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Insights IA Personalizados
            </h3>
            <p className="text-slate-400 mb-4">
              Gere análises inteligentes sobre seus padrões financeiros
            </p>
            <Button
              onClick={handleGenerateInsights}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Gerando Insights...' : 'Gerar Primeira Análise'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Gerado em {new Date(insights[0].created_at).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {formatInsights(insights[0].content).map((insight, index) => (
                <div key={insight.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      {index === 0 && <TrendingUp className="h-4 w-4 text-white" />}
                      {index === 1 && <Lightbulb className="h-4 w-4 text-white" />}
                      {index === 2 && <AlertTriangle className="h-4 w-4 text-white" />}
                      {index >= 3 && <Brain className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">{insight.title}</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Button
                onClick={handleGenerateInsights}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Atualizar Análise
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
