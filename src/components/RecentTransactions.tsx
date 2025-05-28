
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentTransactions = () => {
  const { user } = useAuth();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['recent-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          category,
          description,
          created_at,
          customers (name),
          suppliers (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

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

  if (isLoading) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-slate-700 rounded w-20"></div>
                </div>
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-400" />
            Transações Recentes
          </CardTitle>
          <Link to="/transactions">
            <Badge variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer">
              Ver todas
              <ArrowRight className="h-3 w-3 ml-1" />
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {transactions?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-slate-400 mb-4">
              Comece adicionando sua primeira transação
            </p>
            <Link to="/transactions">
              <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white">
                Adicionar Transação
              </Badge>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {transactions?.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {transaction.description || 'Sem descrição'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                          {categoryLabels[transaction.category] || transaction.category}
                        </Badge>
                        {(transaction.customers?.[0]?.name || transaction.suppliers?.[0]?.name) && (
                          <span className="text-xs text-slate-400">
                            • {transaction.customers?.[0]?.name || transaction.suppliers?.[0]?.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(transaction.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
