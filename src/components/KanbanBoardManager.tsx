
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface KanbanBoard {
  id: string;
  name: string;
  description: string;
  color: string;
  user_id: string;
  created_at: string;
}

interface KanbanBoardManagerProps {
  onBoardSelect: (board: KanbanBoard) => void;
  selectedBoard?: KanbanBoard;
}

const KanbanBoardManager: React.FC<KanbanBoardManagerProps> = ({ onBoardSelect, selectedBoard }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newBoard, setNewBoard] = useState({ name: '', description: '', color: '#3b82f6' });
  const [editingBoard, setEditingBoard] = useState<KanbanBoard | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: boards, isLoading } = useQuery({
    queryKey: ['kanban-boards', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kanban_boards' as any)
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as KanbanBoard[];
    },
    enabled: !!user?.id,
  });

  const createBoardMutation = useMutation({
    mutationFn: async (board: { name: string; description: string; color: string }) => {
      const { data, error } = await supabase
        .from('kanban_boards' as any)
        .insert({
          name: board.name,
          description: board.description,
          color: board.color,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kanban-boards'] });
      setNewBoard({ name: '', description: '', color: '#3b82f6' });
      setIsDialogOpen(false);
      onBoardSelect(data);
      toast({
        title: "Board criado!",
        description: "Novo board adicionado com sucesso.",
      });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: async (board: KanbanBoard) => {
      const { data, error } = await supabase
        .from('kanban_boards' as any)
        .update({
          name: board.name,
          description: board.description,
          color: board.color,
        })
        .eq('id', board.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kanban-boards'] });
      setEditingBoard(null);
      setIsDialogOpen(false);
      if (selectedBoard?.id === data.id) {
        onBoardSelect(data);
      }
      toast({
        title: "Board atualizado!",
        description: "Board editado com sucesso.",
      });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: async (boardId: string) => {
      const { error } = await supabase
        .from('kanban_boards' as any)
        .delete()
        .eq('id', boardId);
      
      if (error) throw error;
    },
    onSuccess: (_, boardId) => {
      queryClient.invalidateQueries({ queryKey: ['kanban-boards'] });
      if (selectedBoard?.id === boardId && boards && boards.length > 1) {
        const otherBoard = boards.find(b => b.id !== boardId);
        if (otherBoard) onBoardSelect(otherBoard);
      }
      toast({
        title: "Board removido!",
        description: "Board deletado com sucesso.",
      });
    },
  });

  const handleCreateBoard = () => {
    if (!newBoard.name.trim()) return;
    createBoardMutation.mutate(newBoard);
  };

  const handleUpdateBoard = () => {
    if (!editingBoard || !editingBoard.name.trim()) return;
    updateBoardMutation.mutate(editingBoard);
  };

  const handleEdit = (board: KanbanBoard) => {
    setEditingBoard(board);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewBoard({ name: '', description: '', color: '#3b82f6' });
    setEditingBoard(null);
    setIsDialogOpen(false);
  };

  React.useEffect(() => {
    if (boards && boards.length > 0 && !selectedBoard) {
      onBoardSelect(boards[0]);
    }
  }, [boards, selectedBoard, onBoardSelect]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Boards</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setNewBoard({ name: '', description: '', color: '#3b82f6' });
                setEditingBoard(null);
                setIsDialogOpen(true);
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Board
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>{editingBoard ? 'Editar Board' : 'Novo Board'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Nome do Board</Label>
                <Input
                  id="name"
                  placeholder="Nome do board"
                  value={editingBoard ? editingBoard.name : newBoard.name}
                  onChange={(e) => editingBoard 
                    ? setEditingBoard({ ...editingBoard, name: e.target.value })
                    : setNewBoard({ ...newBoard, name: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição do board"
                  value={editingBoard ? editingBoard.description || '' : newBoard.description}
                  onChange={(e) => editingBoard 
                    ? setEditingBoard({ ...editingBoard, description: e.target.value })
                    : setNewBoard({ ...newBoard, description: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="color" className="text-white">Cor</Label>
                <input
                  type="color"
                  value={editingBoard ? editingBoard.color : newBoard.color}
                  onChange={(e) => editingBoard 
                    ? setEditingBoard({ ...editingBoard, color: e.target.value })
                    : setNewBoard({ ...newBoard, color: e.target.value })
                  }
                  className="w-12 h-10 rounded border cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    if (editingBoard) {
                      if (editingBoard.name.trim()) {
                        updateBoardMutation.mutate(editingBoard);
                      }
                    } else {
                      if (newBoard.name.trim()) {
                        createBoardMutation.mutate(newBoard);
                      }
                    }
                  }}
                  disabled={createBoardMutation.isPending || updateBoardMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingBoard ? 'Salvar' : 'Criar'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewBoard({ name: '', description: '', color: '#3b82f6' });
                    setEditingBoard(null);
                    setIsDialogOpen(false);
                  }} 
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {boards?.map((board) => (
          <Card
            key={board.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedBoard?.id === board.id 
                ? 'border-blue-500 bg-gray-800' 
                : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
            }`}
            onClick={() => onBoardSelect(board)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: board.color }}
                    />
                    <h4 className="font-semibold text-white">{board.name}</h4>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBoard(board);
                        setIsDialogOpen(true);
                      }}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBoardMutation.mutate(board.id);
                      }}
                      className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {board.description && (
                  <p className="text-sm text-gray-400">{board.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoardManager;
