// app/_actions/products.ts
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveProduct(formData: FormData) {
  try {
    const id = formData.get("id") as string | null
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const sale_price = formData.get("sale_price") as string
    const category = formData.get("category") as string
    const is_made_to_order = formData.get("is_made_to_order") === "1"
    const is_active = formData.get("is_active") === "1"
    
    // LOGICA DE IMAGEM:
    // Aqui você integraria com Supabase Storage ou Vercel Blob.
    // Por enquanto, vamos manter a URL antiga se não houver nova imagem, 
    // ou usar um placeholder se for criação.
    const image_url = "/placeholder-cake.jpg" 

    const data = {
      name,
      description,
      sale_price: parseFloat(sale_price),
      category,
      is_made_to_order,
      is_active,
      // Se tivéssemos upload real, a URL viria daqui
      image_url: image_url 
    }

    if (id) {
      // ATUALIZAR
      await prisma.product.update({
        where: { id: Number(id) },
        data: data, // Nota: Em um sistema real, só atualizamos a imagem se o usuário enviou uma nova
      })
    } else {
      // CRIAR
      await prisma.product.create({
        data: data,
      })
    }

    revalidatePath("/admin/produtos")
    revalidatePath("/admin") // Atualiza dashboard
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar produto:", error)
    return { success: false, error: "Erro ao salvar no banco" }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    })
    revalidatePath("/admin/produtos")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Erro ao deletar" }
  }
}

export async function toggleProductVisibility(id: string, currentStatus: boolean) {
    try {
        await prisma.product.update({
            where: { id: Number(id) },
            data: { is_active: !currentStatus }
        })
        revalidatePath("/admin/produtos")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Erro ao atualizar status" }
    }
}