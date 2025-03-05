
export type ClientStatus = 'em_andamento' | 'em_negociacao' | 'nao_fechou' | 'fechado';

export interface Client {
  id: string;
  businessName: string;
  contactName?: string;
  phone: string;
  city: string;
  contactDate: string;
  status: ClientStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClosedClient extends Client {
  siteTypeId: string;
  value: number;
  projectTimeline?: number; // Timeline in weeks
  progressPercentage?: number; // Progress percentage (0-100)
}

export interface SiteType {
  id: string;
  name: string;
  description?: string;
  baseValue: number;
  createdAt: string;
  updatedAt: string;
}

export type NewSiteType = Omit<SiteType, 'id' | 'createdAt' | 'updatedAt'>;

export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & {
  siteTypeId?: string;
  value?: string;
  projectTimeline?: string;
};
