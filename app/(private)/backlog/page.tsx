"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { AlertTriangle, ClipboardList, ListChecks, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VulnerabilityItem from "./_components/vulnerability-item";
import { n8n_vulnerability } from "@/app/generated/prisma";
import { getBacklogVulnerabilities, getKanbanVulnerabilities } from "@/server/n8n_vulnerability";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { createToDoItem } from "@/server/kanban";

type ColumnId = 'kanban' | 'priority' | 'backlog';

interface ColumnData {
  id: ColumnId;
  title: string;
  icon: React.ReactNode;
  items: n8n_vulnerability[];
  highlight?: boolean;
}

export default function Page() {
  const [columns, setColumns] = useState<Record<ColumnId, ColumnData>>({
    kanban: {
      id: 'kanban',
      title: 'No Kanban',
      icon: <ClipboardList className="w-5 h-5" />,
      items: [],
    },
    priority: {
      id: 'priority',
      title: 'Top Prioridade',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      items: [],
      highlight: true,
    },
    backlog: {
      id: 'backlog',
      title: 'Demais',
      icon: <ListChecks className="w-5 h-5" />,
      items: [],
    },
  });
  
  const [isPending, setIsPending] = useState<boolean>(false);
  const [expandedColumns, setExpandedColumns] = useState<Record<ColumnId, boolean>>({
    kanban: false,
    priority: false,
    backlog: false,
  });

  const toggleColumnExpansion = (columnId: ColumnId) => {
    setExpandedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const getVisibleItems = (column: ColumnData) => {
    const isExpanded = expandedColumns[column.id];
    return isExpanded ? column.items : column.items.slice(0, 3);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId as ColumnId];
    const destColumn = columns[destination.droppableId as ColumnId];
    
    // Find the dragged item
    const draggedItem = sourceColumn.items[source.index];
    
    setColumns(prev => {
      const newColumns = { ...prev };
      
      // Remove from source
      newColumns[source.droppableId as ColumnId] = {
        ...sourceColumn,
        items: sourceColumn.items.filter((_, index) => index !== source.index),
      };

      // Add to destination
      const destItems = [...destColumn.items];
      destItems.splice(destination.index, 0, draggedItem);
      
      newColumns[destination.droppableId as ColumnId] = {
        ...destColumn,
        items: destItems,
      };

      return newColumns;
    });

    if(destColumn.id === "kanban") {
      const c = await createToDoItem(draggedItem.n8n_vulnerability_id)
      console.log(c)
    }
  };

  const renderColumn = (column: ColumnData) => (
    <Droppable droppableId={column.id} key={column.id}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`relative transition-colors ${
            column.highlight 
              ? "border-2 bg-secondary border-red-500 shadow-lg" 
              : ""
          } ${
            snapshot.isDraggingOver 
              ? "bg-muted/50 border-primary" 
              : ""
          }`}
        >
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            {column.icon}
            <CardTitle>{column.title}</CardTitle>
            <span className="ml-auto text-sm text-muted-foreground">
              {column.items.length}
            </span>
          </CardHeader>

          <CardContent className="flex flex-col gap-2 min-h-[200px]">
            {getVisibleItems(column).map((vuln, index) => {
              // Get the original index in the full array for proper drag handling
              const originalIndex = column.items.findIndex(item => item.id === vuln.id);
              return (
                <Draggable 
                  key={`${column.id}-${vuln.id || index}`} 
                  draggableId={`${column.id}-${vuln.id || index}`} 
                  index={originalIndex}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-transform ${
                        snapshot.isDragging 
                          ? "rotate-2 scale-105 shadow-lg" 
                          : ""
                      }`}
                    >
                      <VulnerabilityItem vuln={vuln} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            
            {column.items.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleColumnExpansion(column.id)}
                className="mt-2 self-center text-muted-foreground hover:text-foreground"
              >
                {expandedColumns[column.id] ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Recolher
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Ver tudo ({column.items.length - 3} mais)
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Droppable>
  );

  useEffect(() => {
    const getVulns = async () => {
      setIsPending(true);

      const [kanbanVulnerabilities, backlogVulnerabilities] = await Promise.all([
        getKanbanVulnerabilities(),
        getBacklogVulnerabilities(),
      ]);

      // --- Monta a lista única de kanban ---
      const kanbanList: n8n_vulnerability[] = [];
      kanbanVulnerabilities.forEach((vuln) => {
        if (vuln.to_do_item?.length) kanbanList.push(vuln);
        else if (vuln.in_development_item?.length) kanbanList.push(vuln);
        else if (vuln.ready_item?.length) kanbanList.push(vuln);
      });

      // --- Seleciona top 10 por criticality ---
      const priorityList = [...backlogVulnerabilities]
        .sort((a, b) => Number(b.score ?? 0) - Number(a.score ?? 0))
        .slice(0, Math.floor(backlogVulnerabilities.length / 3));

      // --- Atualiza estados ---
      setColumns(prev => ({
        ...prev,
        kanban: { ...prev.kanban, items: kanbanList },
        priority: { ...prev.priority, items: priorityList },
        backlog: { ...prev.backlog, items: backlogVulnerabilities },
      }));

      setIsPending(false);
    };

    getVulns();
  }, []);

  return (
    <div className="min-h-[60vh] w-full px-4 py-6 md:px-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Backlog de Vulnerabilidades</h1>
      <p className="text-muted-foreground">Arraste e solte vulnerabilidades entre os quadros.</p>

      {isPending ? (
        <div className="flex justify-center">
          <Spinner variant="infinite" className="size-10"/>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col gap-4">
            {Object.values(columns).map(column => renderColumn(column))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}