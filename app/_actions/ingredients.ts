// app/_actions/ingredients.ts
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Define o tipo de entrada (input)
interface IngredientData {
  id?: string // Opcional, se vier é edição
  nome: string
  unidade: string
  custoUnitario: number
  estoqueAtual: number
  estoqueMinimo: number
}

export async function saveIngredient(data: IngredientData) {
  try {
    const payload = {
      name: data.nome,
      unit: data.unidade,
      cost_price: data.custoUnitario,
      stock_quantity: data.estoqueAtual,
      min_stock_alert: data.estoqueMinimo,
    }

    if (data.id) {
      // ATUALIZAR
      await prisma.ingredient.update({
        where: { id: Number(data.id) },
        data: payload,
      })
    } else {
      // CRIAR
      await prisma.ingredient.create({
        data: payload,
      })
    }

    revalidatePath("/admin/insumos")
    revalidatePath("/admin") // Atualiza o dashboard também
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar ingrediente:", error)
    return { success: false, error: "Erro no banco de dados" }
  }
}

export async function deleteIngredient(id: string) {
  try {
    await prisma.ingredient.delete({
      where: { id: Number(id) },
    })
    
    revalidatePath("/admin/insumos")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar:", error)
    return { success: false, error: "Erro ao deletar" }
  }
}