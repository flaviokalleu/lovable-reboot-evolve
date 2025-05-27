
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
import KanbanBoardManager from '@/components/KanbanBoardManager';

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  due_date: string;
  value: number;
  board_id: string;
}

interface KanbanBoard {
  id: string;
  name: string;
  description: string;
  color: string;
  user_id: string;
  created_at: string;
}

const Kanban = () => {
  const { user, loading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<KanbanBoard | undefined>();
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

  // Fetch tasks for selected board
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['kanban-tasks', selectedBoard?.id],
    queryFn: async () => {
      if (!selectedBoard) return [];
      const { data, error } = await supabase
        .from('kanban_tasks')
        .select('*')
        .eq('board_id', selectedBoard.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as KanbanTask[];
    },
    enabled: !!user && !!selectedBoard
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
          .insert([{ 
            ...taskData, 
            user_id: user?.id,
            board_id: selectedBoard?.id 
          }])
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
    if (!selectedBoard) {
      toast({
        title: "Erro",
        description: "Selecione um board primeiro.",
        variant: "destructive",
      });
      return;
    }
    taskMutation.mutate(formData);
  };

  const handleEdit = (task: KanbanTask) => {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica': return 'bg-red-600 text-white';
      case 'alta': return 'bg-orange-600 text-white';
      case 'media': return 'bg-yellow-600 text-black';
      case 'baixa': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
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
    <div className="min-h-screen bg-gray-900">
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

          {/* Board Manager */}
          <KanbanBoardManager 
            onBoardSelect={setSelectedBoard}
            selectedBoard={selectedBoard}
          />

          {selectedBoard && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(columns).map(([key, column]) => (
                  <Card key={key} className={`${getColumnColor(key)} border-t-4 bg-gray-800 border-gray-700`}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-white">{column.title}</h3>
                        <p className="text-2xl font-bold text-white">{column.tasks.length}</p>
                        <p className="text-sm text-gray-400">tarefas</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Board: {selectedBoard.name}</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={resetForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Tarefa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-white">Título *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-white">Descrição</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status" className="text-white">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="todo" className="text-white hover:bg-gray-700">A Fazer</SelectItem>
                            <SelectItem value="progress" className="text-white hover:bg-gray-700">Em Progresso</SelectItem>
                            <SelectItem value="review" className="text-white hover:bg-gray-700">Revisão</SelectItem>
                            <SelectItem value="done" className="text-white hover:bg-gray-700">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority" className="text-white">Prioridade</Label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="baixa" className="text-white hover:bg-gray-700">Baixa</SelectItem>
                            <SelectItem value="media" className="text-white hover:bg-gray-700">Média</SelectItem>
                            <SelectItem value="alta" className="text-white hover:bg-gray-700">Alta</SelectItem>
                            <SelectItem value="critica" className="text-white hover:bg-gray-700">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="assignee" className="text-white">Responsável</Label>
                        <Input
                          id="assignee"
                          value={formData.assignee}
                          onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="due_date" className="text-white">Data de Entrega</Label>
                        <Input
                          id="due_date"
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="value" className="text-white">Valor</Label>
                        <Input
                          id="value"
                          type="number"
                          value={formData.value}
                          onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={taskMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700">
                          {taskMutation.isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForm} className="border-gray-700 text-white hover:bg-gray-800">
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
                    <Card className={`${getColumnColor(key)} border-t-4 bg-gray-800 border-gray-700`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between text-white">
                          {column.title}
                          <Badge variant="secondary" className="bg-gray-700 text-white">{column.tasks.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                    </Card>

                    <div className="space-y-3">
                      {column.tasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-white">{task.title}</h3>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEdit(task)}
                                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => deleteMutation.mutate(task.id)}
                                    className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              
                              {task.description && (
                                <p className="text-sm text-gray-400">{task.description}</p>
                              )}
                              
                              <div className="space-y-2">
                                {task.assignee && (
                                  <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <User className="h-4 w-4" />
                                    {task.assignee}
                                  </div>
                                )}
                                
                                {task.due_date && (
                                  <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                  </div>
                                )}
                                
                                {task.value > 0 && (
                                  <div className="flex items-center gap-2 text-sm font-semibold text-green-400">
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
                                    className="text-xs border-gray-700 text-white hover:bg-gray-700"
                                  >
                                    ← Todo
                                  </Button>
                                )}
                                {key !== 'progress' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => updateTaskStatus(task.id, 'progress')}
                                    className="text-xs border-gray-700 text-white hover:bg-gray-700"
                                  >
                                    Progresso
                                  </Button>
                                )}
                                {key !== 'review' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => updateTaskStatus(task.id, 'review')}
                                    className="text-xs border-gray-700 text-white hover:bg-gray-700"
                                  >
                                    Revisão
                                  </Button>
                                )}
                                {key !== 'done' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => updateTaskStatus(task.id, 'done')}
                                    className="text-xs border-gray-700 text-white hover:bg-gray-700"
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
                        className="w-full h-24 border-2 border-dashed border-gray-600 hover:border-gray-500 bg-gray-800 text-gray-400 hover:text-white"
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
            </>
          )}

          {!selectedBoard && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400 text-lg">Selecione ou crie um board para começar</p>
              </CardContent>
            </Card>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Kanban;
