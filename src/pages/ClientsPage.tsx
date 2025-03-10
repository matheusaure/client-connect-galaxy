
import React, { useState } from 'react';
import { useClientContext } from '@/context/ClientContext';
import ClientForm from '@/components/ClientForm';
import ClientCard from '@/components/ClientCard';
import { Client, ClientStatus } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Plus, ArrowDownUp } from 'lucide-react';
import { SiteType } from '@/types';

const ClientsPage = () => {
  const { 
    clients, 
    addClient, 
    updateClient, 
    deleteClient, 
    siteTypes,
    addClosedClient
  } = useClientContext();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<ClientStatus | 'all'>('all');
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [convertClientId, setConvertClientId] = useState<string | null>(null);
  const [siteTypeId, setSiteTypeId] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [projectTimeline, setProjectTimeline] = useState<string>('4'); // Default 4 weeks
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const clientToConvert = convertClientId ? clients.find(c => c.id === convertClientId) : null;

  const filteredClients = clients
    .filter(client => 
      (status === 'all' || client.status === status) &&
      (client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.contactName && client.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.contactDate).getTime() - new Date(b.contactDate).getTime();
      } else {
        return new Date(b.contactDate).getTime() - new Date(a.contactDate).getTime();
      }
    });

  const handleAddClient = (data: any) => {
    if (data.status === 'fechado' && data.siteTypeId) {
      addClient(data);
    } else {
      addClient(data);
    }
    setDialogOpen(false);
  };

  const handleUpdateClient = (data: any) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
      setEditingClient(null);
      setDialogOpen(false);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    setDeleteClientId(id);
  };

  const confirmDeleteClient = () => {
    if (deleteClientId) {
      deleteClient(deleteClientId);
      setDeleteClientId(null);
    }
  };

  const handleConvertClient = (id: string) => {
    setConvertClientId(id);
    if (siteTypes.length > 0) {
      setSiteTypeId(siteTypes[0].id);
      setValue(siteTypes[0].baseValue.toString());
      setProjectTimeline('4'); // Default to 4 weeks
    }
  };

  const confirmConvertClient = () => {
    if (convertClientId && clientToConvert && siteTypeId) {
      addClosedClient({
        ...clientToConvert,
        status: 'fechado',
        siteTypeId,
        value: Number(value),
        projectTimeline: Number(projectTimeline),
        progressPercentage: 0, // Start with 0% progress
      });
      deleteClient(convertClientId);
      setConvertClientId(null);
    }
  };

  const handleToggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Função auxiliar para obter o nome do tipo de site
  const getSiteTypeName = (siteTypeId?: string) => {
    if (!siteTypeId) return '';
    const siteType = siteTypes.find(type => type.id === siteTypeId);
    return siteType ? siteType.name : '';
  };

  // Renderiza um card de cliente com informações extras quando for um cliente fechado
  const renderClientCard = (client: Client) => {
    const isClosed = client.status === 'fechado';
    const siteTypeName = getSiteTypeName(client.siteTypeId);
    
    return (
      <ClientCard
        key={client.id}
        client={{
          ...client,
          siteTypeName: siteTypeName // Adicionando o nome do tipo de site para exibição
        }}
        onEdit={() => handleEditClient(client)}
        onDelete={() => handleDeleteClient(client.id)}
        onConvert={() => handleConvertClient(client.id)}
      />
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus contatos e negociações
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <ClientForm 
              onSubmit={editingClient ? handleUpdateClient : handleAddClient}
              defaultValues={editingClient || undefined}
              buttonText={editingClient ? 'Atualizar Cliente' : 'Adicionar Cliente'}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          className="w-full sm:w-auto inline-flex items-center justify-center"
          onClick={handleToggleSortOrder}
        >
          <ArrowDownUp className="mr-2 h-4 w-4" />
          Ordenar: {sortOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setStatus(value as ClientStatus | 'all')}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="em_negociacao">Em Negociação</TabsTrigger>
          <TabsTrigger value="nao_fechou">Não Fechou</TabsTrigger>
          <TabsTrigger value="fechado">Fechado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Adicione novos clientes ou ajuste seus filtros de busca
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(renderClientCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="em_andamento" className="mt-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Nenhum cliente em andamento encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Adicione novos clientes ou ajuste seus filtros de busca
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(renderClientCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="em_negociacao" className="mt-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Nenhum cliente em negociação encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Adicione novos clientes ou ajuste seus filtros de busca
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(renderClientCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="nao_fechou" className="mt-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Nenhum cliente que não fechou encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Adicione novos clientes ou ajuste seus filtros de busca
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(renderClientCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="fechado" className="mt-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Nenhum cliente fechado encontrado</h3>
              <p className="text-muted-foreground mt-1">
                Adicione novos clientes com status "Fechado" ou converta clientes existentes
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(renderClientCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteClientId} onOpenChange={(open) => !open && setDeleteClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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

      <AlertDialog open={!!convertClientId} onOpenChange={(open) => !open && setConvertClientId(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Converter para Cliente Fechado
            </AlertDialogTitle>
            <AlertDialogDescription>
              Complete as informações para mover este cliente para "Fechados"
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tipo de Site
              </label>
              <select 
                value={siteTypeId}
                onChange={(e) => {
                  setSiteTypeId(e.target.value);
                  const selectedType = siteTypes.find(type => type.id === e.target.value);
                  if (selectedType) {
                    setValue(selectedType.baseValue.toString());
                  }
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {siteTypes.map((type: SiteType) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Valor (R$)
              </label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Valor do projeto"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tempo de Desenvolvimento (semanas)
              </label>
              <Input
                type="number"
                value={projectTimeline}
                onChange={(e) => setProjectTimeline(e.target.value)}
                placeholder="Tempo em semanas"
                min="1"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmConvertClient}
              disabled={!siteTypeId || !value || !projectTimeline}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;
