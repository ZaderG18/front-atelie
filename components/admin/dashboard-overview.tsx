"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, ShoppingBag, AlertCircle, PackageX, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface DashboardProps {
  data: {
    faturamentoDia: number
    pedidosDia: number
    pedidosPendentes: number
    estoqueBaixo: {
        id: number
        name: string
        current: number
        min: number
        unit: string
    }[]
  }
}

export function DashboardOverview({ data }: DashboardProps) {
  if (!data) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      {/* --- CARDS SUPERIORES --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Faturamento Hoje */}
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Faturamento Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(data.faturamentoDia)}
            </div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-500">
              Entradas registradas hoje
            </p>
          </CardContent>
        </Card>

        {/* Pedidos Hoje */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pedidosDia}</div>
            <p className="text-xs text-muted-foreground">
              Novos pedidos criados
            </p>
          </CardContent>
        </Card>

        {/* Pendentes (Atenção) */}
        <Card className={`${data.pedidosPendentes > 0 ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Aguardando Atenção
            </CardTitle>
            <AlertCircle className={`h-4 w-4 ${data.pedidosPendentes > 0 ? "text-amber-600 animate-pulse" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">{data.pedidosPendentes}</div>
            <p className="text-xs text-amber-700/80 dark:text-amber-500">
              Pedidos com status 'Pendente'
            </p>
          </CardContent>
        </Card>

        {/* Alerta Estoque */}
        <Card className={`${data.estoqueBaixo.length > 0 ? "border-rose-200 bg-rose-50 dark:bg-rose-950/20" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-400">Alerta de Estoque</CardTitle>
            <PackageX className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-800 dark:text-rose-300">{data.estoqueBaixo.length}</div>
            <p className="text-xs text-rose-700/80 dark:text-rose-500">
              Ingredientes acabando
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- LISTA DE ALERTAS E AÇÕES --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Lista de Alertas de Estoque */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Reposição Necessária</CardTitle>
            <CardDescription>
              Ingredientes que atingiram o estoque mínimo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.estoqueBaixo.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                    <p className="text-sm">Tudo certo! Nenhum ingrediente em falta.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.estoqueBaixo.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/50 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-slate-500">Mínimo: {item.min} {item.unit}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-rose-600 text-sm">{item.current} {item.unit}</p>
                                <p className="text-[10px] text-rose-400">Atual</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card className="col-span-3 bg-slate-900 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white">Acesso Rápido</CardTitle>
            <CardDescription className="text-slate-400">O que você deseja fazer agora?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/pedidos/novo" className="block">
                <Button variant="secondary" className="w-full justify-between group">
                    Novo Pedido
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </Link>
            <Link href="/admin/financeiro" className="block">
                <Button variant="outline" className="w-full justify-between border-slate-700 hover:bg-slate-800 hover:text-white group">
                    Lançar Despesa
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </Link>
            <Link href="/admin/pedidos" className="block">
                <Button variant="outline" className="w-full justify-between border-slate-700 hover:bg-slate-800 hover:text-white group">
                    Ver Pedidos Pendentes
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}