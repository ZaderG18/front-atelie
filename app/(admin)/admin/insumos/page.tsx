import { prisma } from "@/lib/prisma"
import { InsumosView } from "@/components/admin/insumos-view"

export const dynamic = 'force-dynamic'

export default async function InsumosPage() {
  // 1. Busca do Banco
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  })

  // 2. Formata para o Front (Converte Decimal e calcula status)
  const formattedInsumos = ingredients.map((item: string | any) => ({
    id: item.id.toString(),
    nome: item.name,
    unidade: item.unit,
    custoUnitario: Number(item.cost_price),
    estoqueAtual: Number(item.stock_quantity),
    estoqueMinimo: Number(item.min_stock_alert),
    // Lógica de Status calculada no servidor
    status: Number(item.stock_quantity) < Number(item.min_stock_alert) 
      ? "critico" 
      : "em_estoque",
  }))

  // 3. Renderiza o Cliente com os dados iniciais
  // @ts-ignore: Ignorando erro de tipagem estrita do Insumo por enquanto
  return <InsumosView initialInsumos={formattedInsumos} />
}