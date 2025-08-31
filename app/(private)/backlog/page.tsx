"use client";

import React, { useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { AlertTriangle, CircleOff, ClipboardList, ListChecks } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import VulnerabilityItem from "./_components/vulnerability-item";

export interface Vulnerability {
  vulnerability_id: string;
  title?: string | null;
  severity?: string | null;
  criticality?: number | null;
  cvssv3_score?: string | null;
  epss_score?: string | null;
  component_name?: string | null;
  description?: string | null;
  sla_deadline?: string | null;
}


const initialData = {
  kanban: [
    { vulnerability_id: "1", title: "XSS em formulário de login", severity: "High", criticality: 9, cvssv3_score: "9.1", epss_score: "0.88", component_name: "auth-service", description: "Input não sanitizado permite execução de JS malicioso.", sla_deadline: "2025-09-15" },
    { vulnerability_id: "2", title: "SQL Injection em endpoint /users", severity: "Critical", criticality: 10, cvssv3_score: "10.0", epss_score: "0.92", component_name: "user-api", description: "Parâmetros não parametrizados permitem injeção SQL.", sla_deadline: "2025-09-10" },
  ],
  priority: [
    { vulnerability_id: "3", title: "RCE no serviço de relatórios", severity: "Critical", criticality: 10, cvssv3_score: "9.8", epss_score: "0.95", component_name: "reporting-service", description: "Upload de arquivo malicioso permite execução remota.", sla_deadline: "2025-09-08" },
    { vulnerability_id: "4", title: "Deserialização insegura em API", severity: "High", criticality: 8, cvssv3_score: "8.5", epss_score: "0.72", component_name: "analytics-api", description: "Objetos inseguros podem ser injetados e explorados.", sla_deadline: "2025-09-20" },
  ],
  others: [
    { vulnerability_id: "5", title: "Divulgação de versão do servidor", severity: "Low", criticality: 3, cvssv3_score: "3.5", epss_score: "0.15", component_name: "web-server", description: "Cabeçalhos HTTP revelam informações de versão." },
    { vulnerability_id: "6", title: "Uso de dependência desatualizada", severity: "Medium", criticality: 5, cvssv3_score: "5.4", epss_score: "0.30", component_name: "spring-webmvc", description: "Versão antiga contém vulnerabilidades conhecidas.", sla_deadline: "2025-10-01" },
  ],
};

export default function Page() {
  const [vulns, setVulns] = useState(initialData);
  const draggingItemRef = useRef<{ droppableId: string } | null>(null);

  // Define os pares que não podem trocar de quadro
  const restrictedPairs: [string, string][] = [
    ["priority", "others"],
    ["others", "priority"],
  ];

  const onDragStart = (start: { source: { droppableId: string } }) => {
    draggingItemRef.current = { droppableId: start.source.droppableId };
  };

  const onDragEnd = (result: DropResult) => {
    draggingItemRef.current = null;
    const { source, destination } = result;
    if (!destination) return;

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;

    // Restrições: priority <-> others não permitido
    const restrictedPairs: [string, string][] = [
      ["priority", "others"],
      ["others", "priority"],
    ];
    if (restrictedPairs.some(([from, to]) => from === sourceListId && to === destListId)) {
      console.log(`Movimento proibido de ${sourceListId} para ${destListId}`);
      return;
    }

    const sourceList = [...vulns[sourceListId as keyof typeof vulns]];
    const [moved] = sourceList.splice(source.index, 1);

    if (sourceListId === destListId) {
      // reordena dentro do mesmo quadro
      sourceList.splice(destination.index, 0, moved);
      setVulns((prev) => ({ ...prev, [sourceListId]: sourceList }));
      console.log(`Item ${moved.vulnerability_id} reordenado dentro de ${sourceListId}`);
    } else {
      // mover para outro quadro permitido
      const destList = [...vulns[destListId as keyof typeof vulns]];
      destList.splice(destination.index, 0, moved);
      setVulns((prev) => ({
        ...prev,
        [sourceListId]: sourceList,
        [destListId]: destList,
      }));
      console.log(`Item ${moved.vulnerability_id} movido de ${sourceListId} para ${destListId}`);
    }
  };



  const renderColumn = (
    id: keyof typeof vulns,
    title: string,
    icon: React.ReactNode,
    highlight = false
  ) => (
    <Droppable droppableId={id}>
      {(provided, snapshot) => {
        // Determina se o usuário está tentando arrastar algo proibido para este quadro
        const isInvalidHover =
          snapshot.isDraggingOver &&
          draggingItemRef.current &&
          restrictedPairs.some(
            ([from, to]) =>
              from === draggingItemRef.current?.droppableId &&
              to === id
          );

        return (
          <Card
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`relative ${highlight ? "border-2 bg-secondary border-red-500 shadow-lg" : ""}`}
          >
            <CardHeader className="pb-2 flex items-center gap-2">
              {icon}
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              {vulns[id].map((v, index) => (
                <Draggable key={v.vulnerability_id} draggableId={v.vulnerability_id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <VulnerabilityItem vuln={v} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </CardContent>

            {/* Mensagem de aviso quando não pode soltar */}
            {isInvalidHover && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100/70 text-red-700 font-semibold rounded-lg pointer-events-none">
                <CircleOff />
              </div>
            )}
          </Card>
        );
      }}
    </Droppable>
  );

  return (
    <div className="min-h-[60vh] w-full px-4 py-6 md:px-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Backlog de Vulnerabilidades</h1>
      <p className="text-muted-foreground">Arraste e solte vulnerabilidades entre os quadros.</p>

      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="flex flex-col gap-4">
          {renderColumn("kanban", "No Kanban", <ClipboardList className="w-5 h-5" />)}
          {renderColumn("priority", "Top Prioridade", <AlertTriangle className="w-5 h-5 text-red-600" />, true)}
          {renderColumn("others", "Demais", <ListChecks className="w-5 h-5" />)}
        </div>
      </DragDropContext>
    </div>
  );
}
