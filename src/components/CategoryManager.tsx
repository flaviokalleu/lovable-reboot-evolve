
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

const CategoryManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user?.id,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (category: { name: string; color: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          color: category.color,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory({ name: '', color: '#3b82f6' });
      toast({
        title: "Categoria criada!",
        description: "Nova categoria adicionada com sucesso.",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (category: Category) => {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          color: category.color,
        })
        .eq('id', category.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      toast({
        title: "Categoria atualizada!",
        description: "Categoria editada com sucesso.",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria removida!",
        description: "Categoria deletada com sucesso.",
      });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return;
    createCategoryMutation.mutate(newCategory);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    updateCategoryMutation.mutate(editingCategory);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Gerenciar Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Gerenciar Categorias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new category */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Nome da categoria"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="flex-1"
          />
          <div className="flex gap-2">
            <input
              type="color"
              value={newCategory.color}
              onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <Button onClick={handleCreateCategory} disabled={createCategoryMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Edit category */}
        {editingCategory && (
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted rounded-lg">
            <Input
              placeholder="Nome da categoria"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="flex-1"
            />
            <div className="flex gap-2">
              <input
                type="color"
                value={editingCategory.color}
                onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <Button onClick={handleUpdateCategory} disabled={updateCategoryMutation.isPending}>
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Categories list */}
        <div className="space-y-3">
          <h4 className="font-medium">Categorias Existentes:</h4>
          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhuma categoria personalizada criada ainda.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
