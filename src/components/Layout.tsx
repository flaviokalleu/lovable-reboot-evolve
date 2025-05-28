
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CreditCard, 
  MessageSquare, 
  PieChart, 
  BarChart3, 
  Settings, 
  LogOut, 
  Users,
  Kanban,
  Building2,
  UsersIcon,
  Truck,
  CreditCard as PaymentIcon,
  FileText
} from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'Empresas', path: '/companies' },
    { icon: UsersIcon, label: 'Clientes', path: '/customers' },
    { icon: Truck, label: 'Fornecedores', path: '/suppliers' },
    { icon: CreditCard, label: 'Transações', path: '/transactions' },
    { icon: FileText, label: 'Orçamentos', path: '/budgets' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: MessageSquare, label: 'WhatsApp', path: '/whatsapp' },
    { icon: Users, label: 'CRM', path: '/crm' },
    { icon: Kanban, label: 'Kanban', path: '/kanban' },
    { icon: PaymentIcon, label: 'Pagamento', path: '/payment' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            FinanceIA
          </h1>
          <p className="text-slate-400 text-sm">Sistema de Gestão Financeira</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive(item.path) 
                  ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white" 
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5 mr-3" />
            Configurações
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
