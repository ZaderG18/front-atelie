// app/_actions/get-products.ts
'use server'

import { prisma } from "@/lib/prisma"

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' }
    })

    // Converte os dados do banco para o formato do Frontend
    return products.map(p => ({
      id: p.id.toString(),
      name: p.name,
      description: p.description || "",
      image: p.image_url || "/placeholder.jpg",
      basePrice: Number(p.sale_price), // Converte Decimal para Number
      status: p.is_made_to_order ? 'sob-encomenda' : 'pronta-entrega',
      category: p.category.replace('_', '-'), // Converte bolos_festivos -> bolos-festivos
      // Campos que ainda não temos no banco, enviamos padrão:
      weights: [{ label: "Padrão", priceModifier: 0 }],
      flavors: ["Padrão"],
      additionals: []
    }))
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }
}