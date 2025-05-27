
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, User, DollarSign, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Kanban = () => {
  const { user, loading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'media',
    assignee: '',
    due_date: '',
    value: 0
  });

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['kanban-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Create/Update task mutation
  const taskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      if (editingTask) {
        const { data, error } = await supabase
          .from('kanban_tasks')
          .update(taskData)
          .eq('id', editingTask.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('kanban_tasks')
          .insert([{ ...taskData, user_id: user?.id }])
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban-tasks'] });
      toast({
        title: editingTask ? "Tarefa atualizada!" : "Tarefa criada!",
        description: "Operação realizada com sucesso.",
      });
      resetForm();
    }
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('kanban_tasks')
        .delete()
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban-tasks'] });
      toast({
        title: "Tarefa excluída!",
        description: "Tarefa removida com sucesso.",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'media',
      assignee: '',
      due_date: '',
      value: 0
    });
    setEditingTask(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    taskMutation.mutate(formData);
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority || 'media',
      assignee: task.assignee || '',
      due_date: task.due_date || '',
      value: task.value || 0
    });
    setIsDialogOpen(true);
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from('kanban_tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['kanban-tasks'] });
      toast({
        title: "Status atualizado!",
        description: "Tarefa movida com sucesso.",
      });
    }
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
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getColumnColor = (column: string) => {
    switch (column) {
      case 'todo': return 'border-t-blue-500';
      case 'progress': return 'border-t-orange-500';
      case 'review': return 'border-t-purple-500';
      case 'done': return 'border-t-green-500';
      default: return 'border-t-gray-500';
    }
  };

  const columns = {
    todo: { title: 'A Fazer', tasks: tasks.filter(t => t.status === 'todo') },
    progress: { title: 'Em Progresso', tasks: tasks.filter(t => t.status === 'progress') },
    review: { title: 'Revisão', tasks: tasks.filter(t => t.status === 'review') },
    done: { title: 'Concluído', tasks: tasks.filter(t => t.status === 'done') }
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
          {Object.entries(columns).map(([key, column]) => (
            <Card key={key} className={`${getColumnColor(key)} border-t-4`}>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800">{column.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{column.tasks.length}</p>
                  <p className="text-sm text-gray-600">tarefas</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Board de Projetos Financeiros</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">A Fazer</SelectItem>
                      <SelectItem value="progress">Em Progresso</SelectItem>
                      <SelectItem value="review">Revisão</SelectItem>
                      <SelectItem value="done">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignee">Responsável</Label>
                  <Input
                    id="assignee"
                    value={formData.assignee}
                    onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">Data de Entrega</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={taskMutation.isPending}>
                    {taskMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
          {Object.entries(columns).map(([key, column]) => (
            <div key={key} className="space-y-4">
              <Card className={`${getColumnColor(key)} border-t-4`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {column.title}
                    <Badge variant="secondary">{column.tasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(task)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteMutation.mutate(task.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        
                        {task.description && (
                          <p className="text-sm text-gray-600">{task.description}</p>
                        )}
                        
                        <div className="space-y-2">
                          {task.assignee && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              {task.assignee}
                            </div>
                          )}
                          
                          {task.due_date && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              {new Date(task.due_date).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          
                          {task.value > 0 && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                              <DollarSign className="h-4 w-4" />
                              R$ {task.value.toLocaleString()}
                            </div>
                          )}
                        </div>

                        {/* Status change buttons */}
                        <div className="flex gap-1 flex-wrap">
                          {key !== 'todo' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateTaskStatus(task.id, 'todo')}
                              className="text-xs"
                            >
                              ← Todo
                            </Button>
                          )}
                          {key !== 'progress' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateTaskStatus(task.id, 'progress')}
                              className="text-xs"
                            >
                              Progresso
                            </Button>
                          )}
                          {key !== 'review' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateTaskStatus(task.id, 'review')}
                              className="text-xs"
                            >
                              Revisão
                            </Button>
                          )}
                          {key !== 'done' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateTaskStatus(task.id, 'done')}
                              className="text-xs"
                            >
                              Concluído →
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full h-24 border-2 border-dashed border-gray-300 hover:border-gray-400"
                  onClick={() => {
                    setFormData({...formData, status: key});
                    setIsDialogOpen(true);
                  }}
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
