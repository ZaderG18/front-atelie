import { prisma } from "@/lib/prisma"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { NovoPedidoForm } from "@/components/admin/novo-pedido-form"

// Remove o cache para sempre pegar produtos atualizados
export const dynamic = 'force-dynamic'

export default async function NovoPedidoPage() {
  // 1. Busca produtos direto do banco (Server-Side)
  const products = await prisma.product.findMany({
    where: { isActive: true }, // CORRIGIDO: is_active -> isActive
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      basePrice: true // CORRIGIDO: sale_price -> basePrice
    }
  })

  // 2. Mapeamento
  // Convertemos o Decimal do banco para Number do Javascript
  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.basePrice) // Vamos usar 'price' no front para facilitar
  }))

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="pedidos" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Novo Pedido (Manual)" />
        
        <main className="flex-1 overflow-y-auto p-6">
           <NovoPedidoForm products={formattedProducts} />
        </main>
      </div>
    </div>
  )
}