import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import KanbanBoardManager from '@/components/KanbanBoardManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  DollarSign,
  Sparkles,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';

interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  user_id: string;
}

interface KanbanTask {
  id: string;
  board_id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  assignee?: string;
  value?: number;
  due_date?: string;
  created_at: string;
  user_id: string;
}

const Kanban = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [selectedBoard, setSelectedBoard] = useState<KanbanBoard | null>(null);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
    assignee: '',
    value: '',
    due_date: '',
  });

  const statusColumns = [
    { id: 'todo', name: 'A Fazer', color: 'from-slate-600 to-slate-700', icon: Clock },
    { id: 'doing', name: 'Fazendo', color: 'from-blue-600 to-blue-700', icon: BarChart3 },
    { id: 'review', name: 'Revisão', color: 'from-yellow-600 to-yellow-700', icon: Target },
    { id: 'done', name: 'Concluído', color: 'from-green-600 to-green-700', icon: Sparkles },
  ];

  const priorityColors = {
    baixa: 'bg-green-500/20 text-green-400 border-green-500/30',
    media: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    alta: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    urgente: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  useEffect(() => {
    if (selectedBoard) {
      loadTasks();
    }
  }, [selectedBoard]);

  const loadTasks = async () => {
    if (!selectedBoard || !user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .select('*')
        .eq('board_id', selectedBoard.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Type cast the priority field to match our interface
      const typedTasks = data?.map(task => ({
        ...task,
        priority: task.priority as 'baixa' | 'media' | 'alta' | 'urgente'
      })) || [];
      setTasks(typedTasks);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar tarefas',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openTaskDialog = (task?: KanbanTask) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignee: task.assignee || '',
        value: task.value?.toString() || '',
        due_date: task.due_date || '',
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        status: 'todo',
        priority: 'media',
        assignee: '',
        value: '',
        due_date: '',
      });
    }
    setIsTaskDialogOpen(true);
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedBoard) return;

    try {
      const taskData = {
        title: taskForm.title,
        description: taskForm.description,
        status: taskForm.status,
        priority: taskForm.priority,
        assignee: taskForm.assignee,
        value: taskForm.value ? Number(taskForm.value) : null,
        due_date: taskForm.due_date || null,
        board_id: selectedBoard.id,
        user_id: user.id,
      };

      if (editingTask) {
        const { error } = await supabase
          .from('kanban_tasks')
          .update(taskData)
          .eq('id', editingTask.id);

        if (error) throw error;

        toast({
          title: 'Tarefa atualizada!',
          description: 'A tarefa foi atualizada com sucesso.',
        });
      } else {
        const { error } = await supabase
          .from('kanban_tasks')
          .insert([taskData]);

        if (error) throw error;

        toast({
          title: 'Tarefa criada!',
          description: 'A tarefa foi criada com sucesso.',
        });
      }

      setIsTaskDialogOpen(false);
      loadTasks();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: 'Tarefa excluída!',
        description: 'A tarefa foi excluída com sucesso.',
      });

      loadTasks();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      loadTasks();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Kanban Futurista
            </h1>
            <p className="text-slate-300 text-lg">
              Gerencie projetos com estilo cyberpunk
            </p>
          </div>

          {!selectedBoard ? (
            <KanbanBoardManager 
              onBoardSelect={setSelectedBoard}
              selectedBoard={selectedBoard}
            />
          ) : (
            <div className="space-y-6">
              {/* Board Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setSelectedBoard(null)}
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  >
                    ← Voltar aos Quadros
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedBoard.name}</h2>
                    {selectedBoard.description && (
                      <p className="text-slate-400">{selectedBoard.description}</p>
                    )}
                  </div>
                </div>
                
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => openTaskDialog()}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nova Tarefa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTaskSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-slate-300">Título</Label>
                        <Input
                          id="title"
                          value={taskForm.title}
                          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-slate-300">Descrição</Label>
                        <Textarea
                          id="description"
                          value={taskForm.description}
                          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status" className="text-slate-300">Status</Label>
                          <Select
                            value={taskForm.status}
                            onValueChange={(value) => setTaskForm({ ...taskForm, status: value })}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {statusColumns.map(column => (
                                <SelectItem key={column.id} value={column.id}>
                                  {column.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="priority" className="text-slate-300">Prioridade</Label>
                          <Select
                            value={taskForm.priority}
                            onValueChange={(value: 'baixa' | 'media' | 'alta' | 'urgente') => 
                              setTaskForm({ ...taskForm, priority: value })
                            }
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="baixa">Baixa</SelectItem>
                              <SelectItem value="media">Média</SelectItem>
                              <SelectItem value="alta">Alta</SelectItem>
                              <SelectItem value="urgente">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="assignee" className="text-slate-300">Responsável</Label>
                          <Input
                            id="assignee"
                            value={taskForm.assignee}
                            onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="value" className="text-slate-300">Valor (R$)</Label>
                          <Input
                            id="value"
                            type="number"
                            value={taskForm.value}
                            onChange={(e) => setTaskForm({ ...taskForm, value: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="due_date" className="text-slate-300">Data de Vencimento</Label>
                        <Input
                          id="due_date"
                          type="date"
                          value={taskForm.due_date}
                          onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
                        {editingTask ? 'Atualizar' : 'Criar'} Tarefa
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Kanban Board */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {statusColumns.map(column => {
                  const columnTasks = getTasksByStatus(column.id);
                  const IconComponent = column.icon;
                  
                  return (
                    <div key={column.id} className="space-y-4">
                      <div className={`bg-gradient-to-r ${column.color} rounded-lg p-4`}>
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5" />
                            <h3 className="font-semibold">{column.name}</h3>
                          </div>
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {columnTasks.length}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3 min-h-[400px]">
                        {columnTasks.map(task => (
                          <Card key={task.id} className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-semibold text-white text-sm">{task.title}</h4>
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={() => openTaskDialog(task)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteTask(task.id)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                {task.description && (
                                  <p className="text-slate-400 text-xs">{task.description}</p>
                                )}

                                <div className="flex items-center justify-between">
                                  <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                  </Badge>
                                  
                                  {task.value && (
                                    <div className="flex items-center gap-1 text-green-400 text-xs">
                                      <DollarSign className="h-3 w-3" />
                                      R$ {Number(task.value).toLocaleString('pt-BR')}
                                    </div>
                                  )}
                                </div>

                                {(task.assignee || task.due_date) && (
                                  <div className="flex items-center justify-between text-xs text-slate-400">
                                    {task.assignee && (
                                      <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {task.assignee}
                                      </div>
                                    )}
                                    
                                    {task.due_date && (
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Quick Status Change */}
                                <div className="flex gap-1">
                                  {statusColumns.map(status => (
                                    <button
                                      key={status.id}
                                      onClick={() => handleStatusChange(task.id, status.id)}
                                      className={`h-2 w-2 rounded-full transition-all ${
                                        task.status === status.id
                                          ? 'bg-cyan-400 scale-125'
                                          : 'bg-slate-600 hover:bg-slate-500'
                                      }`}
                                      title={`Mover para ${status.name}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Kanban;
