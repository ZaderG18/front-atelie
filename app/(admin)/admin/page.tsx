"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle" 
import {
  Package, ShoppingBag, AlertTriangle, DollarSign, Clock,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, ChefHat, Eye
} from "lucide-react"
import Link from "next/link"

// Função auxiliar para formatar data
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })
}

function getStatusConfig(status: string) {
  switch (status) {
    case "pending": return { label: "Pendente", icon: Clock, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" }
    case "confirmed": return { label: "Confirmado", icon: CheckCircle2, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" }
    case "delivered": return { label: "Entregue", icon: CheckCircle2, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }
    case "canceled": return { label: "Cancelado", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }
    default: return { label: status, icon: Clock, className: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400" }
  }
}

export default function AdminDashboard() {
  // Estado inicial zerado
  const [stats, setStats] = useState({
    faturamentoMes: 0,
    faturamentoVariacao: 0,
    ticketMedio: 0,
    pedidosHoje: 0,
    pedidosPendentes: 0,
    totalProdutos: 0,
    produtosAtivos: 0,
    totalInsumos: 0,
    insumosBaixoEstoque: 0,
    recentOrders: [], // Array de pedidos
    listaInsumosCriticos: [] // Array de insumos
  })

  // BUSCA DADOS REAIS DO CONTROLLER NOVO
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/dashboard/stats")
        const data = await response.json()
        setStats(data) // O Laravel já entrega tudo pronto!
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Dashboard" actionLabel="Ver Loja" onAction={() => window.open("/", "_blank")} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Métricas Principais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Card Faturamento */}
            <Card className="border-l-4 border-l-emerald-500 bg-white dark:bg-slate-900 dark:border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Faturamento do Mês</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.faturamentoMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+{stats.faturamentoVariacao}%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            {/* Card Pedidos */}
            <Card className="border-l-4 border-l-blue-500 bg-white dark:bg-slate-900 dark:border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Pedidos Hoje</CardTitle>
                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pedidosHoje}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                    {stats.pedidosPendentes} pendentes
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card Produtos */}
            <Card className="border-l-4 border-l-purple-500 bg-white dark:bg-slate-900 dark:border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Produtos na Vitrine</CardTitle>
                <ChefHat className="h-4 w-4 text-purple-600 dark:text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.produtosAtivos}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stats.totalProdutos} cadastrados no total</p>
              </CardContent>
            </Card>

            {/* Card Alerta Estoque */}
            <Card className={`border-l-4 bg-white dark:bg-slate-900 dark:border-none ${stats.insumosBaixoEstoque > 0 ? "border-l-red-500 dark:bg-red-950/10" : "border-l-slate-300"}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Estoque Crítico</CardTitle>
                <AlertTriangle className={`h-4 w-4 ${stats.insumosBaixoEstoque > 0 ? "text-red-600 dark:text-red-500" : "text-slate-400"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.insumosBaixoEstoque > 0 ? "text-red-600 dark:text-red-500" : "text-slate-900 dark:text-white"}`}>
                  {stats.insumosBaixoEstoque}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">itens precisando reposição</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-6 lg:grid-cols-3">
            
            {/* Tabela de Pedidos Recentes (AGORA DINÂMICA) */}
            <Card className="lg:col-span-2 bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">Pedidos Recentes</CardTitle>
                  <CardDescription className="dark:text-slate-400">Últimos pedidos recebidos</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
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
                        <div key={pedido.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-800 dark:text-slate-200">#{pedido.id}</span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">{pedido.customer_name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                                {formatDate(pedido.created_at)}
                            </span>
                            <Badge className={statusConfig.className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 min-w-[80px] text-right">
                              {Number(pedido.total_amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center text-slate-500 py-4">Nenhum pedido encontrado.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Insumos Críticos (DINÂMICO) */}
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">Insumos Críticos</CardTitle>
                  <CardDescription className="dark:text-slate-400">Estoque abaixo do mínimo</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                  <Link href="/admin/insumos"><Package className="mr-1 h-3 w-3" /> Gerenciar</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {stats.listaInsumosCriticos && stats.listaInsumosCriticos.length > 0 ? (
                  <div className="space-y-4">
                    {stats.listaInsumosCriticos.map((insumo: any) => {
                      const porcentagem = (Number(insumo.stock_quantity) / Number(insumo.min_stock_alert)) * 100
                      return (
                        <div key={insumo.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{insumo.name}</span>
                            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                              {insumo.stock_quantity} / {insumo.min_stock_alert} {insumo.unit}
                            </span>
                          </div>
                          <Progress value={porcentagem > 100 ? 100 : porcentagem} className="h-2 bg-red-100 dark:bg-red-900/30" />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                    <p>Estoque em dia! 🎉</p>
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