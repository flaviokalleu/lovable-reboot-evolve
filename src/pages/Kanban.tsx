
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User, DollarSign } from 'lucide-react';

const Kanban = () => {
  const { user, loading } = useAuth();

  const mockTasks = {
    'A Fazer': [
      {
        id: 1,
        title: 'Análise de ROI Q1',
        description: 'Revisar retorno de investimentos do primeiro trimestre',
        priority: 'Alta',
        assignee: 'João Silva',
        dueDate: '2024-02-15',
        value: 5000
      },
      {
        id: 2,
        title: 'Orçamento Marketing',
        description: 'Definir budget para campanhas digitais',
        priority: 'Média',
        assignee: 'Maria Santos',
        dueDate: '2024-02-20',
        value: 15000
      }
    ],
    'Em Progresso': [
      {
        id: 3,
        title: 'Relatório Mensal',
        description: 'Compilar dados financeiros de janeiro',
        priority: 'Alta',
        assignee: 'Pedro Costa',
        dueDate: '2024-02-10',
        value: 0
      },
      {
        id: 4,
        title: 'Auditoria Interna',
        description: 'Verificação de processos contábeis',
        priority: 'Crítica',
        assignee: 'Ana Oliveira',
        dueDate: '2024-02-08',
        value: 25000
      }
    ],
    'Revisão': [
      {
        id: 5,
        title: 'Proposta Cliente ABC',
        description: 'Finalizar proposta comercial',
        priority: 'Alta',
        assignee: 'Carlos Lima',
        dueDate: '2024-02-12',
        value: 45000
      }
    ],
    'Concluído': [
      {
        id: 6,
        title: 'Fechamento Janeiro',
        description: 'Balanço financeiro completo',
        priority: 'Crítica',
        assignee: 'Equipe Contábil',
        dueDate: '2024-01-31',
        value: 0
      },
      {
        id: 7,
        title: 'Pagamento Fornecedores',
        description: 'Quitação de pendências mensais',
        priority: 'Média',
        assignee: 'Financeiro',
        dueDate: '2024-01-30',
        value: 85000
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-200';
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getColumnColor = (column: string) => {
    switch (column) {
      case 'A Fazer': return 'border-t-blue-500';
      case 'Em Progresso': return 'border-t-orange-500';
      case 'Revisão': return 'border-t-purple-500';
      case 'Concluído': return 'border-t-green-500';
      default: return 'border-t-gray-500';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            Kanban - Gestão de Projetos
          </h1>
          <p className="text-indigo-100">Organize e acompanhe suas tarefas financeiras</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(mockTasks).map(([column, tasks]) => (
            <Card key={column} className={`${getColumnColor(column)} border-t-4`}>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800">{column}</h3>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  <p className="text-sm text-gray-600">tarefas</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Board de Projetos Financeiros</h2>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
          {Object.entries(mockTasks).map(([column, tasks]) => (
            <div key={column} className="space-y-4">
              <Card className={`${getColumnColor(column)} border-t-4`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {column}
                    <Badge variant="secondary">{tasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">{task.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            {task.assignee}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                          </div>
                          
                          {task.value > 0 && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                              <DollarSign className="h-4 w-4" />
                              R$ {task.value.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  variant="dashed" 
                  className="w-full h-24 border-2 border-dashed border-gray-300 hover:border-gray-400"
                >
                  <Plus className="h-6 w-6 mr-2" />
                  Adicionar Tarefa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Kanban;
