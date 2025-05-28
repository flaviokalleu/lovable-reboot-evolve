import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface CRMStatus {
  id: string;
  name: string;
  color: string;
  order_index: number;
  user_id: string;
}

const CRMStatusManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState({ name: '', color: '#3b82f6' });
  const [editingStatus, setEditingStatus] = useState<CRMStatus | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: statuses, isLoading } = useQuery({
    queryKey: ['crm-status', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_status' as any)
        .select('*')
        .eq('user_id', user?.id)
        .order('order_index');
      
      if (error) throw error;
      return data as CRMStatus[];
    },
    enabled: !!user?.id,
  });

  const createStatusMutation = useMutation({
    mutationFn: async (status: { name: string; color: string }) => {
      const maxOrder = statuses?.length ? Math.max(...statuses.map(s => s.order_index)) : 0;
      const { data, error } = await supabase
        .from('crm_status' as any)
        .insert({
          name: status.name,
          color: status.color,
          order_index: maxOrder + 1,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-status'] });
      setNewStatus({ name: '', color: '#3b82f6' });
      setIsDialogOpen(false);
      toast({
        title: "Status criado!",
        description: "Novo status adicionado com sucesso.",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: CRMStatus) => {
      const { data, error } = await supabase
        .from('crm_status' as any)
        .update({
          name: status.name,
          color: status.color,
        })
        .eq('id', status.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-status'] });
      setEditingStatus(null);
      setIsDialogOpen(false);
      toast({
        title: "Status atualizado!",
        description: "Status editado com sucesso.",
      });
    },
  });

  const deleteStatusMutation = useMutation({
    mutationFn: async (statusId: string) => {
      const { error } = await supabase
        .from('crm_status' as any)
        .delete()
        .eq('id', statusId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-status'] });
      toast({
        title: "Status removido!",
        description: "Status deletado com sucesso.",
      });
    },
  });

  const handleCreateStatus = () => {
    if (!newStatus.name.trim()) return;
    createStatusMutation.mutate(newStatus);
  };

  const handleUpdateStatus = () => {
    if (!editingStatus || !editingStatus.name.trim()) return;
    updateStatusMutation.mutate(editingStatus);
  };

  const handleEdit = (status: CRMStatus) => {
    setEditingStatus(status);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewStatus({ name: '', color: '#3b82f6' });
    setEditingStatus(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5" />
            Gerenciar Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="h-5 w-5" />
          Gerenciar Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setNewStatus({ name: '', color: '#3b82f6' });
                setEditingStatus(null);
                setIsDialogOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Status
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>{editingStatus ? 'Editar Status' : 'Novo Status'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Nome do Status</Label>
                <Input
                  id="name"
                  placeholder="Nome do status"
                  value={editingStatus ? editingStatus.name : newStatus.name}
                  onChange={(e) => editingStatus 
                    ? setEditingStatus({ ...editingStatus, name: e.target.value })
                    : setNewStatus({ ...newStatus, name: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="color" className="text-white">Cor</Label>
                <input
                  type="color"
                  value={editingStatus ? editingStatus.color : newStatus.color}
                  onChange={(e) => editingStatus 
                    ? setEditingStatus({ ...editingStatus, color: e.target.value })
                    : setNewStatus({ ...newStatus, color: e.target.value })
                  }
                  className="w-12 h-10 rounded border cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    if (editingStatus) {
                      if (editingStatus.name.trim()) {
                        updateStatusMutation.mutate(editingStatus);
                      }
                    } else {
                      if (newStatus.name.trim()) {
                        createStatusMutation.mutate(newStatus);
                      }
                    }
                  }}
                  disabled={createStatusMutation.isPending || updateStatusMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingStatus ? 'Salvar' : 'Criar'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewStatus({ name: '', color: '#3b82f6' });
                    setEditingStatus(null);
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

        <div className="space-y-3">
          <h4 className="font-medium text-white">Status Existentes:</h4>
          {statuses && statuses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {statuses.map((status) => (
                <div
                  key={status.id}
                  className="flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="font-medium text-white">{status.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingStatus(status);
                        setIsDialogOpen(true);
                      }}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStatusMutation.mutate(status.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Nenhum status personalizado criado ainda.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CRMStatusManager;
