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
import { Plus, Calendar, User, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  assigned_to?: string;
  due_date?: string;
  board_id: string;
  created_at: string;
  updated_at: string;
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
    assigned_to: '',
    due_date: ''
  });
  const { toast } = useToast();

  const statuses = [
    { id: 'todo', name: 'A Fazer', color: 'bg-gray-500' },
    { id: 'in_progress', name: 'Em Progresso', color: 'bg-blue-500' },
    { id: 'review', name: 'Em Revisão', color: 'bg-yellow-500' },
    { id: 'done', name: 'Concluído', color: 'bg-green-500' }
  ];

  const priorities = [
    { value: 'baixa', label: 'Baixa', color: 'bg-green-100 text-green-800' },
    { value: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    if (selectedBoard) {
      loadTasks();
    }
  }, [selectedBoard]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .select('*')
        .eq('board_id', selectedBoard?.id)
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

      setTasks(data || []);
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
    if (!selectedBoard) {
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
          assigned_to: user?.id || null,
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

      setTasks([...tasks, data]);
      setShowTaskForm(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'media',
        assigned_to: '',
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
        .update({ ...editingTask })
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

      setTasks(tasks.map(task => (task.id === editingTask.id ? data : task)));
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kanban</h1>
          <p className="text-gray-400">Gerencie suas tarefas e projetos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <KanbanBoardManager 
              onBoardSelect={setSelectedBoard}
              selectedBoard={selectedBoard}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedBoard ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedBoard.name}</h2>
                    <p className="text-gray-400">{selectedBoard.description}</p>
                  </div>
                  <Button 
                    onClick={() => setShowTaskForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statuses.map(status => (
                    <div key={status.id} className="space-y-3">
                      <div className={`${status.color} text-white p-2 rounded-lg text-center font-medium`}>
                        {status.name}
                      </div>
                      <div className="space-y-2">
                        {tasks
                          .filter(task => task.status === status.id)
                          .map(task => (
                            <Card key={task.id} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750">
                              <CardContent className="space-y-2 p-3">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-white font-semibold">{task.title}</h3>
                                  <Badge className={priorities.find(p => p.value === task.priority)?.color || 'bg-gray-100 text-gray-800'}>
                                    {priorities.find(p => p.value === task.priority)?.label}
                                  </Badge>
                                </div>
                                <p className="text-gray-400 text-sm">{task.description}</p>
                                <div className="flex justify-between items-center text-gray-500 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sem data'}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {task.assigned_to || 'Ninguém'}
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    onClick={() => setEditingTask(task)}
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() => deleteTask(task.id)}
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <Trash2 className="h-4 w-4" />
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
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-400">Selecione um quadro para ver as tarefas</p>
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
