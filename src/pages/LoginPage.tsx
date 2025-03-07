
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já existe um usuário autenticado
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (profileData) {
          localStorage.setItem('currentUser', JSON.stringify({
            id: data.session.user.id,
            email: data.session.user.email,
            name: profileData.name,
            logo: profileData.logo,
            primaryColor: profileData.primary_color,
            companyName: profileData.company_name,
            companyNameColor: profileData.company_name_color,
          }));
          navigate('/');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validação simples
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Buscar dados do perfil
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        // Salvar dados do usuário no localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: profileData?.name || data.user.email,
          logo: profileData?.logo || "/lovable-uploads/c1980de2-8024-43e4-a1be-86e1b8cc3e79.png",
          primaryColor: profileData?.primary_color || "#00A3FF",
          companyName: profileData?.company_name || "Gestão",
          companyNameColor: profileData?.company_name_color || "#000000",
        }));
        
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!"
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao fazer login. Verifique suas credenciais.",
        variant: "destructive"
      });
      console.error("Erro de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validação simples
    if (!email || !password || !name || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Registrar o usuário no Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // O usuário foi criado com sucesso
        // Os dados do perfil são criados automaticamente pelo trigger no banco de dados
        
        toast({
          title: "Sucesso",
          description: "Cadastro realizado com sucesso! Você já pode fazer login."
        });
        
        // Retornar para a tela de login
        setIsRegistering(false);
        setPassword('');
        setEmail('');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar conta. Tente novamente.",
        variant: "destructive"
      });
      console.error("Erro de registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // Resetar campos
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="mb-3">
              <Logo size="large" />
            </div>
            <CardTitle className="text-2xl">{isRegistering ? 'Criar Conta' : 'Entrar'}</CardTitle>
            <CardDescription>
              {isRegistering 
                ? 'Cadastre-se para gerenciar seus clientes' 
                : 'Entre para acessar o sistema de gestão de clientes'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </div>
              
              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Carregando...' : isRegistering ? 'Cadastrar' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full" onClick={toggleMode} disabled={isLoading}>
              {isRegistering 
                ? 'Já tem uma conta? Entre aqui' 
                : 'Não tem uma conta? Cadastre-se'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
