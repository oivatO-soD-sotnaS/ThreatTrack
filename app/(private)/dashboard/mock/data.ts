// app/(locale)/(private)/dashboard/mock/data.ts

export const mockKPIs = {
  kanbanOpen: 48,
  backlogTriage: 132,
  withKEV: 17,
  slaBreaches: 9,
  riskIndex: 0.63,
}

export const mockScatter = [
  {
    id: "c1",
    cvss: 9.8,
    epss: 0.74,
    kev: true,
    affected: 2,
    title: "OpenSSL 3.0.13 RCE",
  },
  {
    id: "c2",
    cvss: 7.5,
    epss: 0.81,
    kev: false,
    affected: 4,
    title: "libXYZ deserialização",
  },
  {
    id: "c3",
    cvss: 6.8,
    epss: 0.12,
    kev: false,
    affected: 1,
    title: "XSS painel interno",
  },
  {
    id: "c4",
    cvss: 8.2,
    epss: 0.59,
    kev: false,
    affected: 3,
    title: "Container base vulnerável",
  },
  {
    id: "c5",
    cvss: 9.1,
    epss: 0.91,
    kev: true,
    affected: 5,
    title: "Kernel escalation",
  },
]

export const mockEPSSDist = [
  { bucket: "≥ 0.90", value: 8 },
  { bucket: "0.70–0.89", value: 14 },
  { bucket: "0.40–0.69", value: 21 },
  { bucket: "0.10–0.39", value: 32 },
  { bucket: "< 0.10", value: 57 },
]

export const mockVendorBars = [
  { vendor: "OpenSSL", count: 7 },
  { vendor: "Apache", count: 5 },
  { vendor: "Microsoft", count: 5 },
  { vendor: "Linux Kernel", count: 4 },
  { vendor: "Docker", count: 3 },
]

export const mockTopPriority = [
  {
    id: "k14",
    title: "Mitigar RCE em lib XYZ (container base)",
    score: 0.91,
    level: "extrema",
    kev: false,
    internet: false,
    sla: "2025-09-05",
  },
  {
    id: "k05",
    title: "Atualizar OpenSSL 3.0.13 nos webfronts",
    score: 0.9,
    level: "extrema",
    kev: true,
    internet: true,
    sla: "2025-09-04",
  },
  {
    id: "k22",
    title: "Pinar dependências Node no checkout",
    score: 0.78,
    level: "alta",
    kev: false,
    internet: false,
    sla: "2025-09-10",
  },
  {
    id: "k09",
    title: "Desativar SMBv1 em hosts legados",
    score: 0.74,
    level: "alta",
    kev: true,
    internet: false,
    sla: "2025-09-03",
  },
  {
    id: "k31",
    title: "Hardening de TLS nos gateways",
    score: 0.66,
    level: "moderada",
    kev: false,
    internet: true,
    sla: "2025-09-12",
  },
]

export const mockBacklogFunnel = {
  novo: 88,
  em_triagem: 34,
  promovidosSemana: 16,
  descartadosSemana: 9,
}

export const mockAssets = [
  {
    asset: "web-frontend-03",
    riskSum: 2.31,
    crit: 0.9,
    internet: true,
    cards: 4,
  },
  {
    asset: "checkout-api",
    riskSum: 1.94,
    crit: 0.82,
    internet: false,
    cards: 3,
  },
  {
    asset: "k8s-worker-02",
    riskSum: 1.47,
    crit: 0.76,
    internet: false,
    cards: 2,
  },
  {
    asset: "edge-gateway-01",
    riskSum: 1.4,
    crit: 0.88,
    internet: true,
    cards: 2,
  },
  { asset: "db-prod-02", riskSum: 1.33, crit: 0.91, internet: false, cards: 1 },
]

export const mockSLATrend = [
  { date: "08/01", breaches: 6 },
  { date: "08/08", breaches: 7 },
  { date: "08/15", breaches: 9 },
  { date: "08/22", breaches: 8 },
  { date: "08/29", breaches: 9 },
]

export const mockCFD = [
  { date: "08/01", planejado: 28, em_processo: 14, concluido: 10 },
  { date: "08/08", planejado: 26, em_processo: 18, concluido: 12 },
  { date: "08/15", planejado: 24, em_processo: 20, concluido: 14 },
  { date: "08/22", planejado: 22, em_processo: 22, concluido: 16 },
  { date: "08/29", planejado: 20, em_processo: 21, concluido: 19 },
]

// histogram/buckets
export const mockAging = [
  { bucket: "0–3d", backlog: 40, kanban: 12 },
  { bucket: "4–7d", backlog: 28, kanban: 16 },
  { bucket: "8–14d", backlog: 22, kanban: 11 },
  { bucket: "15–30d", backlog: 18, kanban: 6 },
  { bucket: "30d+", backlog: 14, kanban: 3 },
]

// matriz prioridade × severidade
export const mockPriSevMatrix = [
  { severity: "low", priority: "baixa", count: 12 },
  { severity: "medium", priority: "moderada", count: 19 },
  { severity: "high", priority: "alta", count: 17 },
  { severity: "critical", priority: "alta", count: 9 },
  { severity: "high", priority: "moderada", count: 11 },
  { severity: "critical", priority: "extrema", count: 5 },
]


// --- RISCO AO LONGO DO TEMPO (stacked + projeção) ---
export const mockRiskOverTime = [
  { date: "08/01", kev: 3.4, other: 4.8, proj: 6.8 },
  { date: "08/08", kev: 3.2, other: 4.8, proj: 6.6 },
  { date: "08/15", kev: 2.9, other: 4.7, proj: 6.3 },
  { date: "08/22", kev: 2.6, other: 4.5, proj: 6.0 },
  { date: "08/29", kev: 2.4, other: 4.4, proj: 5.7 },
  { date: "09/05", kev: 1.8, other: 4.3, proj: 5.1 }, // queda forte após resolver KEV
  { date: "09/12", kev: 1.5, other: 4.2, proj: 4.7 },
  { date: "09/19", kev: 1.2, other: 4.1, proj: 4.4 },
]

// --- GAUGE DO ÍNDICE DE RISCO ATUAL (0..100) ---
export const mockRiskGaugeValue = 63

// --- NOVOS × RESOLVIDOS (semanal) ---
export const mockResolvedVsNew = [
  { date: "08/01", novos: 22, resolvidos: 16 },
  { date: "08/08", novos: 24, resolvidos: 19 },
  { date: "08/15", novos: 21, resolvidos: 23 },
  { date: "08/22", novos: 18, resolvidos: 22 },
  { date: "08/29", novos: 20, resolvidos: 24 },
]

// --- RISCO AGREGADO POR TIME (stacked) ---
export const mockRiskByTeam = [
  { team: "Checkout", kev: 1.8, other: 1.1 },
  { team: "Auth",     kev: 0.9, other: 1.0 },
  { team: "Data",     kev: 0.6, other: 0.8 },
  { team: "Infra",    kev: 1.1, other: 0.9 },
]
