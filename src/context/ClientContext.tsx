import React, { createContext, useState, useContext, useEffect } from 'react';
import { Client, ClosedClient, SiteType, ClientStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface ClientContextType {
  clients: Client[];
  closedClients: ClosedClient[];
  siteTypes: SiteType[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & { value?: string, projectTimeline?: string }) => void;
  updateClient: (id: string, client: Partial<Client> & { value?: string, projectTimeline?: string }) => void;
  deleteClient: (id: string) => void;
  addClosedClient: (client: Omit<ClosedClient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClosedClient: (id: string, client: Partial<ClosedClient>) => void;
  deleteClosedClient: (id: string) => void;
  addSiteType: (siteType: Omit<SiteType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSiteType: (id: string, siteType: Partial<SiteType>) => void;
  deleteSiteType: (id: string) => void;
  filterClientsByStatus: (status: ClientStatus | 'all') => Client[];
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

const initialSiteTypes: SiteType[] = [
  {
    id: uuidv4(),
    name: 'Landing Page',
    description: 'Página única de apresentação',
    baseValue: 1500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Site Institucional',
    description: 'Site completo para empresas',
    baseValue: 3000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'E-commerce',
    description: 'Loja virtual completa',
    baseValue: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });

  const [closedClients, setClosedClients] = useState<ClosedClient[]>(() => {
    const savedClosedClients = localStorage.getItem('closedClients');
    return savedClosedClients ? JSON.parse(savedClosedClients) : [];
  });

  const [siteTypes, setSiteTypes] = useState<SiteType[]>(() => {
    const savedSiteTypes = localStorage.getItem('siteTypes');
    return savedSiteTypes ? JSON.parse(savedSiteTypes) : initialSiteTypes;
  });

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('closedClients', JSON.stringify(closedClients));
  }, [closedClients]);

  useEffect(() => {
    localStorage.setItem('siteTypes', JSON.stringify(siteTypes));
  }, [siteTypes]);

  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & { value?: string, projectTimeline?: string }) => {
    const now = new Date().toISOString();
    const { value, projectTimeline, ...clientData } = client;
    
    const newClient: Client = {
      ...clientData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setClients((prev) => [...prev, newClient]);

    if (client.status === 'fechado' && client.siteTypeId) {
      const closedClient: ClosedClient = {
        ...newClient,
        value: Number(value) || 0,
        projectTimeline: Number(projectTimeline) || 4,
        progressPercentage: 0,
      };
      setClosedClients((prev) => [...prev, closedClient]);
    }
    
    toast.success("Cliente adicionado com sucesso");
  };

  const updateClient = (id: string, clientData: Partial<Client> & { value?: string, projectTimeline?: string }) => {
    setClients((prev) => {
      const updatedClients = prev.map((client) => {
        if (client.id === id) {
          const { value, projectTimeline, ...clientUpdateData } = clientData;
          
          const updatedClient = { 
            ...client, 
            ...clientUpdateData, 
            updatedAt: new Date().toISOString() 
          };

          if (clientData.status === 'fechado' && updatedClient.siteTypeId) {
            const closedClient: ClosedClient = {
              ...updatedClient,
              value: Number(value) || 0,
              projectTimeline: Number(projectTimeline) || 4,
              progressPercentage: 0,
            };
            setClosedClients(prev => {
              const exists = prev.some(c => c.id === id);
              if (exists) {
                return prev.map(c => c.id === id ? closedClient : c);
              }
              return [...prev, closedClient];
            });
          } else if (clientData.status && clientData.status !== 'fechado') {
            setClosedClients(prev => prev.filter(c => c.id !== id));
          }

          return updatedClient;
        }
        return client;
      });

      return updatedClients;
    });
    
    toast.success("Cliente atualizado com sucesso");
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
    toast.success("Cliente removido com sucesso");
  };

  const addClosedClient = (client: Omit<ClosedClient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newClosedClient: ClosedClient = {
      ...client,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      projectTimeline: client.projectTimeline || 4,
      progressPercentage: client.progressPercentage || 0,
    };
    
    const regularClient: Client = {
      ...client,
      id: newClosedClient.id,
      createdAt: now,
      updatedAt: now,
    };
    
    setClients((prev) => {
      const exists = prev.some(c => c.id === regularClient.id);
      if (!exists) {
        return [...prev, regularClient];
      }
      return prev;
    });
    
    setClosedClients((prev) => [...prev, newClosedClient]);
    toast.success("Cliente fechado adicionado com sucesso");
  };

  const updateClosedClient = (id: string, clientData: Partial<ClosedClient>) => {
    setClosedClients((prev) => 
      prev.map((client) => 
        client.id === id 
          ? { ...client, ...clientData, updatedAt: new Date().toISOString() }
          : client
      )
    );
    
    setClients((prev) => 
      prev.map((client) => {
        if (client.id === id) {
          const { value, projectTimeline, progressPercentage, ...regularClientData } = clientData;
          return { ...client, ...regularClientData, updatedAt: new Date().toISOString() };
        }
        return client;
      })
    );
    
    toast.success("Cliente fechado atualizado com sucesso");
  };

  const deleteClosedClient = (id: string) => {
    setClosedClients((prev) => prev.filter((client) => client.id !== id));
    setClients((prev) => 
      prev.map((client) => {
        if (client.id === id) {
          return { ...client, status: 'nao_fechou' as ClientStatus, updatedAt: new Date().toISOString() };
        }
        return client;
      })
    );
    toast.success("Cliente fechado removido com sucesso");
  };

  const addSiteType = (siteType: Omit<SiteType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSiteType: SiteType = {
      ...siteType,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setSiteTypes((prev) => [...prev, newSiteType]);
    toast.success("Tipo de site adicionado com sucesso");
  };

  const updateSiteType = (id: string, siteTypeData: Partial<SiteType>) => {
    setSiteTypes((prev) => 
      prev.map((siteType) => 
        siteType.id === id 
          ? { ...siteType, ...siteTypeData, updatedAt: new Date().toISOString() }
          : siteType
      )
    );
    toast.success("Tipo de site atualizado com sucesso");
  };

  const deleteSiteType = (id: string) => {
    const isSiteTypeInUse = closedClients.some(client => client.siteTypeId === id);
    
    if (isSiteTypeInUse) {
      toast.error("Não é possível excluir um tipo de site que está sendo usado por clientes");
      return;
    }
    
    setSiteTypes((prev) => prev.filter((siteType) => siteType.id !== id));
    toast.success("Tipo de site removido com sucesso");
  };

  const filterClientsByStatus = (status: ClientStatus | 'all') => {
    if (status === 'all') {
      return clients;
    }
    return clients.filter(client => client.status === status);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        closedClients,
        siteTypes,
        addClient,
        updateClient,
        deleteClient,
        addClosedClient,
        updateClosedClient,
        deleteClosedClient,
        addSiteType,
        updateSiteType,
        deleteSiteType,
        filterClientsByStatus,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
