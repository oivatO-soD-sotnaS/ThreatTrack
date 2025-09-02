'use client';

import { n8n_vulnerability } from '@/app/generated/prisma';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createInDevelopmentItem, createReadyItem, createToDoItem, deleteInDevelopmentItem, deleteReadyItem, deleteToDoItem, getAllInDevelopmentItems, getAllReadyItems, getAllToDoItems } from '@/server/kanban';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { authClient } from '@/lib/auth-client';
import { addPointsToUser, subtractPointsFromUser } from '@/server/score';

// Define the column structure
const columns = [
  { id: 'todo', name: 'A fazer', color: '#6B7280' },
  { id: 'in_development', name: 'Em andamento', color: '#F59E0B' },
  { id: 'ready', name: 'Pronto', color: '#10B981' },
];

const severityColors: Record<string, string> = {
  high: 'bg-destructive/20 text-destructive',
  critical: 'bg-destructive text-destructive-foreground',
  medium: 'bg-warning/20 text-warning',
  low: 'bg-success/20 text-success',
};

export interface KanbanItem {
  id: string;
  name: string;
  vulnerabilityId: string;
  vulnerability: n8n_vulnerability;
  column: string;
}

const KanbanFrame = () => {
  const [items, setItems] = useState<KanbanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {data: session} = authClient.useSession()

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data from all three tables
        const [todoItems, inDevItems, readyItems] = await Promise.all([
          getAllToDoItems(),
          getAllInDevelopmentItems(),
          getAllReadyItems()
        ]);

        // Transform the data to match kanban structure
        const transformedItems: KanbanItem[] = [
          ...todoItems.map(item => ({
            id: `${item.id}`,
            name: item.n8n_vulnerability.title || item.vulnerabilityId,
            vulnerabilityId: item.vulnerabilityId,
            vulnerability: item.n8n_vulnerability,
            column: 'todo'
          })),
          ...inDevItems.map(item => ({
            id: `${item.id}`,
            name: item.n8n_vulnerability.title || item.vulnerabilityId,
            vulnerabilityId: item.vulnerabilityId,
            vulnerability: item.n8n_vulnerability,
            column: 'in_development'
          })),
          ...readyItems.map(item => ({
            id: `${item.id}`,
            name: item.n8n_vulnerability.title || item.vulnerabilityId,
            vulnerabilityId: item.vulnerabilityId,
            vulnerability: item.n8n_vulnerability,
            column: 'ready'
          }))
        ];

        setItems(transformedItems);
      } catch (error) {
        console.error('Error fetching kanban data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If the item was dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If the item was dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the item that was dragged
    const itemIndex = items.findIndex(item => item.id === draggableId);
    if (itemIndex === -1) return;

    const originalColumn = items[itemIndex].column;

    // Create a new item with the updated column
    const updatedItem = {
      ...items[itemIndex],
      column: destination.droppableId
    };

    // Create a new array with the updated item
    const newItems = [...items];
    newItems[itemIndex] = updatedItem;

    setItems(newItems);
    
    const item = items.at(itemIndex)

    // Log the movement if the column changed
    if (
      originalColumn !== destination.droppableId &&
      item
    ) {
      if(!session) return

      const id = parseInt(item.id, 10);

      switch(destination.droppableId) {
        case "todo":
          await createToDoItem(item.vulnerability.n8n_vulnerability_id)
          if(source.droppableId === "in_development") {
            await deleteInDevelopmentItem(id) 
            console.log("remove from in_dev")
          }else {
            await deleteReadyItem(id)
            await subtractPointsFromUser(session.user.id, item.vulnerability.score === null ? 0 : item.vulnerability.score)
            console.log("remove from ready")
          }
          break
        case "in_development":
          await createInDevelopmentItem(item.vulnerability.n8n_vulnerability_id)
          if(source.droppableId === "todo") {
            await deleteToDoItem(id)
            console.log("remove from todo")
          }else {
            await deleteReadyItem(id)
            await subtractPointsFromUser(session.user.id, item.vulnerability.score === null ? 0 : item.vulnerability.score)
            console.log("remove from ready")
          }
          break
        case "ready":
          await createReadyItem(item.vulnerability.n8n_vulnerability_id)
          await addPointsToUser(session.user.id, item.vulnerability.score === null ? 0 : item.vulnerability.score)
          if(source.droppableId === "in_development") {
            await deleteInDevelopmentItem(id)
            console.log("remove from in_dev")
          }else {
            await deleteToDoItem(id)
            console.log("remove from todo")
          }
          break
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Quadro de vulnerabilidades
        </h1>
        <p className="text-muted-foreground mb-6">
          Quadro kanban de vulnerabilidades.
        </p>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  console.log(items)
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Quadro de vulnerabilidades
      </h1>
      <p className="text-muted-foreground mb-6">
        Quadro kanban de vulnerabilidades.
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => {
            const columnItems = items.filter(item => item.column === column.id);
            
            return (
              <div key={column.id} className="flex flex-col">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                      <span className="font-semibold">{column.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({columnItems.length})
                      </span>
                    </div>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-2 min-h-[200px] bg-secondary ${snapshot.isDraggingOver ? 'bg-muted/20' : ''}`}
                      >
                        {columnItems.map((item, index) => (
                          <Draggable 
                            key={item.id} 
                            draggableId={item.id} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-2 ${snapshot.isDragging ? 'opacity-70' : ''} cursor-grab active:cursor-grabbing`}
                              >
                                <Card className="w-full">
                                  <CardHeader className="pb-2 flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-sm font-medium">
                                        {item.vulnerability.title}
                                      </CardTitle>
                                      {item.vulnerability.severity && (
                                        <Badge
                                          className={`mt-1 ${severityColors[item.vulnerability.severity.toLowerCase()] || ''}`}
                                        >
                                          {item.vulnerability.severity}
                                        </Badge>
                                      )}
                                    </div>
                                  </CardHeader>
                                  <CardContent className="text-xs text-muted-foreground flex flex-col gap-1">
                                    {item.vulnerability.score && (
                                      <Badge variant={'destructive'}>
                                        Score: {item.vulnerability.score}
                                      </Badge>
                                    )}
                                    {item.vulnerability.sla_deadline && (
                                      <Badge variant={'secondary'}>
                                        SLA: {item.vulnerability.sla_deadline}
                                      </Badge>
                                    )}
                                    {item.vulnerability.product && (
                                      <Badge variant={'secondary'}>
                                        Product: {item.vulnerability.product}
                                      </Badge>
                                    )}
                                    <p>ID: {item.vulnerabilityId}</p>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanFrame;