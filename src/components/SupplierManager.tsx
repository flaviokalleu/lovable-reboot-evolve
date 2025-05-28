import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Truck, Plus, Edit, Trash2, Building2 } from 'lucide-react';

interface Supplier {
  id: string;
  company_id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  supplier_type: 'individual' | 'business';
  payment_terms?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
}

const SupplierManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_id: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    supplier_type: 'business' as 'individual' | 'business',
    payment_terms: '',
    notes: '',
  });

  const { data: companies } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['suppliers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Type cast the data to match our interface
      return data?.map(supplier => ({
        ...supplier,
        supplier_type: supplier.supplier_type as 'individual' | 'business'
      })) || [];
    },
    enabled: !!user
  });

  const openEditDialog = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      company_id: supplier.company_id,
      name: supplier.name,
      document: supplier.document || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city || '',
      state: supplier.state || '',
      zip_code: supplier.zip_code || '',
      supplier_type: supplier.supplier_type,
      payment_terms: supplier.payment_terms || '',
      notes: supplier.notes || '',
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSupplier(null);
    setFormData({
      company_id: companies?.[0]?.id || '',
      name: '',
      document: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      supplier_type: 'business',
      payment_terms: '',
      notes: '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name || !formData.company_id) return;

    try {
      const supplierData = {
        ...formData,
        user_id: user.id,
      };

      if (editingSupplier) {
        const { error } = await supabase
          .from('suppliers')
          .update(supplierData)
          .eq('id', editingSupplier.id);

        if (error) throw error;

        toast({
          title: 'Fornecedor atualizado!',
          description: 'O fornecedor foi atualizado com sucesso.',
        });
      } else {
        const { error } = await supabase
          .from('suppliers')
          .insert([supplierData]);

        if (error) throw error;

        toast({
          title: 'Fornecedor criado!',
          description: 'O fornecedor foi criado com sucesso.',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar fornecedor',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (supplierId: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId);

      if (error) throw error;

      toast({
        title: 'Fornecedor excluído!',
        description: 'O fornecedor foi excluído com sucesso.',
      });

      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir fornecedor',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getCompanyName = (companyId: string) => {
    return companies?.find(c => c.id === companyId)?.name || 'Empresa não encontrada';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Gerenciar Fornecedores
          </h1>
          <p className="text-slate-300 text-lg">
            Cadastro intuitivo de fornecedores para suas empresas
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-white">
            <p className="text-lg">Total: {suppliers?.length || 0} fornecedores</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                disabled={!companies?.length}
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_id" className="text-slate-300">Empresa *</Label>
                    <Select
                      value={formData.company_id}
                      onValueChange={(value) => setFormData({ ...formData, company_id: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Selecione a empresa" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {companies?.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supplier_type" className="text-slate-300">Tipo *</Label>
                    <Select
                      value={formData.supplier_type}
                      onValueChange={(value: 'individual' | 'business') => 
                        setFormData({ ...formData, supplier_type: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="individual">Pessoa Física</SelectItem>
                        <SelectItem value="business">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nome do fornecedor"
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="document" className="text-slate-300">
                      {formData.supplier_type === 'individual' ? 'CPF' : 'CNPJ'}
                    </Label>
                    <Input
                      id="document"
                      value={formData.document}
                      onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                      placeholder={formData.supplier_type === 'individual' ? '000.000.000-00' : '00.000.000/0000-00'}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="fornecedor@email.com"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-slate-300">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua, número, bairro"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-slate-300">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="São Paulo"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-slate-300">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="SP"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code" className="text-slate-300">CEP</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      placeholder="00000-000"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment_terms" className="text-slate-300">Condições de Pagamento</Label>
                  <Input
                    id="payment_terms"
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                    placeholder="Ex: 30 dias, à vista, etc."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-slate-300">Observações</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Observações sobre o fornecedor..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-purple-600">
                  {editingSupplier ? 'Atualizar' : 'Criar'} Fornecedor
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!companies?.length && (
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhuma empresa encontrada
              </h3>
              <p className="text-slate-400 mb-4">
                Você precisa criar uma empresa antes de cadastrar fornecedores
              </p>
              <Button 
                onClick={() => window.location.href = '/companies'}
                className="bg-gradient-to-r from-cyan-600 to-purple-600"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Criar Empresa
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {suppliers?.map((supplier) => (
            <Card key={supplier.id} className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-orange-500/20 text-orange-400">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {supplier.name}
                      </h3>
                      <div className="text-slate-400 text-sm space-y-1">
                        <p>Empresa: {getCompanyName(supplier.company_id)}</p>
                        <p>Tipo: {supplier.supplier_type === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                        {supplier.document && <p>Documento: {supplier.document}</p>}
                        {supplier.email && <p>Email: {supplier.email}</p>}
                        {supplier.phone && <p>Telefone: {supplier.phone}</p>}
                        {supplier.payment_terms && <p>Pagamento: {supplier.payment_terms}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => openEditDialog(supplier)}
                      size="sm"
                      variant="outline"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(supplier.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {!suppliers?.length && companies?.length && (
            <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Truck className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum fornecedor encontrado
                </h3>
                <p className="text-slate-400 mb-6">
                  Comece criando seu primeiro fornecedor
                </p>
                <Button 
                  onClick={openCreateDialog}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeiro Fornecedor
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierManager;
