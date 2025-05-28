
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Send, Loader2, Sparkles, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const AIInsights = () => {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !user) return;

    setIsLoading(true);
    try {
      // Obter o token de autenticação
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Sessão não encontrada');
      }

      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: { prompt: question, userId: user.id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setResponse(data.response);
      toast({
        title: 'Análise concluída!',
        description: 'A IA analisou sua pergunta.',
      });
    } catch (error: any) {
      console.error('Erro na análise:', error);
      toast({
        title: 'Erro na análise',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    {
      icon: TrendingUp,
      question: "Como estão meus gastos este mês comparado ao anterior?",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: AlertTriangle,
      question: "Identifique os maiores riscos no meu orçamento atual",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      question: "Quais são as melhores oportunidades de economia?",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      question: "Crie um plano de investimento baseado no meu perfil",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl">
            <Brain className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            Consultor Financeiro IA
            <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Quick Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickQuestions.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={index}
                onClick={() => setQuestion(item.question)}
                variant="outline"
                className={`h-auto p-4 text-left border-slate-600 hover:border-slate-500 bg-gradient-to-r ${item.color}/10 hover:${item.color}/20 transition-all duration-300`}
              >
                <div className="flex items-start gap-3 w-full">
                  <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0 text-white" />
                  <span className="text-slate-300 text-sm leading-relaxed">
                    {item.question}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="question" className="text-slate-300 font-medium">
              Sua pergunta personalizada:
            </label>
            <Textarea
              id="question"
              placeholder="Ex: Como posso economizar mais? Quais são meus maiores gastos? Preciso de conselhos para investir..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              className="bg-slate-700/80 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 resize-none"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !question.trim()} 
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Consultar Gemini AI
              </>
            )}
          </Button>
        </form>

        {response && (
          <div className="bg-gradient-to-br from-slate-800/80 to-cyan-900/20 rounded-xl p-6 border border-cyan-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-cyan-300 text-lg">
                Análise Personalizada da IA
              </h4>
            </div>
            <div className="prose prose-invert prose-cyan max-w-none">
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                {response.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <p className="text-cyan-400/70 text-xs">
                ✨ Análise gerada por Gemini AI • {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {!response && !isLoading && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Pronto para análise inteligente
            </h3>
            <p className="text-slate-400 text-sm">
              Escolha uma pergunta rápida ou escreva sua própria questão financeira
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
