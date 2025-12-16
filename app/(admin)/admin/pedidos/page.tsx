import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { PedidosTable } from "@/components/admin/pedidos-table"
import { getOrders, updateOrderStatus } from "@/app/_actions/orders"
import { redirect } from "next/navigation"
import { OrderStatus } from "@prisma/client"

export const dynamic = 'force-dynamic'

export default async function PedidosPage() {
  // 1. Busca os dados
  const pedidos = await getOrders()

  // 2. OTIMIZAÇÃO: Calcula todas as contagens em uma única passada (loop)
  const stats = pedidos.reduce((acc, curr) => {
    if (curr.status === OrderStatus.PENDING) acc.pending++
    if (curr.status === OrderStatus.CONFIRMED) acc.confirmed++
    if (curr.status === OrderStatus.DELIVERED) acc.delivered++
    return acc
  }, { pending: 0, confirmed: 0, delivered: 0 })

  // 3. Formatação
  const formattedOrders = pedidos.map((order) => ({
    id: order.id,
    customer_name: order.customerName, 
    // Se getOrders já devolve number, só formata a string
    total_amount: Number(order.totalAmount).toFixed(2), 
    status: order.status,
    origin: order.origin,
    created_at: new Date(order.createdAt).toISOString(), // Garante que é Date antes de toISOString
    items: order.items.map((item) => ({
      id: item.id,
      product_name: item.productName,
      quantity: item.quantity,
      price: Number(item.unitPrice),
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
            {/* Cards de contagem usando a variável 'stats' otimizada */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Pendentes</span>
                  <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Confirmados</span>
                  <span className="text-2xl font-bold text-blue-600">{stats.confirmed}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Entregues</span>
                  <span className="text-2xl font-bold text-green-600">{stats.delivered}</span>
                </div>
              </div>
            </div>

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