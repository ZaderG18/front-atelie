"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { API_URL } from "@/lib/api-config"
import { formatCurrency } from "@/lib/utils" // Usando nossa função centralizada
import {
  Package, ShoppingCart, AlertTriangle, DollarSign, Clock, CheckCircle2,
  XCircle, ArrowUpRight, ChefHat, TrendingUp, Calendar, Zap, PlusCircle, ClipboardList
} from "lucide-react"
import Link from "next/link"

// Tipagem para garantir que o Front entenda o que vem do Back
interface DashboardStats {
  faturamentoMes: number
  faturamentoVariacao: number
  ticketMedio: number
  pedidosHoje: number
  pedidosPendentes: number
  totalProdutos: number
  produtosAtivos: number
  totalInsumos: number
  insumosBaixoEstoque: number
  recentOrders: any[]
  listaInsumosCriticos: any[]
}

// Estado inicial zerado (sem mocks para não confundir)
const INITIAL_STATS: DashboardStats = {
  faturamentoMes: 0,
  faturamentoVariacao: 0,
  ticketMedio: 0,
  pedidosHoje: 0,
  pedidosPendentes: 0,
  totalProdutos: 0,
  produtosAtivos: 0,
  totalInsumos: 0,
  insumosBaixoEstoque: 0,
  recentOrders: [],
  listaInsumosCriticos: [],
}

function getStatusConfig(status: string) {
  switch (status) {
    case "pending": return { label: "Pendente", icon: Clock, className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" }
    case "confirmed": return { label: "Confirmado", icon: CheckCircle2, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800" }
    case "delivered": return { label: "Entregue", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" }
    case "canceled": return { label: "Cancelado", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" }
    default: return { label: status, icon: Clock, className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" }
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard/stats`)
        if (!response.ok) throw new Error("Falha ao buscar dados")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Erro no dashboard:", error)
        // Opcional: Adicionar um toast de erro aqui
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-slate-500">Carregando indicadores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      <AdminSidebar activeItem="dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Dashboard" subtitle="Bem-vindo de volta! Aqui está o resumo do seu negócio." />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Saudação e Data */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Olá, Confeiteira! <span className="text-2xl">👋</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>

          {/* Cards de Métricas */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Faturamento */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-100">Faturamento do Mês</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg"><DollarSign className="h-4 w-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(Number(stats.faturamentoMes))}</div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+{stats.faturamentoVariacao}%</span>
                  </div>
                  <span className="text-xs text-emerald-100">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            {/* Pedidos Hoje */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Pedidos Hoje</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg"><ShoppingCart className="h-4 w-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pedidosHoje}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-amber-400 text-amber-900 border-0 text-xs font-semibold hover:bg-amber-500">
                    {stats.pedidosPendentes} pendentes
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Médio */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-600 border-0 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-violet-100">Ticket Médio</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg"><TrendingUp className="h-4 w-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(Number(stats.ticketMedio))}</div>
                <p className="text-xs text-violet-100 mt-2">{stats.produtosAtivos} produtos ativos</p>
              </CardContent>
            </Card>

            {/* Alerta Estoque */}
            <Card className={`relative overflow-hidden border-0 text-white shadow-lg ${stats.insumosBaixoEstoque > 0 ? "bg-gradient-to-br from-rose-500 to-rose-600" : "bg-gradient-to-br from-slate-500 to-slate-600"}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Estoque Crítico</CardTitle>
                <div className={`p-2 rounded-lg ${stats.insumosBaixoEstoque > 0 ? "bg-white/20" : "bg-white/10"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.insumosBaixoEstoque}</div>
                <p className="text-xs opacity-90 mt-2">itens precisando reposição</p>
              </CardContent>
            </Card>
          </div>

          {/* Atalhos Rápidos (Mantive igual ao seu código) */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/admin/pedidos/novo">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-400">
                    <PlusCircle className="w-6 h-6" />
                    <span className="text-sm font-medium">Novo Pedido</span>
                  </Button>
                </Link>
                <Link href="/admin/pedidos">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                    <ClipboardList className="w-6 h-6" />
                    <span className="text-sm font-medium">Ver Pedidos</span>
                  </Button>
                </Link>
                <Link href="/admin/insumos">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                    <Package className="w-6 h-6" />
                    <span className="text-sm font-medium">Estoque</span>
                  </Button>
                </Link>
                <Link href="/admin/produtos">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-950/50 text-violet-700 dark:text-violet-400">
                    <ChefHat className="w-6 h-6" />
                    <span className="text-sm font-medium">Cardápio</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pedidos Recentes */}
            <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">Pedidos Recentes</CardTitle>
                  <CardDescription className="dark:text-slate-400">Últimos pedidos recebidos</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Link href="/admin/pedidos">Ver todos</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((pedido: any) => {
                      const statusConfig = getStatusConfig(pedido.status)
                      const StatusIcon = statusConfig.icon
                      return (
                        <div key={pedido.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-slate-100 dark:border-slate-700/50 group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-sm group-hover:scale-110 transition-transform">
                              {pedido.customer_name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                #{pedido.id} - {pedido.customer_name}
                              </span>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={`${statusConfig.className} border hidden sm:flex`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            <span className="font-bold text-slate-800 dark:text-slate-200 min-w-[90px] text-right">
                              {formatCurrency(Number(pedido.total_amount))}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhum pedido encontrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Insumos Críticos */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">Estoque Crítico</CardTitle>
                  <CardDescription className="dark:text-slate-400">Itens abaixo do mínimo</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Link href="/admin/insumos">Ver</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {stats.listaInsumosCriticos && stats.listaInsumosCriticos.length > 0 ? (
                  <div className="space-y-4">
                    {stats.listaInsumosCriticos.map((insumo: any) => {
                      const porcentagem = (Number(insumo.stock_quantity) / Number(insumo.min_stock_alert)) * 100
                      return (
                        <div key={insumo.id} className="space-y-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{insumo.name}</span>
                            <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                              {insumo.stock_quantity}/{insumo.min_stock_alert} {insumo.unit}
                            </span>
                          </div>
                          <Progress value={porcentagem > 100 ? 100 : porcentagem} className="h-2 bg-red-200 dark:bg-red-900/50" />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                    <p className="font-medium text-emerald-600 dark:text-emerald-400">Estoque em dia!</p>
                    <p className="text-sm">Todos os itens estão OK</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
