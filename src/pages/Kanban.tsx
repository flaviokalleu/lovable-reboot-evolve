
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import KanbanBoardManager from '@/components/KanbanBoardManager';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User, Trash2, Edit, Sparkles, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  user_id: string;
}

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  assignee?: string;
  due_date?: string;
  board_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Kanban = () => {
  const { user, loading } = useAuth();
  const [selectedBoard, setSelectedBoard] = useState<KanbanBoard | null>(null);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'media' as const,
    assignee: '',
    due_date: ''
  });
  const { toast } = useToast();

  const statuses = [
    { id: 'todo', name: 'A Fazer', color: 'from-slate-600 to-slate-700', iconColor: 'text-slate-300' },
    { id: 'in_progress', name: 'Em Progresso', color: 'from-blue-600 to-blue-700', iconColor: 'text-blue-300' },
    { id: 'review', name: 'Em Revisão', color: 'from-yellow-600 to-yellow-700', iconColor: 'text-yellow-300' },
    { id: 'done', name: 'Concluído', color: 'from-emerald-600 to-emerald-700', iconColor: 'text-emerald-300' }
  ];

  const priorities = [
    { value: 'baixa', label: 'Baixa', color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' },
    { value: 'media', label: 'Média', color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' },
    { value: 'alta', label: 'Alta', color: 'bg-gradient-to-r from-orange-500 to-red-500 text-white' },
    { value: 'urgente', label: 'Urgente', color: 'bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse' }
  ];

  useEffect(() => {
    if (selectedBoard && user) {
      loadTasks();
    }
  }, [selectedBoard, user]);

  const loadTasks = async () => {
    if (!selectedBoard || !user) return;

    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .select('*')
        .eq('board_id', selectedBoard.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar tarefas:', error);
        toast({
          title: 'Erro ao carregar tarefas',
          description: 'Ocorreu um erro ao buscar as tarefas do quadro.',
          variant: 'destructive',
        });
        return;
      }

      const typedTasks = (data || []).map(task => ({
        ...task,
        priority: task.priority as 'baixa' | 'media' | 'alta' | 'urgente'
      }));

      setTasks(typedTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast({
        title: 'Erro ao carregar tarefas',
        description: 'Ocorreu um erro inesperado ao buscar as tarefas do quadro.',
        variant: 'destructive',
      });
    }
  };

  const createTask = async () => {
    if (!selectedBoard || !user) {
      toast({
        title: 'Nenhum quadro selecionado',
        description: 'Selecione um quadro para criar uma tarefa.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .insert([{
          ...newTask,
          board_id: selectedBoard.id,
          user_id: user.id,
          assignee: newTask.assignee || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tarefa:', error);
        toast({
          title: 'Erro ao criar tarefa',
          description: 'Ocorreu um erro ao salvar a tarefa.',
          variant: 'destructive',
        });
        return;
      }

      const typedTask = {
        ...data,
        priority: data.priority as 'baixa' | 'media' | 'alta' | 'urgente'
      };

      setTasks([...tasks, typedTask]);
      setShowTaskForm(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'media',
        assignee: '',
        due_date: ''
      });
      toast({
        title: 'Tarefa criada',
        description: 'Tarefa criada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: 'Erro ao criar tarefa',
        description: 'Ocorreu um erro inesperado ao criar a tarefa.',
        variant: 'destructive',
      });
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;

    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .update({ 
          title: editingTask.title,
          description: editingTask.description,
          status: editingTask.status,
          priority: editingTask.priority,
          assignee: editingTask.assignee,
          due_date: editingTask.due_date
        })
        .eq('id', editingTask.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tarefa:', error);
        toast({
          title: 'Erro ao atualizar tarefa',
          description: 'Ocorreu um erro ao atualizar a tarefa.',
          variant: 'destructive',
        });
        return;
      }

      const typedTask = {
        ...data,
        priority: data.priority as 'baixa' | 'media' | 'alta' | 'urgente'
      };

      setTasks(tasks.map(task => (task.id === editingTask.id ? typedTask : task)));
      setEditingTask(null);
      toast({
        title: 'Tarefa atualizada',
        description: 'Tarefa atualizada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast({
        title: 'Erro ao atualizar tarefa',
        description: 'Ocorreu um erro inesperado ao atualizar a tarefa.',
        variant: 'destructive',
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Erro ao deletar tarefa:', error);
        toast({
          title: 'Erro ao deletar tarefa',
          description: 'Ocorreu um erro ao deletar a tarefa.',
          variant: 'destructive',
        });
        return;
      }

      setTasks(tasks.filter(task => task.id !== taskId));
      toast({
        title: 'Tarefa deletada',
        description: 'Tarefa deletada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      toast({
        title: 'Erro ao deletar tarefa',
        description: 'Ocorreu um erro inesperado ao deletar a tarefa.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-slate-700/50 shadow-2xl">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Target className="h-8 w-8" />
            </div>
            Kanban
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </h1>
          <p className="text-slate-300 mt-2">Gerencie suas tarefas e projetos com elegância</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <KanbanBoardManager 
              onBoardSelect={setSelectedBoard}
              selectedBoard={selectedBoard}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedBoard ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-lg p-4 border border-slate-600">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      {selectedBoard.name}
                    </h2>
                    {selectedBoard.description && (
                      <p className="text-slate-400 mt-1">{selectedBoard.description}</p>
                    )}
                  </div>
                  <Button 
                    onClick={() => setShowTaskForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statuses.map(status => (
                    <div key={status.id} className="space-y-4">
                      <div className={`bg-gradient-to-r ${status.color} text-white p-4 rounded-xl text-center font-semibold shadow-xl border border-slate-600/50`}>
                        <div className="flex items-center justify-center gap-2">
                          <Target className={`h-4 w-4 ${status.iconColor}`} />
                          {status.name}
                        </div>
                        <div className="text-xs mt-1 opacity-80">
                          {tasks.filter(task => task.status === status.id).length} tarefas
                        </div>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {tasks
                          .filter(task => task.status === status.id)
                          .map(task => (
                            <Card key={task.id} className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-xl backdrop-blur-sm">
                              <CardContent className="space-y-3 p-4">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-white font-semibold text-sm leading-tight">{task.title}</h3>
                                  <Badge className={`${priorities.find(p => p.value === task.priority)?.color || 'bg-gray-500'} text-xs font-medium shadow-lg`}>
                                    {priorities.find(p => p.value === task.priority)?.label}
                                  </Badge>
                                </div>
                                {task.description && (
                                  <p className="text-slate-400 text-xs leading-relaxed">{task.description}</p>
                                )}
                                <div className="flex justify-between items-center text-slate-500 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : 'Sem data'}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {task.assignee || 'Ninguém'}
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    onClick={() => setEditingTask(task)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={() => deleteTask(task.id)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 shadow-2xl backdrop-blur-sm">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                      <Target className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">Selecione um quadro</h3>
                    <p className="text-slate-400">Escolha um quadro para visualizar e gerenciar suas tarefas</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showTaskForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Nova Tarefa</h3>
                <div className="mt-2">
                  <Input
                    type="text"
                    placeholder="Título da tarefa"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="mb-2"
                  />
                  <Textarea
                    placeholder="Descrição da tarefa"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="mb-2"
                  />
                  <Select onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                    <SelectTrigger className="w-full mb-2">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setNewTask({ ...newTask, priority: value as "baixa" | "media" | "alta" | "urgente" })}>
                    <SelectTrigger className="w-full mb-2">
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="mb-2"
                  />
                </div>
                <div className="items-center px-4 py-3">
                  <Button 
                    onClick={createTask}
                    className="bg-blue-600 hover:bg-blue-700 mr-2"
                  >
                    Criar
                  </Button>
                  <Button
                    onClick={() => setShowTaskForm(false)}
                    variant="ghost"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {editingTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Editar Tarefa</h3>
                <div className="mt-2">
                  <Input
                    type="text"
                    placeholder="Título da tarefa"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="mb-2"
                  />
                  <Textarea
                    placeholder="Descrição da tarefa"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    className="mb-2"
                  />
                  <Select onValueChange={(value) => setEditingTask({ ...editingTask, status: value })}>
                    <SelectTrigger className="w-full mb-2">
                      <SelectValue placeholder="Status" value={editingTask.status} />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setEditingTask({ ...editingTask, priority: value as "baixa" | "media" | "alta" | "urgente" })}>
                    <SelectTrigger className="w-full mb-2">
                      <SelectValue placeholder="Prioridade" value={editingTask.priority} />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={editingTask.due_date || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                    className="mb-2"
                  />
                </div>
                <div className="items-center px-4 py-3">
                  <Button
                    onClick={updateTask}
                    className="bg-blue-600 hover:bg-blue-700 mr-2"
                  >
                    Salvar
                  </Button>
                  <Button
                    onClick={() => setEditingTask(null)}
                    variant="ghost"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Kanban;
