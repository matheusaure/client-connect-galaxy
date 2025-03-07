import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

interface UserData {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  companyNameColor?: string;
  logo?: string;
  primaryColor?: string;
  darkMode?: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyNameColor, setCompanyNameColor] = useState('#000000');
  const [primaryColor, setPrimaryColor] = useState('#00A3FF');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr) as UserData;
      setUser(userData);
      if (userData.primaryColor) {
        setPrimaryColor(userData.primaryColor);
      }
      if (userData.logo) {
        setLogoPreview(userData.logo);
      }
      if (userData.companyName) {
        setCompanyName(userData.companyName);
      }
      if (userData.companyNameColor) {
        setCompanyNameColor(userData.companyNameColor);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      companyName,
      companyNameColor,
      primaryColor,
      logo: logoPreview || user.logo
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    document.documentElement.style.setProperty('--primary', colorToHsl(primaryColor));

    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso!"
    });
  };

  const colorToHsl = (hex: string): string => {
    return "199 100% 50%";
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="appearance">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalize seu CRM</CardTitle>
              <CardDescription>
                Ajuste as cores, o logo e o nome da sua empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Digite o nome da sua empresa"
                  className="font-medium text-lg"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name-color">Cor do Nome da Empresa</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="company-name-color"
                      type="color"
                      value={companyNameColor}
                      onChange={(e) => setCompanyNameColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      type="text"
                      value={companyNameColor}
                      onChange={(e) => setCompanyNameColor(e.target.value)}
                      className="w-32"
                    />
                    <div className="border p-4 rounded-md flex items-center justify-center font-bold text-lg" style={{ color: companyNameColor }}>
                      Exemplo
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor do "CRM"</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-32"
                    />
                    <div className="border p-4 rounded-md flex items-center justify-center font-bold text-lg" style={{ color: primaryColor }}>
                      Exemplo
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex flex-col gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 mt-4 p-6 border rounded-md bg-muted/30">
                    <div className="w-full md:w-1/2">
                      <h3 className="mb-3 text-sm font-medium">Prévia da Logo:</h3>
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="h-20 object-contain mx-auto"
                        />
                      ) : (
                        <div className="h-20 flex items-center justify-center text-muted-foreground">
                          Nenhuma logo carregada
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full md:w-1/2">
                      <h3 className="mb-3 text-sm font-medium">Prévia completa:</h3>
                      <div className="flex justify-center p-4 bg-white rounded-lg shadow-sm">
                        <Logo size="medium" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Gerencie as informações da sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={user.name}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleLogout}>Sair</Button>
              <Button variant="destructive">Excluir Conta</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
