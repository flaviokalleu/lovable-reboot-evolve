
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, RefreshCw } from 'lucide-react';

interface TransactionFiltersProps {
  selectedPeriod: string;
  selectedCategory: string;
  selectedType: string;
  onPeriodChange: (period: string) => void;
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
  onReset: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  selectedPeriod,
  selectedCategory,
  selectedType,
  onPeriodChange,
  onCategoryChange,
  onTypeChange,
  onReset
}) => {
  const periods = [
    { value: 'all', label: 'Todos os períodos' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: '1y', label: 'Último ano' },
    { value: 'current_month', label: 'Mês atual' },
    { value: 'last_month', label: 'Mês passado' },
    { value: 'current_year', label: 'Ano atual' }
  ];

  const categories = [
    { value: 'all', label: 'Todas as categorias' },
    // Despesas Essenciais
    { value: 'housing', label: 'Moradia' },
    { value: 'food', label: 'Alimentação' },
    { value: 'transport', label: 'Transporte' },
    { value: 'health', label: 'Saúde' },
    { value: 'utilities', label: 'Utilidades' },
    { value: 'insurance', label: 'Seguros' },
    
    // Despesas Pessoais
    { value: 'entertainment', label: 'Entretenimento' },
    { value: 'shopping', label: 'Compras' },
    { value: 'education', label: 'Educação' },
    { value: 'fitness', label: 'Academia/Fitness' },
    { value: 'beauty', label: 'Beleza/Cuidados' },
    { value: 'travel', label: 'Viagens' },
    { value: 'hobbies', label: 'Hobbies' },
    
    // Despesas Profissionais
    { value: 'business', label: 'Negócios' },
    { value: 'equipment', label: 'Equipamentos' },
    { value: 'software', label: 'Software/Apps' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'training', label: 'Treinamentos' },
    
    // Receitas
    { value: 'salary', label: 'Salário' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investimentos' },
    { value: 'rental', label: 'Aluguel' },
    { value: 'dividend', label: 'Dividendos' },
    { value: 'bonus', label: 'Bônus' },
    { value: 'gift', label: 'Presentes/Doações' },
    
    // Outros
    { value: 'bills', label: 'Contas Gerais' },
    { value: 'taxes', label: 'Impostos' },
    { value: 'debt', label: 'Pagamento de Dívidas' },
    { value: 'savings', label: 'Poupança' },
    { value: 'charity', label: 'Caridade' },
    { value: 'other', label: 'Outros' }
  ];

  const types = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'income', label: 'Receitas' },
    { value: 'expense', label: 'Despesas' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros Interativos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Período
            </label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium opacity-0">Ações</label>
            <Button 
              variant="outline" 
              onClick={onReset}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionFilters;
