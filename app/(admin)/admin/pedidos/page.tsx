import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { PedidosTable } from "@/components/admin/pedidos-table"
import { getOrders, updateOrderStatus } from "@/app/_actions/orders"
import { redirect } from "next/navigation"

// 1. Importamos o OrderStatus para comparar corretamente
import { Order, OrderStatus } from "@prisma/client" 

export const dynamic = 'force-dynamic'

export default async function PedidosPage() {
  // 1. Busca os dados brutos
  const pedidos = await getOrders()

  // 2. CORREÇÃO: Usamos o Enum (OrderStatus.PENDING) ou a string Maiúscula ("PENDING")
  const pendingCount = pedidos.filter((p) => p.status === OrderStatus.PENDING).length
  const confirmedCount = pedidos.filter((p) => p.status === OrderStatus.CONFIRMED).length
  const deliveredCount = pedidos.filter((p) => p.status === OrderStatus.DELIVERED).length

  // 3. Formatação (ADAPTER: Banco Novo -> Frontend Antigo)
  // O banco agora retorna camelCase (totalAmount), mas sua tabela espera snake_case (total_amount)
  const formattedOrders = pedidos.map((order) => ({
    id: order.id,
    
    // Mapeando campos novos para nomes antigos para a tabela não quebrar
    customer_name: order.customerName, 
    total_amount: Number(order.totalAmount).toFixed(2), // Garante string formatada
    status: order.status,
    origin: order.origin,
    created_at: order.createdAt.toISOString(),
    
    items: order.items.map((item) => ({
      // Ajuste os nomes aqui também se necessário
      id: item.id,
      product_name: item.productName,
      quantity: item.quantity,
      price: Number(item.unitPrice), // O novo banco chama de unitPrice
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

            {/* Tabela recebendo os dados formatados */}
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