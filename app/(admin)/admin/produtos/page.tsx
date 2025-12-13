import { prisma } from "@/lib/prisma"
import { ProdutosView } from "@/components/admin/produtos-view"

export const dynamic = 'force-dynamic'

export default async function ProdutosPage() {
  // 1. Busca produtos no banco
  // Adicionamos 'include: { category: true }' para poder exibir o nome da categoria
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    include: {
      category: true
    }
  })

  // 2. Mapeia para o formato que a ProdutosView espera
  // A View espera: name, price, description, image, etc.
  const formattedProducts = products.map((item) => ({
    id: item.id,                         // Number (não use toString)
    name: item.name,                     // Antes: nome
    description: item.description || "", // Antes: descricao
    price: Number(item.basePrice),       // Antes: preco (e o campo no banco é basePrice)
    category: item.category?.name || "Geral", // Pega o nome da relação
    image: item.imageUrl || "/placeholder-cake.jpg", // Antes: imagem (banco é imageUrl)
    is_made_to_order: item.isMadeToOrder,// Antes: sobEncomenda
    isActive: item.isActive,             // Antes: visivelVitrine
  }))

  // 3. Renderiza a View
  return <ProdutosView initialProdutos={formattedProducts} />
}