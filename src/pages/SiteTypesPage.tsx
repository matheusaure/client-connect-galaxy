import React, { useState } from 'react';
import { useClientContext } from '@/context/ClientContext';
import { NewSiteType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
} from '@/components/ui/alert-dialog';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome é obrigatório' }),
  description: z.string().optional(),
  baseValue: z.coerce.number().min(1, { message: 'Valor base deve ser maior que zero' }),
});

const SiteTypesPage = () => {
  const { siteTypes, addSiteType, updateSiteType, deleteSiteType } = useClientContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSiteType, setSelectedSiteType] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      baseValue: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const siteTypeData: NewSiteType = {
      name: values.name,
      description: values.description,
      baseValue: values.baseValue,
    };
    
    if (isEditing && selectedSiteType) {
      updateSiteType(selectedSiteType, siteTypeData);
    } else {
      addSiteType(siteTypeData);
    }
    
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const siteType = siteTypes.find((siteType) => siteType.id === id);
    if (siteType) {
      setSelectedSiteType(id);
      form.setValue('name', siteType.name);
      form.setValue('description', siteType.description || '');
      form.setValue('baseValue', siteType.baseValue);
      setIsEditing(true);
      setIsOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedSiteType(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSiteType) {
      deleteSiteType(selectedSiteType);
      setIsDeleteDialogOpen(false);
      setSelectedSiteType(null);
    }
  };

  const resetForm = () => {
    form.reset({
      name: '',
      description: '',
      baseValue: 0,
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tipos de Site</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Tipo de Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Tipo de Site' : 'Adicionar Tipo de Site'}</DialogTitle>
              <DialogDescription>
                Crie e gerencie os tipos de sites que sua empresa oferece.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do tipo de site" {...field} />
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
                        <Textarea placeholder="Descrição do tipo de site" {...field} />
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
                      <FormLabel>Valor Base</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Valor base do tipo de site" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">{isEditing ? 'Atualizar' : 'Salvar'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {siteTypes.map((siteType) => (
          <Card key={siteType.id}>
            <CardHeader>
              <CardTitle>{siteType.name}</CardTitle>
              <CardDescription>{siteType.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Valor Base: R$ {siteType.baseValue.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(siteType.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(siteType.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir o tipo de site permanentemente. Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SiteTypesPage;
