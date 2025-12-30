import { prisma } from "@/lib/prisma"
import { StoreFront } from "@/components/store-front"
import { getStoreSettings } from "@/app/_actions/settings"
import type { Product, Category } from "@/lib/types"

export const dynamic = 'force-dynamic'

export default async function Home() {
  // 1. Busca produtos e configurações em paralelo
  const [dbProducts, settings] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { name: 'asc' }
    }),
    getStoreSettings()
  ])

  // 2. Mapeia produtos para o formato da vitrine
  const formattedProducts: Product[] = dbProducts.map(p => {
    // Normaliza a categoria (Ex: "Bolos Festivos" -> "bolos-festivos")
    // Se não bater com nada, cai em "outros" para não quebrar a tela
    const slugCategory = p.category?.name
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") as Category || "outros"

    return {
      id: p.id.toString(),
      name: p.name,
      description: p.description || "",
      category: slugCategory, // Agora bate com o tipo Category
      image: p.imageUrl || "/placeholder-cake.jpg",
      basePrice: Number(p.basePrice),
      // Campos obrigatórios que faltavam ou estavam errados
      status: p.isMadeToOrder ? "sob-encomenda" : "pronta-entrega",
      weights: [], // Implementar se tiver no banco futuramente
      flavors: [], // Implementar se tiver no banco futuramente
      additionals: [] // Implementar se tiver no banco futuramente
    }
  })

  // 3. Passa para o componente
  return (
    <StoreFront 
      initialProducts={formattedProducts} 
      settings={settings} 
    />
  )
}