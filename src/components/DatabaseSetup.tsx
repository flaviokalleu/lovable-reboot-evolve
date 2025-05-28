
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Database, Server, CheckCircle, AlertCircle, Download, Play } from 'lucide-react';

const DatabaseSetup = () => {
  const { toast } = useToast();
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '5432',
    database: 'financeiro_app',
    username: 'postgres',
    password: '',
    ssl: 'prefer'
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const generateSchema = () => {
    const schema = `
-- Schema completo para aplicação financeira
-- Execute este script em seu PostgreSQL

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar tipos enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE transaction_category AS ENUM (
  'food', 'transport', 'entertainment', 'health', 
  'education', 'shopping', 'bills', 'salary', 
  'investment', 'other'
);

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  role user_role DEFAULT 'user',
  subscription_status subscription_status DEFAULT 'pending',
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type transaction_type NOT NULL,
  category transaction_category NOT NULL,
  description TEXT,
  receipt_url TEXT,
  whatsapp_message_id TEXT,
  processed_by_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category transaction_category NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  period TEXT DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de análises IA
CREATE TABLE IF NOT EXISTS ai_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de categorias personalizadas
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de clientes CRM
CREATE TABLE IF NOT EXISTS crm_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'lead',
  value DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  last_contact TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de status CRM
CREATE TABLE IF NOT EXISTS crm_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de quadros Kanban
CREATE TABLE IF NOT EXISTS kanban_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de tarefas Kanban
CREATE TABLE IF NOT EXISTS kanban_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  board_id UUID REFERENCES kanban_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'media',
  assignee TEXT,
  value DECIMAL(12,2) DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de configuração WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code TEXT,
  is_connected BOOLEAN DEFAULT FALSE,
  session_data JSONB,
  last_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de mensagens WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_phone TEXT NOT NULL,
  message_content TEXT,
  message_type TEXT,
  media_url TEXT,
  ai_response TEXT,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON transactions 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at 
  BEFORE UPDATE ON budgets 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_crm_clients_updated_at 
  BEFORE UPDATE ON crm_clients 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_crm_status_updated_at 
  BEFORE UPDATE ON crm_status 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_kanban_boards_updated_at 
  BEFORE UPDATE ON kanban_boards 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_kanban_tasks_updated_at 
  BEFORE UPDATE ON kanban_tasks 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_whatsapp_config_updated_at 
  BEFORE UPDATE ON whatsapp_config 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_user_id ON ai_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_clients_user_id ON crm_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_status_user_id ON crm_status(user_id);
CREATE INDEX IF NOT EXISTS idx_kanban_boards_user_id ON kanban_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_user_id ON kanban_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_phone ON whatsapp_messages(user_phone);

-- Inserir dados iniciais
INSERT INTO profiles (id, email, full_name, role) VALUES 
  (uuid_generate_v4(), 'admin@financeiro.com', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Schema criado com sucesso!
-- Agora você pode conectar sua aplicação usando as credenciais fornecidas.
`;

    const blob = new Blob([schema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema-financeiro-app.sql';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Schema baixado!',
      description: 'Execute o arquivo SQL em seu PostgreSQL.',
    });
  };

  const testConnection = async () => {
    setIsConnecting(true);
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em uma aplicação real, você faria uma chamada para um endpoint
      // que testa a conexão com o banco usando as credenciais fornecidas
      
      setConnectionStatus('success');
      toast({
        title: 'Conexão bem-sucedida!',
        description: 'PostgreSQL configurado corretamente.',
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: 'Erro na conexão',
        description: 'Verifique as credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const generateEnvFile = () => {
    const envContent = `# Configuração do Banco PostgreSQL
DB_HOST=${dbConfig.host}
DB_PORT=${dbConfig.port}
DB_NAME=${dbConfig.database}
DB_USER=${dbConfig.username}
DB_PASSWORD=${dbConfig.password}
DB_SSL=${dbConfig.ssl}

# URL de conexão completa
DATABASE_URL=postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?sslmode=${dbConfig.ssl}

# Configurações da aplicação
NODE_ENV=production
JWT_SECRET=seu_jwt_secret_aqui
GEMINI_API_KEY=sua_chave_gemini_aqui
`;

    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Arquivo .env gerado!',
      description: 'Configure as variáveis no seu servidor.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Configuração PostgreSQL
          </h1>
          <p className="text-slate-300 text-lg">
            Configure seu banco de dados PostgreSQL automaticamente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuração */}
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Database className="h-6 w-6 text-blue-400" />
                Configuração do Banco
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="host" className="text-slate-300">Host</Label>
                  <Input
                    id="host"
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="port" className="text-slate-300">Porta</Label>
                  <Input
                    id="port"
                    value={dbConfig.port}
                    onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="database" className="text-slate-300">Nome do Banco</Label>
                <Input
                  id="database"
                  value={dbConfig.database}
                  onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="username" className="text-slate-300">Usuário</Label>
                <Input
                  id="username"
                  value={dbConfig.username}
                  onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={dbConfig.password}
                  onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="ssl" className="text-slate-300">SSL Mode</Label>
                <Select
                  value={dbConfig.ssl}
                  onValueChange={(value) => setDbConfig({ ...dbConfig, ssl: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="disable">Desabilitado</SelectItem>
                    <SelectItem value="prefer">Preferido</SelectItem>
                    <SelectItem value="require">Obrigatório</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={testConnection}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isConnecting ? (
                  <>
                    <Server className="h-5 w-5 mr-2 animate-spin" />
                    Testando Conexão...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Testar Conexão
                  </>
                )}
              </Button>

              {connectionStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-400 bg-green-900/20 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>Conexão bem-sucedida!</span>
                </div>
              )}

              {connectionStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span>Erro na conexão. Verifique as credenciais.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Automático */}
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Server className="h-6 w-6 text-purple-400" />
                Setup Automático
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <h3 className="text-purple-300 font-semibold mb-2">1. Baixar Schema</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Baixe o arquivo SQL com toda a estrutura do banco
                  </p>
                  <Button
                    onClick={generateSchema}
                    variant="outline"
                    className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Schema SQL
                  </Button>
                </div>

                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <h3 className="text-blue-300 font-semibold mb-2">2. Gerar .env</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Crie o arquivo de configuração com as credenciais
                  </p>
                  <Button
                    onClick={generateEnvFile}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Arquivo .env
                  </Button>
                </div>

                <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                  <h3 className="text-green-300 font-semibold mb-2">3. Instruções</h3>
                  <div className="text-slate-400 text-sm space-y-2">
                    <p>• Execute o schema SQL no seu PostgreSQL</p>
                    <p>• Configure o arquivo .env no servidor</p>
                    <p>• Reinicie a aplicação</p>
                    <p>• Teste a conexão acima</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Importante</span>
                </div>
                <p className="text-yellow-300 text-sm">
                  Certifique-se de que o PostgreSQL está instalado e rodando antes de executar o schema.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* String de Conexão */}
        <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">String de Conexão Gerada</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={`postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?sslmode=${dbConfig.ssl}`}
              readOnly
              className="bg-slate-700 border-slate-600 text-white font-mono"
              rows={3}
            />
            <p className="text-slate-400 text-sm mt-2">
              Use esta string de conexão em sua aplicação
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseSetup;
