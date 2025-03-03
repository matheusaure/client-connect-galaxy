
import React, { useState } from 'react';
import { useClientContext } from '@/context/ClientContext';
import { SiteType } from '@/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome do tipo de site é obrigatório' }),
  description: z.string().optional(),
  baseValue: z.coerce.number().min(1, { message: 'Valor base deve ser maior que zero' }),
});

type FormSchema = z.infer<typeof formSchema>;

const SiteTypesPage = () => {
  const { siteTypes, addSiteType, updateSiteType, deleteSiteType } = useClientContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSiteType, setEditingSiteType] = useState<SiteType | null>(null);
  const [deleteSiteTypeId, setDeleteSiteTypeId] = useState<string | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      baseValue: 0,
    },
  });

  const handleAddSiteType = (data: FormSchema) => {
    addSiteType(data);
    form.reset();
    setDialogOpen(false);
  };

  const handleUpdateSiteType = (data: FormSchema) => {
    if (editingSiteType) {
      updateSiteType(editingSiteType.id, data);
      setEditingSiteType(null);
      form.reset();
      setDialogOpen(false);
    }
  };

  const openEditDialog = (siteType: SiteType) => {
    setEditingSiteType(siteType);
    form.reset({
      name: siteType.name,
      description: siteType.description || '',
      baseValue: siteType.baseValue,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingSiteType(null);
    form.reset({
      name: '',
      description: '',
      baseValue: 0,
    });
    setDialogOpen(true);
  };

  const handleDeleteSiteType = (id: string) => {
    setDeleteSiteTypeId(id);
  };

  const confirmDeleteSiteType = () => {
    if (deleteSiteTypeId) {
      deleteSiteType(deleteSiteTypeId);
      setDeleteSiteTypeId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Sites</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os diferentes tipos de sites que você oferece
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSiteType ? 'Editar Tipo de Site' : 'Adicionar Tipo de Site'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(
                  editingSiteType ? handleUpdateSiteType : handleAddSiteType
                )}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome*</FormLabel>
                      <FormControl>
                        <Input placeholder="Landing Page, Site Institucional, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva as características deste tipo de site" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="baseValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Base (R$)*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1000" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {editingSiteType ? 'Atualizar Tipo' : 'Adicionar Tipo'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {siteTypes.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Nenhum tipo de site cadastrado</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Adicione os tipos de sites que você oferece
          </p>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Tipo de Site
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteTypes.map((siteType) => (
            <Card key={siteType.id} className="glass-card hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="flex-1">{siteType.name}</span>
                  <DollarSign className="h-5 w-5 text-brand-blue" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {siteType.description && (
                  <p className="text-muted-foreground mb-4">
                    {siteType.description}
                  </p>
                )}
                <div className="bg-brand-blue/10 p-3 rounded-md">
                  <div className="font-semibold">Valor Base:</div>
                  <div className="text-xl font-bold text-brand-blue">
                    {formatCurrency(siteType.baseValue)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteSiteType(siteType.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
                <Button 
                  size="sm"
                  onClick={() => openEditDialog(siteType)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog 
        open={!!deleteSiteTypeId} 
        onOpenChange={(open) => !open && setDeleteSiteTypeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este tipo de site? 
              Você não poderá excluir tipos que já estejam sendo utilizados por clientes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSiteType}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SiteTypesPage;
