
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
  FileText,
  Menu
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          FinanceIA
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">Sistema de Gestão Financeira</p>
      </div>

      <nav className="space-y-1 sm:space-y-2 px-4 sm:px-6 flex-1">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className={`w-full justify-start text-sm ${
              isActive(item.path) 
                ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white" 
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
            <span className="truncate">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="p-4 sm:p-6 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm"
          onClick={() => handleNavigation('/settings')}
        >
          <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
          Configurações
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 text-sm"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Mobile Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4 flex items-center justify-between">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-slate-800/95 backdrop-blur-sm border-slate-700/50 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            FinanceIA
          </h1>
          
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        {/* Main Content */}
        <div className="overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
