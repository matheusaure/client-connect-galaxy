
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { toast } from '@/components/ui/use-toast';

interface UserData {
  id: string;
  email: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  darkMode?: boolean;
}

const defaultUsers: UserData[] = [
  {
    id: '1',
    email: 'admin@gestaoCRM.com',
    name: 'Administrador',
    logo: '/lovable-uploads/c1980de2-8024-43e4-a1be-86e1b8cc3e79.png',
    primaryColor: '#00A3FF',
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Simulate authentication
    const user = defaultUsers.find(u => u.email === email);
    
    if (user) {
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso!"
      });
      navigate('/');
    } else {
      toast({
        title: "Erro",
        description: "Email ou senha incorretos.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password || !name || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    // Check if email already exists
    const existingUser = defaultUsers.find(u => u.email === email);
    if (existingUser) {
      toast({
        title: "Erro",
        description: "Este email já está cadastrado.",
        variant: "destructive"
      });
      return;
    }

    // Create new user
    const newUser: UserData = {
      id: Date.now().toString(),
      email,
      name,
      primaryColor: '#00A3FF',
    };

    // Add to users and store in localStorage
    const updatedUsers = [...defaultUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    toast({
      title: "Sucesso",
      description: "Cadastro realizado com sucesso!"
    });
    navigate('/');
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // Reset fields
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
              
              <Button type="submit" className="w-full mt-4">
                {isRegistering ? 'Cadastrar' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full" onClick={toggleMode}>
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
