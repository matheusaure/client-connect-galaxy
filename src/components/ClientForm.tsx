
import React, { useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Client, ClientStatus, SiteType } from '@/types';
import { useClientContext } from '@/context/ClientContext';

const statusOptions: { value: ClientStatus; label: string }[] = [
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'em_negociacao', label: 'Em Negociação' },
  { value: 'nao_fechou', label: 'Não Fechou' },
  { value: 'fechado', label: 'Fechado' },
];

const formSchema = z.object({
  businessName: z.string().min(2, { message: 'Nome da empresa é obrigatório' }),
  contactName: z.string().optional(),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  city: z.string().min(1, { message: 'Cidade é obrigatória' }),
  contactDate: z.string().min(1, { message: 'Data de contato é obrigatória' }),
  status: z.enum(['em_andamento', 'em_negociacao', 'nao_fechou', 'fechado']),
  notes: z.string().optional(),
  siteTypeId: z.string().optional(),
  value: z.string().optional(),
  projectTimeline: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface ClientFormProps {
  onSubmit: (data: FormSchema) => void;
  defaultValues?: Partial<Client>;
  buttonText?: string;
}

const ClientForm = ({
  onSubmit,
  defaultValues = {
    businessName: '',
    contactName: '',
    phone: '',
    city: '',
    contactDate: new Date().toISOString().split('T')[0],
    status: 'em_negociacao' as ClientStatus,
    notes: '',
  },
  buttonText = 'Adicionar Cliente',
}: ClientFormProps) => {
  const { siteTypes } = useClientContext();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as any,
  });

  const watchStatus = form.watch('status');
  const isClosed = watchStatus === 'fechado';

  // When status changes to "fechado", update form fields
  useEffect(() => {
    if (isClosed) {
      // If no siteTypeId is set and there are siteTypes available, set the first one
      if (!form.getValues('siteTypeId') && siteTypes.length > 0) {
        form.setValue('siteTypeId', siteTypes[0].id);
        // Also set a default value for the project based on the selected site type
        const selectedType = siteTypes[0];
        form.setValue('value', selectedType.baseValue.toString());
        form.setValue('projectTimeline', '4'); // Default 4 weeks
      }
    }
  }, [isClosed, siteTypes, form]);

  const handleSiteTypeChange = (siteTypeId: string) => {
    form.setValue('siteTypeId', siteTypeId);
    // Update value based on selected site type
    const selectedType = siteTypes.find(type => type.id === siteTypeId);
    if (selectedType) {
      form.setValue('value', selectedType.baseValue.toString());
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Empresa*</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do estabelecimento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do contato (opcional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone*</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade*</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Contato*</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Conditional fields for 'fechado' status */}
        {isClosed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/50 p-4 rounded-md">
            <FormField
              control={form.control}
              name="siteTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Site*</FormLabel>
                  <Select
                    onValueChange={(value) => handleSiteTypeChange(value)}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de site" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {siteTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Valor do projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectTimeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de Desenvolvimento (semanas)*</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="4" 
                      min="1"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações adicionais sobre o cliente" 
                  {...field} 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default ClientForm;
