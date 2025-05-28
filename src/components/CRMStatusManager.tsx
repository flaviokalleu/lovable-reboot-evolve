
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface CRMStatus {
  id: string;
  name: string;
  color: string;
  order_index: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const CRMStatusManager = () => {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<CRMStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#3b82f6');
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#3b82f6');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadStatuses();
    }
  }, [user]);

  const loadStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_status')
        .select('*')
        .eq('user_id', user?.id)
        .order('order_index');

      if (error) throw error;
      setStatuses((data || []) as CRMStatus[]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar status',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (status: CRMStatus) => {
    setEditingId(status.id);
    setEditName(status.name);
    setEditColor(status.color);
  };

  const handleSave = async () => {
    if (!editingId || !editName.trim()) return;

    try {
      const { error } = await supabase
        .from('crm_status')
        .update({
          name: editName.trim(),
          color: editColor,
        })
        .eq('id', editingId);

      if (error) throw error;

      setStatuses(prev =>
        prev.map(status =>
          status.id === editingId
            ? { ...status, name: editName.trim(), color: editColor }
            : status
        )
      );

      setEditingId(null);
      setEditName('');
      setEditColor('#3b82f6');

      toast({
        title: 'Status atualizado',
        description: 'Status do CRM foi atualizado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('#3b82f6');
  };

  const handleDelete = async (statusId: string) => {
    try {
      const { error } = await supabase
        .from('crm_status')
        .delete()
        .eq('id', statusId);

      if (error) throw error;

      setStatuses(prev => prev.filter(status => status.id !== statusId));

      toast({
        title: 'Status removido',
        description: 'Status do CRM foi removido com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCreate = async () => {
    if (!newStatusName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('crm_status')
        .insert([{
          user_id: user?.id,
          name: newStatusName.trim(),
          color: newStatusColor,
          order_index: statuses.length + 1,
        }])
        .select()
        .single();

      if (error) throw error;

      setStatuses(prev => [...prev, data as CRMStatus]);
      setNewStatusName('');
      setNewStatusColor('#3b82f6');

      toast({
        title: 'Status criado',
        description: 'Novo status do CRM foi criado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar status',
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
        <CardTitle className="text-white">Gerenciar Status do CRM</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Criar novo status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Novo Status</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Nome do status"
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Input
              type="color"
              value={newStatusColor}
              onChange={(e) => setNewStatusColor(e.target.value)}
              className="w-16 bg-gray-800 border-gray-700"
            />
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lista de status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Status Existentes</h4>
          {statuses.map((status) => (
            <div key={status.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
              {editingId === status.id ? (
                <>
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
                  <Button onClick={handleSave} size="sm" variant="outline">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCancel} size="sm" variant="outline">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="flex-1 text-white">{status.name}</span>
                  <Button
                    onClick={() => handleEdit(status)}
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(status.id)}
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CRMStatusManager;
