import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ClipboardCheck, 
  DollarSign, 
  Home, 
  Menu, 
  X,
  Settings,
  LogOut
} from 'lucide-react';
import Logo from '../Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'Usuário');
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Clientes Fechados', href: '/clientes-fechados', icon: ClipboardCheck },
    { name: 'Tipos de Sites', href: '/tipos-sites', icon: DollarSign },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem('currentUser');
      toast({
        title: "Sucesso",
        description: "Você saiu do sistema com sucesso."
      });
      navigate('/login');
    } catch (error: any) {
      console.error("Erro ao sair:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar sair. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Get primary color from localStorage if available
  const getPrimaryColor = (): string => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.primaryColor || "#00A3FF";
      }
    } catch (e) {
      console.error("Error getting user primary color:", e);
    }
    return "#00A3FF";
  };

  const primaryColor = getPrimaryColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-black/90 backdrop-blur-lg border-r border-white/10 shadow-lg lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full px-4">
          <div className="py-6 flex items-center justify-center">
            <Logo size="large" />
          </div>
          
          <nav className="mt-8 space-y-2 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg group transition-all duration-200",
                  location.pathname === item.href 
                    ? `bg-[${primaryColor}] text-white` 
                    : "text-gray-300 hover:bg-white/10"
                )}
                style={location.pathname === item.href ? { backgroundColor: primaryColor } : {}}
              >
                <item.icon 
                  className={cn(
                    "mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    location.pathname === item.href ? "text-white" : `text-[${primaryColor}]`
                  )}
                  style={location.pathname !== item.href ? { color: primaryColor } : {}}
                /> 
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="py-6 space-y-4">
            <div className="px-4 py-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">
                Olá, {userName}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Gestão de clientes simplificada
              </p>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" style={{ color: primaryColor }} />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        "lg:pl-64"
      )}>
        <main className="container px-4 py-8 mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
