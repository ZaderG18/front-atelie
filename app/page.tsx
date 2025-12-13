import { prisma } from "@/lib/prisma"
import { StoreFront } from "@/components/store-front"

export const dynamic = 'force-dynamic'

export default async function Home() {
  // 1. Busca produtos no Banco de Dados
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true }, // CORRIGIDO: is_active -> isActive
    include: { category: true }, // NOVO: Precisamos incluir a tabela de categoria
    orderBy: { name: 'asc' }     // Ordenar por nome (ou category: { name: 'asc' })
  })

  // 2. Mapeia e preenche os campos
  const formattedProducts = dbProducts.map(p => ({
    id: p.id.toString(),
    name: p.name,
    description: p.description || "",
    
    // CORRIGIDO: Pega o nome da relação ou usa um padrão
    category: p.category?.name || "Geral", 
    
    // CORRIGIDO: image_url -> imageUrl
    image: p.imageUrl || "/placeholder-cake.jpg", 
    
    // CORRIGIDO: is_made_to_order -> isMadeToOrder
    isMadeToOrder: p.isMadeToOrder, 
    
    // --- Campos de Preço (sale_price -> basePrice) ---
    price: Number(p.basePrice), 
    basePrice: Number(p.basePrice), 

    // --- Campos Complexos (Mantemos vazios por enquanto) ---
    status: "available",
    weights: [],        
    flavors: [],        
    additionals: []     
  }))

  // 3. Renderiza o componente Cliente
  // @ts-ignore: Ignora divergências menores de tipagem temporariamente
  return <StoreFront initialProducts={formattedProducts} />
}