import { prisma } from "@/lib/prisma"
import { ProdutosView } from "@/components/admin/produtos-view"

export const dynamic = 'force-dynamic'

export default async function ProdutosPage() {
  // 1. Busca produtos no banco
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  })

  // 2. Mapeia para o formato que o Front espera (Produto)
  const formattedProducts = products.map((item: string | any) => ({
    id: item.id.toString(),
    nome: item.name,
    descricao: item.description || "",
    preco: Number(item.sale_price),
    categoria: item.category,
    imagem: item.image_url || "/placeholder.jpg",
    sobEncomenda: Boolean(item.is_made_to_order),
    visivelVitrine: Boolean(item.is_active), 
  }))

  // 3. Renderiza a View
  return <ProdutosView initialProdutos={formattedProducts} />
}