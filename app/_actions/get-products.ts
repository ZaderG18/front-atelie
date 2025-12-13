"use server"

import { prisma } from "@/lib/prisma"

export async function getProducts() {
  try {
    // 1. Busca do Banco de Dados Real
    const products = await prisma.product.findMany({
      where: { isActive: true },   // Apenas produtos ativos
      include: { category: true }, // Precisamos do nome da categoria
      orderBy: { name: 'asc' }
    })

    // 2. Mapeia os campos do Banco (camelCase) para o Front (que deve esperar snake_case ou nomes simples)
    return products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      
      // O front pode estar esperando 'price' ou 'sale_price', mandamos os dois por segurança
      price: Number(p.basePrice),
      sale_price: Number(p.basePrice),
      
      // Resolve o nome da categoria
      category: p.category?.name || "Geral",
      
      // Resolve a imagem
      image: p.imageUrl || "/placeholder-cake.jpg",
      
      is_made_to_order: p.isMadeToOrder
    }))

  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }
}