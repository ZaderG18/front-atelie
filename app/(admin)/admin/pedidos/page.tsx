import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { PedidosTable } from "@/components/admin/pedidos-table"
import { getOrders, updateOrderStatus } from "@/app/_actions/orders" // Importamos a action de update também
import { redirect } from "next/navigation"

// Importamos o tipo para o TypeScript parar de reclamar
import { Order } from "@prisma/client" 

export const dynamic = 'force-dynamic'

export default async function PedidosPage() {
  // 1. Busca os dados brutos
  const pedidos = await getOrders()

  // 2. CORREÇÃO DO ERRO TS(7006): Tipamos explicitamente 'p' como 'Order' ou 'any'
  // (Como removemos o 'use client', o TS muitas vezes já entende sozinho, mas aqui garantimos)
  const pendingCount = pedidos.filter((p: Order) => p.status === "pending").length
  const confirmedCount = pedidos.filter((p: Order) => p.status === "confirmed").length
  const deliveredCount = pedidos.filter((p: Order) => p.status === "delivered").length

  // 3. Formatação para a Tabela (Essencial para passar para Client Components)
  const formattedOrders = pedidos.map((order: string | any) => ({
    ...order,
    id: order.id,
    total_amount: order.total_amount.toString(), // Decimal -> String
    created_at: order.created_at.toISOString(),  // Date -> String
    items: order.items.map((item: string | any) => ({
      ...item,
      price: Number(item.price),
    })),
  }))

  async function goToNewOrder() {
    "use server"
    redirect("/admin/pedidos/novo")
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="pedidos" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
            title="Gerenciar Pedidos" 
            actionLabel="Novo Pedido (Manual)" 
            onAction={goToNewOrder} 
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Cards de contagem */}
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

            {/* Tabela recebendo os dados formatados e a função de update */}
            <PedidosTable 
                pedidos={formattedOrders} 
                onStatusChange={updateOrderStatus}
            />
          </div>
        </main>
      </div>
    </div>
  )
}