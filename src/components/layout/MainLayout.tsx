
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Users, 
  ClipboardCheck, 
  DollarSign, 
  Home, 
  Menu, 
  X
} from 'lucide-react';
import Logo from '../Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Clientes Fechados', href: '/clientes-fechados', icon: ClipboardCheck },
    { name: 'Tipos de Sites', href: '/tipos-sites', icon: DollarSign },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-white/80 backdrop-blur-lg border-r shadow-lg lg:translate-x-0",
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
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-brand-light-blue/10"
                )}
              >
                <item.icon 
                  className={cn(
                    "mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    location.pathname === item.href ? "text-white" : "text-brand-blue"
                  )} 
                />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="py-6">
            <div className="px-4 py-3 bg-brand-light-blue/10 rounded-lg">
              <p className="text-xs text-gray-500">
                Gestão de clientes simplificada
              </p>
            </div>
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
