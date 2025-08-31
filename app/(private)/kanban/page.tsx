import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import KanbanFrame from './_components/kanban-frame'
import KanbanDashboard from './_components/kanban-dashboard'

export default function Page() {
  return (
    <Tabs defaultValue="kanban" className="w-full p-6">
      <TabsList>
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="kanban">
        <KanbanFrame />
      </TabsContent>
      <TabsContent value="dashboard">
        <KanbanDashboard />
      </TabsContent>
    </Tabs>
  )
}
