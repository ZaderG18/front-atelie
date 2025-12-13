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
    // CORREÇÃO: Mapeando para os nomes em camelCase do novo Schema
    const payload = {
      name: data.nome,
      unit: data.unidade,
      costPrice: data.custoUnitario,       // Antes: cost_price
      stockQuantity: data.estoqueAtual,    // Antes: stock_quantity
      minStockAlert: data.estoqueMinimo,   // Antes: min_stock_alert
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
    revalidatePath("/admin") // Atualiza o dashboard também (avisos de estoque)
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar ingrediente:", error)
    return { success: false, error: "Erro ao salvar no banco de dados" }
  }
}

export async function deleteIngredient(id: string) {
  try {
    await prisma.ingredient.delete({
      where: { id: Number(id) },
    })
    
    revalidatePath("/admin/insumos")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar:", error)
    return { success: false, error: "Erro ao deletar" }
  }
}