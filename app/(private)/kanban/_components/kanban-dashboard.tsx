// app/dashboard/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, Clock, AlertCircle, User, Calendar, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllInDevelopmentItems, getAllReadyItems, getAllToDoItems } from '@/server/kanban';
import { Spinner } from '@/components/ui/kibo-ui/spinner';
import { user } from '@/app/generated/prisma';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

// Dados mockados para a carga de trabalho da equipe
const teamWorkload = [
  { name: 'João Silva', progress: 75, tickets: 5, role: 'Desenvolvedor Sênior' },
  { name: 'Maria Santos', progress: 45, tickets: 3, role: 'Desenvolvedora Front-end' },
  { name: 'Pedro Costa', progress: 90, tickets: 7, role: 'Especialista em Segurança' },
  { name: 'Ana Oliveira', progress: 30, tickets: 2, role: 'QA Analyst' },
];

export default function KanbanDashboard() {
  const [kanbanData, setKanbanData] = useState({
    todo: 0,
    inDevlopment: 0,
    ready: 0,
  });

  const vulnerabilityData = [
    { name: 'Concluído', value: kanbanData.ready },
    { name: 'Em Progresso', value: kanbanData.inDevlopment },
    { name: 'A Fazer', value: kanbanData.todo },
  ];

  const [isPending, setIsPending] = useState<boolean>(false)

   useEffect(() => {
      const fetchData = async () => {
        try {
          setIsPending(true);
          
          // Fetch data from all three tables
          const [todoItems, inDevItems, readyItems] = await Promise.all([
            getAllToDoItems(),
            getAllInDevelopmentItems(),
            getAllReadyItems()
          ]);
          
          setKanbanData({
            inDevlopment:inDevItems.length,
            ready: readyItems.length,
            todo: todoItems.length
          }) 
          
        } catch (error) {
          console.error('Error fetching kanban data:', error);
        } finally {
          setIsPending(false);
        }
      };
  
      fetchData();
    }, []);

  if (isPending) {
    return (
      <div>
        <div className='flex items-center gap-2 mb-6'>
          <BarChart3 className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Dashboard de Vulnerabilidades</h1>
        </div>
        <div className='flex justify-center'>
          <Spinner variant='infinite' className='size-10'/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Dashboard de Vulnerabilidades</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-md border-0 overflow-hidden bg-secondary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kanbanData.ready}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0 overflow-hidden bg-secondary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">A Entregar</CardTitle>
                <div className="p-2 rounded-full bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kanbanData.todo}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0 overflow-hidden bg-secondary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
                <div className="p-2 rounded-full bg-amber-100">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kanbanData.inDevlopment}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0 overflow-hidden bg-secondary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <div className="p-2 rounded-full bg-purple-100">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kanbanData.todo + kanbanData.inDevlopment + kanbanData.ready}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">
          <Card className="lg:col-span-4 shadow-md border-0 bg-secondary">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                Carga de Trabalho da Equipe
              </CardTitle>
              <CardDescription>Distribuição de tarefas por membro da equipe</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {teamWorkload.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs ">{member.role}</div>
                      </div>
                      <div className="text-sm font-medium">
                        {member.tickets} {member.tickets === 1 ? 'vulnerabilidade' : 'vulnerabilidades'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={member.progress} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-8 text-right">
                        {member.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 lg:col-span-3 bg-secondary">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Visão Geral do Status
              </CardTitle>
              <CardDescription>Distribuição de vulnerabilidades</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vulnerabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ _, percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {vulnerabilityData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} vulnerabilidades`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div className="p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{kanbanData.ready}</div>
                  <div className="text-xs font-medium text-green-600">Concluído</div>
                </div>
                <div className="p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{kanbanData.inDevlopment}</div>
                  <div className="text-xs font-medium text-blue-600">Em Progresso</div>
                </div>
                <div className="p-3 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{kanbanData.todo}</div>
                  <div className="text-xs font-medium text-amber-600">A Fazer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}