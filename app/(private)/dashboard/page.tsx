"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Shield, Clock, Activity, Flame } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



// import { RiskOverTimeLine } from "./components/charts/RiskOverTimeLine" // opcional

import { fmt, pct } from "./lib/format"
import {
  mockAging,
  mockAssets,
  mockBacklogFunnel,
  mockCFD,
  mockEPSSDist,
  mockKPIs,
  mockPriSevMatrix,

  mockResolvedVsNew,

  mockRiskByTeam,

  mockRiskGaugeValue,

  mockRiskOverTime,

  mockScatter,
  mockSLATrend,
  mockTopPriority,
  mockVendorBars,
  // mockWatchlist,
} from "./mock/data"
import { AgingHistogram, AssetsTable, BacklogFunnel, CFDArea, CVSSxEPSSScatter, EPSSDonut, KPICard, PrioritySeverityMatrix, ResolvedVsNewArea, RiskByTeamStackedBar, RiskGaugeRadial, RiskOverTimeArea, Section, SLATrendLine, TopPriorityList } from "./_components"
import { VendorBarHorizontal } from "./_components/charts/VendorBarHorizontal"

/** ---------------- Motion helpers ---------------- */
const fade = {
  hidden: { opacity: 0, y: 8 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" },
  }),
}

const cardHover = {
  whileHover: { scale: 1.01, translateY: -2 },
  whileTap: { scale: 0.995 },
}

function FadeItem({
  index = 0,
  children,
  className,
}: React.PropsWithChildren<{ index?: number; className?: string }>) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fade}
      className={className}
      {...cardHover}
    >
      {children}
    </motion.div>
  )
}

/** ---------------- Page ---------------- */
export default function Page() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5 ">
        <motion.h1
          className="text-2xl md:text-3xl font-semibold tracking-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Visão geral de vulnerabilidades
        </motion.h1>
        <p className="text-sm text-muted-foreground mt-1">
          Priorize pelo risco real: CVSS × EPSS × Criticidade × Exposição
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
          <TabsTrigger value="exposicao">Exposição</TabsTrigger>
          <TabsTrigger value="operacao">Operação</TabsTrigger>
        </TabsList>

        {/* --------- OVERVIEW --------- */}
        <TabsContent value="overview" className="space-y-4">
          {/* KPIs: compactos e acima da dobra */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3"
          >
            <FadeItem index={0}>
              <KPICard
                title="Abertas (Kanban)"
                value={fmt(mockKPIs.kanbanOpen)}
                icon={<Shield className="w-5 h-5" />}
              />
            </FadeItem>
            <FadeItem index={1}>
              <KPICard
                title="Backlog em triagem"
                value={fmt(mockKPIs.backlogTriage)}
                icon={<Activity className="w-5 h-5" />}
              />
            </FadeItem>
            <FadeItem index={2}>
              <KPICard
                title="Com KEV"
                value={fmt(mockKPIs.withKEV)}
                icon={<Flame className="w-5 h-5" />}
              />
            </FadeItem>
            <FadeItem index={3}>
              <KPICard
                title="SLA em risco"
                value={fmt(mockKPIs.slaBreaches)}
                icon={<Clock className="w-5 h-5" />}
              />
            </FadeItem>
            <FadeItem index={4}>
              <KPICard
                title="Índice de risco"
                value={pct(mockKPIs.riskIndex)}
                icon={<AlertTriangle className="w-5 h-5" />}
              />
            </FadeItem>
          </motion.div>

          {/* Linha principal minimalista: dois gráficos lado a lado, menores */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-14"
          >
            <FadeItem index={0} className="chart-sm">
              <Section title="Saúde do risco (organizacional)">
                {/* altura reduzida via override CSS (chart-sm) */}
                <RiskOverTimeArea data={mockRiskOverTime} />
              </Section>
            </FadeItem>
            <FadeItem index={1} className="chart-sm">
              <Section title="Prioridade × Severidade">
                {/* altura reduzida via override CSS (chart-sm) */}
                <PrioritySeverityMatrix data={mockPriSevMatrix} />
              </Section>
            </FadeItem>
          </motion.div>

          {/* Cards auxiliares, igualmente compactos */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-3"
          >
            <FadeItem index={0}>
              <RiskGaugeRadial value={63} target={40} maxSize={280} />
            </FadeItem>
            <FadeItem index={1}>
              <ResolvedVsNewArea data={mockResolvedVsNew} />
            </FadeItem>
            <FadeItem index={2}>
              <RiskByTeamStackedBar data={mockRiskByTeam} />
            </FadeItem>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-3"
          >
            <FadeItem index={0}>
              <Section title="Execução (Kanban)">
                <TopPriorityList items={mockTopPriority} />
              </Section>
            </FadeItem>
            <FadeItem index={1}>
              <Section title="Triagem (Backlog)">
                <BacklogFunnel data={mockBacklogFunnel} />
              </Section>
            </FadeItem>
          </motion.div>

          <FadeItem>
            <Section title="Contexto de negócio">
              <AssetsTable rows={mockAssets} />
            </Section>
          </FadeItem>
        </TabsContent>

        {/* --------- TENDÊNCIAS --------- */}
        <TabsContent value="tendencias" className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-3"
          >
            <FadeItem index={0}>
              <Section title="SLA em risco (trend)">
                <SLATrendLine data={mockSLATrend} />
              </Section>
            </FadeItem>
            <FadeItem index={1}>
              <Section title="Cumulative Flow Diagram (CFD)">
                <CFDArea data={mockCFD} />
              </Section>
            </FadeItem>
          </motion.div>
        </TabsContent>

        {/* --------- EXPOSIÇÃO --------- */}
        <TabsContent value="exposicao" className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-3"
          >
            <FadeItem index={0}>
              <Section title="CVSS × EPSS (detalhado)">
                <CVSSxEPSSScatter data={mockScatter} />
              </Section>
            </FadeItem>
            <FadeItem index={1}>
              <Section title="Distribuição EPSS">
                <EPSSDonut data={mockEPSSDist} />
              </Section>
            </FadeItem>
            <FadeItem index={2}>
              <Section title="Hotspots por Vendor/Produto">
                <VendorBarHorizontal data={mockVendorBars} />
              </Section>
            </FadeItem>
          </motion.div>
        </TabsContent>

        {/* --------- OPERAÇÃO --------- */}
        <TabsContent value="operacao" className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-3"
          >
            <FadeItem index={0}>
              <Section title="Aging dos cards">
                <AgingHistogram data={mockAging} />
              </Section>
            </FadeItem>
            <FadeItem index={1}>
              <Section title="SLA em risco (trend)">
                <SLATrendLine data={mockSLATrend} />
              </Section>
            </FadeItem>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* --- CSS override só para reduzir altura desses dois charts quando envolvermos com .chart-sm --- */}
      <style jsx global>{`
        /* RiskOverTimeArea usa ChartContainer com min-h-[300px]; encolhemos quando parent tem .chart-sm */
        .chart-sm .min-h-\\[300px\\] {
          min-height: 220px !important;
        }
        /* PrioritySeverityMatrix usa min-h-[280px]; encolhemos também */
        .chart-sm .min-h-\\[280px\\] {
          min-height: 220px !important;
        }
      `}</style>
    </div>
  )
}
