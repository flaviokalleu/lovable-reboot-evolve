
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings, DollarSign, CreditCard, BarChart3, MessageSquare, PieChart, Calendar, Users, Kanban, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Transações', href: '/transactions', icon: DollarSign },
    { name: 'Orçamentos', href: '/budgets', icon: PieChart },
    { name: 'Relatórios', href: '/reports', icon: Calendar },
    { name: 'CRM', href: '/crm', icon: Users },
    { name: 'Kanban', href: '/kanban', icon: Kanban },
    { name: 'WhatsApp & IA', href: '/whatsapp', icon: MessageSquare },
    { name: 'Assinatura', href: '/payment', icon: CreditCard },
  ];

  if (isAdmin) {
    navigation.push(
      { name: 'Config WhatsApp', href: '/whatsapp-admin', icon: Settings },
      { name: 'Admin', href: '/admin', icon: Settings }
    );
  }

  const NavigationItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-sm border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card/95 backdrop-blur-md shadow-xl border-r border-border/50 z-40">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FinançaIA
            </span>
          </Link>
          
          <div className="space-y-2">
            <NavigationItems />
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card/95 backdrop-blur-md shadow-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="p-6">
                  <Link to="/dashboard" className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      FinançaIA
                    </span>
                  </Link>
                  
                  <div className="space-y-2">
                    <NavigationItems />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FinançaIA
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-64 right-0 z-40 bg-card/95 backdrop-blur-md shadow-sm border-b border-border/50">
        <div className="flex items-center justify-end px-6 py-3 gap-4">
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 lg:pt-16 min-h-screen">
        <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
