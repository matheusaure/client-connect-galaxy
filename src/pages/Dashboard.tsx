
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useClientContext } from '@/context/ClientContext';
import { 
  Users, 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { 
    clients, 
    closedClients, 
    siteTypes,
    filterClientsByStatus 
  } = useClientContext();

  // Client stats
  const totalClients = clients.length;
  const totalClosedClients = closedClients.length;
  const inProgress = filterClientsByStatus('em_andamento').length;
  const inNegotiation = filterClientsByStatus('em_negociacao').length;
  const notClosed = filterClientsByStatus('nao_fechou').length;

  // Revenue calculation
  const totalRevenue = closedClients.reduce((sum, client) => sum + client.value, 0);

  // Chart data for status distribution
  const statusData = [
    { name: 'Em Andamento', value: inProgress, color: '#0496FF' },
    { name: 'Em Negociação', value: inNegotiation, color: '#06D6A0' },
    { name: 'Não Fechou', value: notClosed, color: '#EF476F' },
    { name: 'Fechado', value: totalClosedClients, color: '#118AB2' },
  ];

  // Chart data for site types
  const siteTypeData = siteTypes.map(type => {
    const count = closedClients.filter(client => client.siteTypeId === type.id).length;
    return {
      name: type.name,
      count,
      value: closedClients
        .filter(client => client.siteTypeId === type.id)
        .reduce((sum, client) => sum + client.value, 0)
    };
  });

  // Months data for timeline chart
  const getMonthsData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        name: month.toLocaleDateString('pt-BR', { month: 'short' }),
        closedCount: 0,
        revenue: 0
      });
    }
    
    closedClients.forEach(client => {
      const clientDate = new Date(client.contactDate);
      const monthIndex = months.findIndex(m => 
        new Date(today.getFullYear(), today.getMonth() - (5 - months.indexOf(m)), 1).getMonth() === clientDate.getMonth() &&
        new Date(today.getFullYear(), today.getMonth() - (5 - months.indexOf(m)), 1).getFullYear() === clientDate.getFullYear()
      );
      
      if (monthIndex !== -1) {
        months[monthIndex].closedCount += 1;
        months[monthIndex].revenue += client.value;
      }
    });
    
    return months;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do seu negócio
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients + totalClosedClients}</div>
            <p className="text-xs text-muted-foreground">
              {totalClosedClients} clientes fechados
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Em Negociação
            </CardTitle>
            <Clock className="h-4 w-4 text-brand-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inNegotiation}</div>
            <p className="text-xs text-muted-foreground">
              Clientes em processo
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalClients + totalClosedClients > 0 
                ? `${Math.round((totalClosedClients / (totalClients + totalClosedClients)) * 100)}%` 
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              De negócios fechados
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              De projetos fechados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} cliente(s)`, 'Quantidade']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getMonthsData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  stroke="#0496FF"
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#06D6A0"
                  tickFormatter={(value) => `R$${value/1000}k`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "closedCount") return [`${value} cliente(s)`, "Clientes Fechados"];
                    return [
                      value.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }), 
                      "Receita"
                    ];
                  }}
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="closedCount" 
                  fill="#0496FF" 
                  name="closedCount"
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="revenue" 
                  fill="#06D6A0" 
                  name="revenue"
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Tipos de Sites</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={siteTypeData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "count") return [`${value} cliente(s)`, "Quantidade"];
                  return [
                    value.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }), 
                    "Valor Total"
                  ];
                }}
              />
              <Bar dataKey="count" fill="#8EB8E5" name="count" radius={[0, 4, 4, 0]} />
              <Bar dataKey="value" fill="#0496FF" name="value" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
