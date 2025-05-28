import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface KanbanBoardManagerProps {
  onBoardSelect: (board: KanbanBoard) => void;
  selectedBoard: KanbanBoard | null;
}

const KanbanBoardManager: React.FC<KanbanBoardManagerProps> = ({ onBoardSelect, selectedBoard }) => {
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('kanban_boards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar quadros:', error);
        toast({
          title: 'Erro ao carregar quadros',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setBoards(data || []);
      }
    } catch (error: any) {
      console.error('Erro inesperado ao carregar quadros:', error);
      toast({
        title: 'Erro inesperado',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBoard = async () => {
    if (!newBoardName.trim()) {
      toast({
        title: 'Nome inválido',
        description: 'Por favor, insira um nome para o quadro.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('kanban_boards')
        .insert([{ name: newBoardName, description: newBoardDescription }])
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao criar quadro:', error);
        toast({
          title: 'Erro ao criar quadro',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setBoards([...boards, data]);
        setNewBoardName('');
        setNewBoardDescription('');
        toast({
          title: 'Quadro criado',
          description: 'Quadro Kanban criado com sucesso!',
        });
      }
    } catch (error: any) {
      console.error('Erro inesperado ao criar quadro:', error);
      toast({
        title: 'Erro inesperado',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBoard = async (boardId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('kanban_boards')
        .delete()
        .eq('id', boardId);

      if (error) {
        console.error('Erro ao excluir quadro:', error);
        toast({
          title: 'Erro ao excluir quadro',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setBoards(boards.filter(board => board.id !== boardId));
        if (selectedBoard?.id === boardId) {
          onBoardSelect(null as any);
        }
        toast({
          title: 'Quadro excluído',
          description: 'Quadro Kanban excluído com sucesso!',
        });
      }
    } catch (error: any) {
      console.error('Erro inesperado ao excluir quadro:', error);
      toast({
        title: 'Erro inesperado',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="h-5 w-5" />
          Gerenciar Quadros Kanban
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">Nome do Quadro</Label>
          <Input
            id="name"
            placeholder="Nome"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 focus-visible:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-300">Descrição</Label>
          <Input
            id="description"
            placeholder="Descrição"
            value={newBoardDescription}
            onChange={(e) => setNewBoardDescription(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 focus-visible:ring-blue-500"
          />
        </div>
        <Button onClick={createBoard} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
          {isLoading ? 'Criando...' : 'Criar Quadro'}
        </Button>

        {boards.length > 0 ? (
          <div className="space-y-3 mt-6">
            <h3 className="text-lg font-semibold text-white">Quadros Existentes</h3>
            <ul className="space-y-2">
              {boards.map(board => (
                <li key={board.id} className="flex items-center justify-between bg-gray-800 rounded-md p-3">
                  <button
                    onClick={() => onBoardSelect(board)}
                    className={`text-white hover:text-blue-500 ${selectedBoard?.id === board.id ? 'font-semibold' : ''}`}
                  >
                    {board.name}
                  </button>
                  <Button
                    onClick={() => deleteBoard(board.id)}
                    variant="destructive"
                    size="icon"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-6 text-center text-gray-400">
            Nenhum quadro criado ainda.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanBoardManager;
