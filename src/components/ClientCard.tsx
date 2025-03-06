
import React from 'react';
import { Client } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Building, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  ClipboardList,
  MoreHorizontal,
  Code
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useClientContext } from '@/context/ClientContext';

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onConvert?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ 
  client, 
  onEdit, 
  onDelete,
  onConvert 
}) => {
  const { siteTypes } = useClientContext();
  
  const statusColor = {
    em_andamento: 'bg-blue-100 text-blue-800 border-blue-200',
    em_negociacao: 'bg-amber-100 text-amber-800 border-amber-200',
    nao_fechou: 'bg-red-100 text-red-800 border-red-200',
    fechado: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusLabel = {
    em_andamento: 'Em Andamento',
    em_negociacao: 'Em Negociação',
    nao_fechou: 'Não Fechou',
    fechado: 'Fechado',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Find the site type name if the client has a siteTypeId
  const siteTypeName = client.siteTypeId 
    ? siteTypes.find(type => type.id === client.siteTypeId)?.name 
    : null;

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300 overflow-hidden glass-card border border-gray-100">
      <div className={cn(
        "h-2 w-full", 
        client.status === 'em_andamento' && "bg-brand-blue",
        client.status === 'em_negociacao' && "bg-amber-500",
        client.status === 'nao_fechou' && "bg-red-500",
        client.status === 'fechado' && "bg-green-500",
      )} />
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge 
              variant="outline" 
              className={cn("mb-2", statusColor[client.status])}
            >
              {statusLabel[client.status]}
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
              <DropdownMenuItem onClick={onEdit}>
                Editar
              </DropdownMenuItem>
              {onConvert && client.status !== 'fechado' && (
                <DropdownMenuItem onClick={onConvert}>
                  Converter para Fechado
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={onDelete}
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
            <span>Contato: {formatDate(client.contactDate)}</span>
          </div>

          {siteTypeName && (
            <div className="flex items-center text-gray-600">
              <Code className="h-4 w-4 mr-2 text-brand-blue" />
              <span>Tipo de Site: {siteTypeName}</span>
            </div>
          )}
        </div>

        {client.notes && (
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-start text-gray-600">
              <ClipboardList className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-brand-blue" />
              <p className="text-sm line-clamp-3">{client.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientCard;
