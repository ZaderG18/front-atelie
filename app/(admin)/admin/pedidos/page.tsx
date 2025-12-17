import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { PedidosTable } from "@/components/admin/pedidos-table"
import { getOrders, updateOrderStatus } from "@/app/_actions/orders"
import { getStoreSettings } from "@/app/_actions/settings"
import { redirect } from "next/navigation"
import { OrderStatus } from "@prisma/client"

export const dynamic = 'force-dynamic'

export default async function PedidosPage() {
  const [pedidos, settings] = await Promise.all([
    getOrders(),
    getStoreSettings()
  ])

  const stats = pedidos.reduce((acc, curr) => {
    if (curr.status === OrderStatus.PENDING) acc.pending++
    if (curr.status === OrderStatus.CONFIRMED) acc.confirmed++
    if (curr.status === OrderStatus.DELIVERED) acc.delivered++
    return acc
  }, { pending: 0, confirmed: 0, delivered: 0 })

  // --- CORREÇÃO AQUI ---
  const formattedOrders = pedidos.map((order) => ({
    ...order, 
    
    // 1. CONVERSÃO OBRIGATÓRIA DE DECIMAIS DO PRISMA
    // O erro estava aqui: deliveryFee vinha como Decimal
    deliveryFee: Number(order.deliveryFee || 0),
    totalAmount: Number(order.totalAmount), // Convertemos o original também para garantir
    
    // 2. Campos formatados para a Tabela (snake_case)
    id: order.id,
    customer_name: order.customerName, 
    total_amount: Number(order.totalAmount),
    status: order.status,
    origin: order.origin,
    created_at: new Date(order.createdAt).toISOString(),
    
    items: order.items.map((item) => ({
      ...item,
      product_name: item.productName,
      quantity: item.quantity,
      price: Number(item.unitPrice),
      // Garantimos números nos itens também
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice)
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
                settings={settings} 
            />
          </div>
        </main>
      </div>
    </div>
  )
}