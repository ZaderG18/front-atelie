'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Mapa para converter o "slug" do formulário antigo para o Nome da Categoria no banco
const categoryMap: Record<string, string> = {
  "bolos_festivos": "Bolos Festivos",
  "bolos_no_pote": "Bolos de Pote",
  "docinhos": "Docinhos",
  "salgados": "Salgados",
  "bebidas": "Bebidas",
  "kits_festa": "Kits Festa"
}

export async function saveProduct(data: any) {
  try {
    // 1. Resolver a Categoria (String -> ID)
    // O formulário manda "bolos_festivos", precisamos achar o ID da categoria "Bolos Festivos"
    const categoryName = categoryMap[data.category] || data.category
    
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } }
    })

    // Se não achar a categoria, cria uma "Geral" ou usa a primeira que tiver para não dar erro
    if (!category) {
        category = await prisma.category.findFirst()
    }

    // 2. Montar o objeto para o Prisma (Snake_case -> CamelCase)
    const payload = {
      name: data.name,
      description: data.description,
      basePrice: Number(data.sale_price),      // CORREÇÃO: sale_price -> basePrice
      imageUrl: data.image_url,                // CORREÇÃO: image_url -> imageUrl
      isMadeToOrder: data.is_made_to_order,    // CORREÇÃO: is_made_to_order -> isMadeToOrder
      isActive: data.is_active !== false,      // Garante boleano
      categoryId: category?.id                 // Conecta a categoria pelo ID
    }

    if (data.id) {
      // Atualizar
      await prisma.product.update({
        where: { id: Number(data.id) },
        data: payload,
      })
    } else {
      // Criar
      await prisma.product.create({
        data: payload,
      })
    }

    revalidatePath("/admin/produtos")
    revalidatePath("/") // Atualiza a vitrine também
    return { success: true }

  } catch (error) {
    console.error("Erro ao salvar produto:", error)
    return { success: false, error: "Falha ao salvar produto no banco de dados." }
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id: Number(id) }
    })
    revalidatePath("/admin/produtos")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return { success: false, error: "Erro ao deletar produto." }
  }
}