
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
}

export interface SiteType {
  id: string;
  name: string;
  description?: string;
  baseValue: number;
  createdAt: string;
  updatedAt: string;
}
