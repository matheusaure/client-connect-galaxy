
import React, { useState } from 'react';
import { useClientContext } from '@/context/ClientContext';
import { ClosedClient } from '@/types';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Building, User, Phone, MapPin, Calendar, DollarSign, MoreHorizontal, Clock, MonitorPlay } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

const ClosedClientsPage = () => {
  const { 
    closedClients, 
    updateClosedClient, 
    deleteClosedClient,
    siteTypes
  } = useClientContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSiteType, setSelectedSiteType] = useState<string | 'all'>('all');
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<ClosedClient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogType, setEditDialogType] = useState<'value' | 'progress'>('value');
  const [editedValue, setEditedValue] = useState('');
  const [editedTimeline, setEditedTimeline] = useState('');
  const [editedProgress, setEditedProgress] = useState<number>(0);

  const filteredClients = closedClients.filter(client => 
    (selectedSiteType === 'all' || client.siteTypeId === selectedSiteType) &&
    (client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.contactName && client.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = filteredClients.reduce((sum, client) => sum + client.value, 0);

  const handleEditClient = (client: ClosedClient, type: 'value' | 'progress') => {
    setEditingClient(client);
    setEditDialogType(type);
    
    if (type === 'value') {
      setEditedValue(client.value.toString());
    } else {
      setEditedTimeline(client.projectTimeline?.toString() || '4');
      setEditedProgress(client.progressPercentage || 0);
    }
    
    setDialogOpen(true);
  };

  const handleUpdateClient = () => {
    if (editingClient) {
      if (editDialogType === 'value') {
        updateClosedClient(editingClient.id, {
          value: Number(editedValue)
        });
      } else {
        updateClosedClient(editingClient.id, {
          projectTimeline: Number(editedTimeline),
          progressPercentage: editedProgress
        });
      }
      setEditingClient(null);
      setDialogOpen(false);
    }
  };

  const handleDeleteClient = (id: string) => {
    setDeleteClientId(id);
  };

  const confirmDeleteClient = () => {
    if (deleteClientId) {
      deleteClosedClient(deleteClientId);
      setDeleteClientId(null);
    }
  };

  const getSiteTypeName = (id: string) => {
    const siteType = siteTypes.find(type => type.id === id);
    return siteType ? siteType.name : 'Desconhecido';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes Fechados</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seus contratos fechados e receita
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes Fechados
            </CardTitle>
            <Building className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredClients.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-brand-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes fechados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setSelectedSiteType(value)}>
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          <TabsTrigger value="all">Todos os Tipos</TabsTrigger>
          {siteTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id}>
              {type.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Nenhum cliente fechado encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Converta seus clientes em negociação para fechados
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card key={client.id} className="h-full hover:shadow-md transition-shadow duration-300 glass-card border border-gray-100">
                  <div className="h-2 w-full bg-green-500" />
                  
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className="mb-2 bg-brand-teal text-white">
                          {getSiteTypeName(client.siteTypeId)}
                        </Badge>
                        <h3 className="font-semibold text-lg mb-1">{client.businessName}</h3>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClient(client, 'value')}>
                            Editar Valor
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClient(client, 'progress')}>
                            Atualizar Progresso
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2 text-sm">
                      {client.contactName && (
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2 text-brand-blue" />
                          <span>{client.contactName}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-brand-blue" />
                        <span>{client.phone}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-brand-blue" />
                        <span>{client.city}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-brand-blue" />
                        <span>Contato: {format(new Date(client.contactDate), 'dd/MM/yyyy')}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Valor:</span>
                        <span className="font-bold text-brand-blue">
                          {client.value.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-brand-blue" />
                          <span className="text-gray-600 text-sm">
                            Tempo de desenvolvimento: {client.projectTimeline || 4} semanas
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Progresso:</span>
                          <span className="text-sm font-medium">
                            {client.progressPercentage || 0}%
                          </span>
                        </div>
                        <Progress 
                          value={client.progressPercentage || 0} 
                          className={
                            (client.progressPercentage || 0) >= 100 
                              ? "h-2 bg-gray-100" 
                              : "h-2 bg-gray-100"
                          }
                        />
                      </div>
                    </div>

                    {client.notes && (
                      <div className="mt-4 pt-3 border-t">
                        <p className="text-sm text-gray-600 line-clamp-3">{client.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {siteTypes.map((type) => (
          <TabsContent key={type.id} value={type.id} className="mt-6">
            {filteredClients.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Nenhum cliente com este tipo de site</h3>
                <p className="text-muted-foreground mt-1">
                  Feche projetos com este tipo de site para vê-los aqui
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <Card key={client.id} className="h-full hover:shadow-md transition-shadow duration-300 glass-card border border-gray-100">
                    <div className="h-2 w-full bg-green-500" />
                    
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Badge className="mb-2 bg-brand-teal text-white">
                            {getSiteTypeName(client.siteTypeId)}
                          </Badge>
                          <h3 className="font-semibold text-lg mb-1">{client.businessName}</h3>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClient(client, 'value')}>
                              Editar Valor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClient(client, 'progress')}>
                              Atualizar Progresso
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClient(client.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2 text-sm">
                        {client.contactName && (
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2 text-brand-blue" />
                            <span>{client.contactName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-brand-blue" />
                          <span>{client.phone}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-brand-blue" />
                          <span>{client.city}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-brand-blue" />
                          <span>Contato: {format(new Date(client.contactDate), 'dd/MM/yyyy')}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Valor:</span>
                          <span className="font-bold text-brand-blue">
                            {client.value.toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-brand-blue" />
                            <span className="text-gray-600 text-sm">
                              Tempo de desenvolvimento: {client.projectTimeline || 4} semanas
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Progresso:</span>
                            <span className="text-sm font-medium">
                              {client.progressPercentage || 0}%
                            </span>
                          </div>
                          <Progress 
                            value={client.progressPercentage || 0} 
                            className="h-2 bg-gray-100"
                          />
                        </div>
                      </div>

                      {client.notes && (
                        <div className="mt-4 pt-3 border-t">
                          <p className="text-sm text-gray-600 line-clamp-3">{client.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog 
        open={!!deleteClientId} 
        onOpenChange={(open) => !open && setDeleteClientId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente fechado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteClient}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editDialogType === 'value' ? 'Editar Valor' : 'Atualizar Progresso'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {editDialogType === 'value' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Novo Valor (R$)
                </label>
                <Input
                  type="number"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  placeholder="Valor do projeto"
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tempo de Desenvolvimento (semanas)
                  </label>
                  <Input
                    type="number"
                    value={editedTimeline}
                    onChange={(e) => setEditedTimeline(e.target.value)}
                    placeholder="Tempo em semanas"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Progresso do Projeto
                    </label>
                    <span className="text-sm font-medium">
                      {editedProgress}%
                    </span>
                  </div>
                  <Slider
                    value={[editedProgress]}
                    onValueChange={(values) => setEditedProgress(values[0])}
                    max={100}
                    step={5}
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateClient}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClosedClientsPage;
