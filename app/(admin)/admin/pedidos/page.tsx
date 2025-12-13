"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { PedidosTable } from "@/components/admin/pedidos-table"
import { getOrders } from "@/app/_actions/orders"

export default async function PedidosPage() {
  const pedidos = await getOrders()

  const pendingCount = pedidos.filter((p) => p.status === "pending").length
  const confirmedCount = pedidos.filter((p) => p.status === "confirmed").length
  const deliveredCount = pedidos.filter((p) => p.status === "delivered").length

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="pedidos" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Gerenciar Pedidos" actionLabel="Novo Pedido (Manual)" actionLink="/admin/pedidos/novo" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Pendentes</span>
                  <span className="text-2xl font-bold text-yellow-600">{pendingCount}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Confirmados</span>
                  <span className="text-2xl font-bold text-blue-600">{confirmedCount}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Entregues</span>
                  <span className="text-2xl font-bold text-green-600">{deliveredCount}</span>
                </div>
              </div>
            </div>

            <PedidosTable pedidos={pedidos} />
          </div>
        </main>
      </div>
    </div>
  )
}
