// app/(locale)/(private)/dashboard/lib/format.ts
export const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n)
export const pct = (n: number) => `${(n * 100).toFixed(0)}%`
