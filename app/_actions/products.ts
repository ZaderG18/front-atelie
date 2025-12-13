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

// 1. SALVAR (CRIAR/EDITAR)
export async function saveProduct(data: any) {
  try {
    // Resolver a Categoria (String -> ID)
    const categoryName = categoryMap[data.category] || data.category
    
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } }
    })

    if (!category) {
        category = await prisma.category.findFirst()
    }

    const payload = {
      name: data.name,
      description: data.description,
      basePrice: Number(data.sale_price),
      imageUrl: data.image_url,
      isMadeToOrder: data.is_made_to_order,
      isActive: data.is_active !== false,
      categoryId: category?.id
    }

    if (data.id) {
      await prisma.product.update({
        where: { id: Number(data.id) },
        data: payload,
      })
    } else {
      await prisma.product.create({
        data: payload,
      })
    }

    revalidatePath("/admin/produtos")
    revalidatePath("/")
    return { success: true }

  } catch (error) {
    console.error("Erro ao salvar produto:", error)
    return { success: false, error: "Falha ao salvar produto no banco de dados." }
  }
}

// 2. DELETAR
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

// 3. ALTERAR VISIBILIDADE (A função que faltava!)
export async function toggleProductVisibility(id: number, currentStatus: boolean) {
  try {
    await prisma.product.update({
      where: { id: Number(id) },
      data: { isActive: !currentStatus }
    })
    
    revalidatePath("/admin/produtos")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao alterar visibilidade:", error)
    return { success: false, error: "Erro ao atualizar status." }
  }
}