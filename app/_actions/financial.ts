'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { TransactionType } from "@prisma/client"

// 1. Criar Lançamento
export async function createTransaction(data: any) {
  try {
    await prisma.transaction.create({
      data: {
        description: data.descricao,
        amount: data.valor, // O Prisma lida com a conversão se passar number/string
        type: data.tipo === "entrada" ? TransactionType.ENTRADA : TransactionType.SAIDA,
        category: data.categoria,
        date: new Date(data.data), // Importante converter string "YYYY-MM-DD" para Date
      }
    })
    revalidatePath("/admin/financeiro")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar transação:", error)
    return { success: false, error: "Erro ao salvar." }
  }
}

// 2. Buscar Dados do Dashboard
export async function getFinancialDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Busca transações do mês atual
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    },
    orderBy: { date: 'desc' }
  })

  // Cálculos Básicos
  let entrada = 0
  let saida = 0

  transactions.forEach(t => {
    if (t.type === "ENTRADA") entrada += Number(t.amount)
    else saida += Number(t.amount)
  })

  const lucro = entrada - saida

  // Agrupamento por Categoria (Para o Gráfico de Rosca)
  const categoryMap = new Map<string, number>()
  transactions.filter(t => t.type === 'SAIDA').forEach(t => {
    const current = categoryMap.get(t.category) || 0
    categoryMap.set(t.category, current + Number(t.amount))
  })

  const categorias = Array.from(categoryMap.entries()).map(([categoria, valor]) => ({
    categoria,
    valor,
    porcentagem: Math.round((valor / (saida || 1)) * 100), // Evita divisão por zero
    cor: "bg-blue-500" // Você pode criar uma função para atribuir cores aleatórias
  })).sort((a, b) => b.valor - a.valor) // Ordena do maior para o menor

  return {
    resumo: {
      faturamento: entrada,
      despesas: saida,
      lucro: lucro
    },
    lancamentos: transactions.map(t => ({
      id: t.id,
      descricao: t.description,
      categoria: t.category,
      valor: Number(t.amount),
      tipo: t.type === "ENTRADA" ? "entrada" : "saida",
      data: t.date.toISOString()
    })),
    categorias
  }
}