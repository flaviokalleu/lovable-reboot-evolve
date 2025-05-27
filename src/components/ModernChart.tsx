
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface ModernChartProps {
  type: 'area' | 'bar' | 'line' | 'pie';
  title: string;
  dataKey?: string;
  timeframe?: string;
}

const ModernChart: React.FC<ModernChartProps> = ({ type, title, dataKey = 'amount', timeframe = '30d' }) => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['modern-chart', type, timeframe],
    queryFn: async () => {
      const daysAgo = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, category, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (type === 'pie') {
        const categoryTotals = transactions?.reduce((acc, transaction) => {
          if (transaction.type === 'expense') {
            const category = transaction.category || 'other';
            acc[category] = (acc[category] || 0) + Number(transaction.amount);
          }
          return acc;
        }, {} as Record<string, number>) || {};

        const categoryLabels = {
          food: 'Alimentação',
          transport: 'Transporte',
          entertainment: 'Entretenimento',
          health: 'Saúde',
          education: 'Educação',
          shopping: 'Compras',
          bills: 'Contas',
          other: 'Outros',
        };

        return Object.entries(categoryTotals).map(([category, amount]) => ({
          name: categoryLabels[category as keyof typeof categoryLabels] || category,
          value: amount,
          category,
        }));
      }

      // Para outros tipos de gráfico, agrupar por dia
      const dailyData = transactions?.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at).toLocaleDateString('pt-BR');
        if (!acc[date]) {
          acc[date] = { date, income: 0, expenses: 0, balance: 0 };
        }
        
        if (transaction.type === 'income') {
          acc[date].income += Number(transaction.amount);
        } else {
          acc[date].expenses += Number(transaction.amount);
        }
        
        acc[date].balance = acc[date].income - acc[date].expenses;
        return acc;
      }, {} as Record<string, any>) || {};

      return Object.values(dailyData);
    },
  });

  const FUTURISTIC_COLORS = [
    '#00f5ff', '#ff007f', '#7fff00', '#ff4500', '#da70d6',
    '#00bfff', '#ffff00', '#ff1493', '#00ff7f', '#ff6347'
  ];

  const chartConfig = {
    income: {
      label: "Receitas",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Despesas", 
      color: "hsl(var(--chart-2))",
    },
    balance: {
      label: "Saldo",
      color: "hsl(var(--chart-3))",
    },
  };

  if (isLoading) {
    return (
      <Card className="border border-primary/20 bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'area': return Activity;
      case 'bar': return BarChart3;
      case 'line': return TrendingUp;
      case 'pie': return PieChartIcon;
      default: return Activity;
    }
  };

  const Icon = getIcon();

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-80 text-muted-foreground">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Icon className="h-8 w-8" />
            </div>
            <p>Dados insuficientes para gerar o gráfico</p>
          </div>
        </div>
      );
    }

    switch (type) {
      case 'area':
        return (
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00f5ff" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff007f" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff007f" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#00f5ff"
                fill="url(#fillIncome)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="1"
                stroke="#ff007f"
                fill="url(#fillExpenses)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        );

      case 'bar':
        return (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="income" fill="#00f5ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ff007f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        );

      case 'line':
        return (
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#7fff00"
                strokeWidth={3}
                dot={{ fill: "#7fff00", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#7fff00", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        );

      case 'pie':
        return (
          <ChartContainer config={chartConfig}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={FUTURISTIC_COLORS[index % FUTURISTIC_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border border-primary/20 bg-gradient-to-br from-background to-muted/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernChart;
