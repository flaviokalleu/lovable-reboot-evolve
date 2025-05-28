
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Settings, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  user_id: string;
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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user]);

  const loadBoards = async () => {
    if (!user) return;
    
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
    if (!user) {
      toast({
        title: 'Usuário não autenticado',
        description: 'Faça login para criar quadros.',
        variant: 'destructive',
      });
      return;
    }

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
        .insert([{ 
          name: newBoardName, 
          description: newBoardDescription,
          user_id: user.id
        }])
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
    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-t-lg border-b border-slate-700/50">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Settings className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            Gerenciar Quadros Kanban
            <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300 font-medium">Nome do Quadro</Label>
            <Input
              id="name"
              placeholder="Digite o nome do quadro..."
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              className="bg-slate-800/80 text-white border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 placeholder-slate-400 transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300 font-medium">Descrição</Label>
            <Input
              id="description"
              placeholder="Descrição opcional..."
              value={newBoardDescription}
              onChange={(e) => setNewBoardDescription(e.target.value)}
              className="bg-slate-800/80 text-white border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 placeholder-slate-400 transition-all duration-300"
            />
          </div>
          <Button 
            onClick={createBoard} 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Criando...' : 'Criar Quadro'}
          </Button>
        </div>

        {boards.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Quadros Existentes
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {boards.map(board => (
                <div 
                  key={board.id} 
                  className={`group flex items-center justify-between bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-lg p-4 border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                    selectedBoard?.id === board.id 
                      ? 'border-purple-500 bg-gradient-to-r from-purple-900/30 to-blue-900/30 shadow-purple-500/20' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <button
                    onClick={() => onBoardSelect(board)}
                    className="flex-1 text-left"
                  >
                    <h4 className={`font-semibold transition-colors ${
                      selectedBoard?.id === board.id ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
                    }`}>
                      {board.name}
                    </h4>
                    {board.description && (
                      <p className="text-slate-400 text-sm mt-1">{board.description}</p>
                    )}
                  </button>
                  <Button
                    onClick={() => deleteBoard(board.id)}
                    variant="ghost"
                    size="icon"
                    disabled={isLoading}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
              <Settings className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-400 text-lg">Nenhum quadro criado ainda</p>
            <p className="text-slate-500 text-sm mt-1">Crie seu primeiro quadro para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanBoardManager;
