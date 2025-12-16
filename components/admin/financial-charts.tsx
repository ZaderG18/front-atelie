"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, PieChart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { FinancialHistory, FinancialCategory } from "@/lib/financial-types"

// CORES COMPARTILHADAS (DRY)
const FINANCIAL_COLORS = [
  "#f43f5e", // rose-500
  "#f59e0b", // amber-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#8b5cf6", // violet-500
]

interface BarChartProps {
  data: FinancialHistory[]
}

export function FinancialBarChart({ data }: BarChartProps) {
  // Calcula máximo para escala
  const max = Math.max(
    ...data.map(d => Math.max(d.faturamento, d.despesas)),
    100
  )

  return (
    <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Faturamento x Despesas
        </CardTitle>
        <CardDescription className="dark:text-slate-400">Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 sm:gap-4 h-64 w-full">
          {data.map((item) => (
            <div key={item.mes} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex gap-1 items-end h-48 justify-center">
                {/* Barra Entrada */}
                <div
                  className="w-3 sm:w-8 bg-emerald-500 rounded-t-md transition-all hover:bg-emerald-600 relative"
                  style={{ height: `${(item.faturamento / max) * 100}%` }}
                  title={`Faturamento: ${formatCurrency(item.faturamento)}`}
                />
                {/* Barra Saída */}
                <div
                  className="w-3 sm:w-8 bg-rose-500 rounded-t-md transition-all hover:bg-rose-600 relative"
                  style={{ height: `${(item.despesas / max) * 100}%` }}
                  title={`Despesas: ${formatCurrency(item.despesas)}`}
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">{item.mes}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface DonutChartProps {
  data: FinancialCategory[]
  total: number
}

export function FinancialDonutChart({ data, total }: DonutChartProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-violet-500" />
          Despesas por Categoria
        </CardTitle>
        <CardDescription className="dark:text-slate-400">Mês atual</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Gráfico SVG */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {data.length > 0 ? (
              data.reduce(
                (acc: any, item, index) => {
                  const offset = acc.offset
                  const strokeDasharray = `${item.porcentagem} ${100 - item.porcentagem}`
                  acc.elements.push(
                    <circle
                      key={item.categoria}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={FINANCIAL_COLORS[index % FINANCIAL_COLORS.length]}
                      strokeWidth="20"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={-offset}
                      className="transition-all duration-500 hover:stroke-width-22"
                    />
                  )
                  acc.offset += item.porcentagem
                  return acc
                },
                { elements: [], offset: 0 }
              ).elements
            ) : (
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="20" />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {formatCurrency(total)}
            </span>
            <span className="text-xs text-slate-500">Total</span>
          </div>
        </div>

        {/* Legenda */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item.categoria} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: FINANCIAL_COLORS[index % FINANCIAL_COLORS.length] }}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">{item.categoria}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800 dark:text-white">
                  {formatCurrency(item.valor)}
                </span>
                <span className="text-xs text-slate-400">({item.porcentagem}%)</span>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="text-center text-sm text-muted-foreground">Nenhuma despesa.</p>}
        </div>
      </CardContent>
    </Card>
  )
}