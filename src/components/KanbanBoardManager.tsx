
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Save, X, Folder } from 'lucide-react';

interface KanbanBoard {
  id: string;
  name: string;
  description: string | null;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const KanbanBoardManager = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editColor, setEditColor] = useState('#3b82f6');
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('#3b82f6');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user]);

  const loadBoards = async () => {
    try {
      const { data, error } = await supabase
        .from('kanban_boards')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBoards((data || []) as KanbanBoard[]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar boards',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (board: KanbanBoard) => {
    setEditingId(board.id);
    setEditName(board.name);
    setEditDescription(board.description || '');
    setEditColor(board.color);
  };

  const handleSave = async () => {
    if (!editingId || !editName.trim()) return;

    try {
      const { error } = await supabase
        .from('kanban_boards')
        .update({
          name: editName.trim(),
          description: editDescription.trim() || null,
          color: editColor,
        })
        .eq('id', editingId);

      if (error) throw error;

      setBoards(prev =>
        prev.map(board =>
          board.id === editingId
            ? { 
                ...board, 
                name: editName.trim(), 
                description: editDescription.trim() || null,
                color: editColor 
              }
            : board
        )
      );

      setEditingId(null);
      setEditName('');
      setEditDescription('');
      setEditColor('#3b82f6');

      toast({
        title: 'Board atualizado',
        description: 'Board do Kanban foi atualizado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar board',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
    setEditColor('#3b82f6');
  };

  const handleDelete = async (boardId: string) => {
    try {
      const { error } = await supabase
        .from('kanban_boards')
        .delete()
        .eq('id', boardId);

      if (error) throw error;

      setBoards(prev => prev.filter(board => board.id !== boardId));

      toast({
        title: 'Board removido',
        description: 'Board do Kanban foi removido com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover board',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCreate = async () => {
    if (!newBoardName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('kanban_boards')
        .insert([{
          user_id: user?.id,
          name: newBoardName.trim(),
          description: newBoardDescription.trim() || null,
          color: newBoardColor,
        }])
        .select()
        .single();

      if (error) throw error;

      setBoards(prev => [data as KanbanBoard, ...prev]);
      setNewBoardName('');
      setNewBoardDescription('');
      setNewBoardColor('#3b82f6');

      toast({
        title: 'Board criado',
        description: 'Novo board do Kanban foi criado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar board',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Gerenciar Boards do Kanban</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Criar novo board */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Novo Board</h4>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Nome do board"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white"
              />
              <Input
                type="color"
                value={newBoardColor}
                onChange={(e) => setNewBoardColor(e.target.value)}
                className="w-16 bg-gray-800 border-gray-700"
              />
              <Button onClick={handleCreate} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Descrição do board (opcional)"
              value={newBoardDescription}
              onChange={(e) => setNewBoardDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              rows={2}
            />
          </div>
        </div>

        {/* Lista de boards */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Boards Existentes</h4>
          {boards.map((board) => (
            <div key={board.id} className="p-3 bg-gray-800 rounded-lg space-y-2">
              {editingId === board.id ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-16 bg-gray-700 border-gray-600"
                    />
                  </div>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" variant="outline">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: board.color }}
                    />
                    <Folder className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 text-white font-medium">{board.name}</span>
                    <Button
                      onClick={() => handleEdit(board)}
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(board.id)}
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {board.description && (
                    <p className="text-sm text-gray-400 ml-6">{board.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanBoardManager;
