'use server'

import { prisma } from "@/lib/prisma"
import { OrderStatus, TransactionType } from "@prisma/client"

export async function getDashboardStats() {
  const now = new Date()

  // Define o intervalo exato do dia (00:00:00.000 até 23:59:59.999)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0, 0
  )

  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, 59, 59, 999
  )

  try {
    // Executa as 4 consultas ao mesmo tempo (Paralelismo) para carregar rápido
    const [
      financialToday,
      ordersTodayCount,
      pendingOrdersCount,
      ingredients
    ] = await Promise.all([
      
      // 1. Faturamento Real (Soma das transações de Entrada de hoje)
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: TransactionType.ENTRADA,
          date: { gte: startOfToday, lte: endOfToday }
        }
      }),

      // 2. Quantidade de Pedidos Criados Hoje
      prisma.order.count({
        where: {
          createdAt: { gte: startOfToday, lte: endOfToday }
        }
      }),

      // 3. Pedidos Pendentes (Geral - Acumulado)
      prisma.order.count({
        where: { status: OrderStatus.PENDING }
      }),

      // 4. Busca todos os ingredientes para verificar estoque
      prisma.ingredient.findMany({
        select: {
          id: true,
          name: true,
          stockQuantity: true,
          minStockAlert: true,
          unit: true
        }
      })
    ])

    // Filtra e processa os ingredientes com estoque baixo em memória
    // (Compara: Estoque Atual <= Estoque Mínimo)
    const estoqueBaixo = ingredients
      .filter(i => Number(i.stockQuantity) <= Number(i.minStockAlert))
      .map(i => ({
        id: i.id,
        name: i.name,
        current: Number(i.stockQuantity),
        min: Number(i.minStockAlert),
        unit: i.unit
      }))

    // Retorno limpo e seguro para o Front-end
    return {
      faturamentoDia: Number(financialToday._sum.amount ?? 0), // Se for null, retorna 0
      pedidosDia: ordersTodayCount,
      pedidosPendentes: pendingOrdersCount,
      estoqueBaixo
    }

  } catch (error) {
    console.error("Erro ao calcular dashboard:", error)

    // Retorno de segurança para a página não quebrar
    return {
      faturamentoDia: 0,
      pedidosDia: 0,
      pedidosPendentes: 0,
      estoqueBaixo: []
    }
  }
}