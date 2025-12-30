import { prisma } from "@/lib/prisma"
import { InsumosView } from "@/components/admin/insumos-view"

export const dynamic = 'force-dynamic'

export default async function InsumosPage() {
  // 1. Busca do Banco
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  })

  // 2. Formata para o Front (CORRIGIDO: Nomes das colunas camelCase)
  const formattedInsumos = ingredients.map((item) => ({
    id: item.id.toString(),
    nome: item.name,
    unidade: item.unit,
    
    // --- CORREÇÃO AQUI ---
    // Usar costPrice em vez de cost_price
    custoUnitario: Number(item.costPrice),
    
    // Usar stockQuantity em vez de stock_quantity
    estoqueAtual: Number(item.stockQuantity),
    
    // Usar minStockAlert em vez de min_stock_alert
    estoqueMinimo: Number(item.minStockAlert),
    
    status: Number(item.stockQuantity) < Number(item.minStockAlert) 
      ? "critico" 
      : "em_estoque",
  }))

  // 3. Renderiza o Cliente
  // @ts-ignore
  return <InsumosView initialInsumos={formattedInsumos} />
}