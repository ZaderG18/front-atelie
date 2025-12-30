import { prisma } from "@/lib/prisma"
import { AdminHeader } from "@/components/admin/admin-header"
import { NovoPedidoForm } from "@/components/admin/novo-pedido-form"

// Garante dados frescos (evita cache de produtos antigos)
export const dynamic = 'force-dynamic'

export default async function NovoPedidoPage() {
  // 1. Busca produtos direto do banco
  const products = await prisma.product.findMany({
    where: { isActive: true }, 
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      basePrice: true 
    }
  })

  // 2. Mapeamento para o formato simples que o select precisa
  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.basePrice) 
  }))

  return (
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Novo Pedido (Manual)" />
        
        <main className="flex-1 overflow-y-auto p-6">
           <NovoPedidoForm products={formattedProducts} />
        </main>
      </div>
  )
}