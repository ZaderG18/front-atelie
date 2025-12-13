'use server'

import { prisma } from "@/lib/prisma"
// Importamos os tipos novos gerados pelo Prisma
import { Order, Ingredient } from "@prisma/client"

export async function getDashboardStats() {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  try {
    const [
      ordersMonth,
      ordersToday,
      ordersPending,
      totalProducts,
      activeProducts,
      recentOrders,
      lowStockIngredients
    ] = await Promise.all([
      // 1. Faturamento Mês (totalAmount)
      prisma.order.findMany({
        where: {
          createdAt: { gte: firstDayOfMonth },
          status: { not: 'CANCELED' } // Enum agora é maiúsculo
        },
        select: { totalAmount: true }
      }),
      
      // 2. Pedidos Hoje (createdAt)
      prisma.order.count({
        where: { createdAt: { gte: startOfToday } }
      }),

      // 3. Pedidos Pendentes (Status Enum)
      prisma.order.count({
        where: { status: 'PENDING' }
      }),

      // 4. Produtos (isActive)
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),

      // 5. Pedidos Recentes
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),

      // 6. Insumos Críticos (stockQuantity < minStockAlert)
      // O Prisma não faz comparação direta entre colunas no 'where' facilmente,
      // então buscamos todos e filtramos no JS (para bases pequenas/médias é ok)
      prisma.ingredient.findMany()
    ])

    // Cálculos
    const faturamentoMes = ordersMonth.reduce((acc, order) => acc + Number(order.totalAmount), 0)
    
    const ticketMedio = ordersMonth.length > 0 
      ? faturamentoMes / ordersMonth.length 
      : 0

    // Filtra insumos críticos em memória
    const listaInsumosCriticos = lowStockIngredients.filter(i => 
      Number(i.stockQuantity) < Number(i.minStockAlert)
    )

    return {
      faturamentoMes,
      ticketMedio,
      pedidosHoje: ordersToday,
      pedidosPendentes: ordersPending,
      totalProducts,
      produtosAtivos: activeProducts,
      // Retornamos a lista já processada
      insumosBaixoEstoque: listaInsumosCriticos.length,
      listaInsumosCriticos: listaInsumosCriticos.map(i => ({
        id: i.id,
        name: i.name,
        unit: i.unit,
        stockQuantity: Number(i.stockQuantity),
        minStockAlert: Number(i.minStockAlert)
      })), 
      // Formatamos pedidos recentes
      recentOrders: recentOrders.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        customerName: o.customerName || "Cliente" 
      }))
    }

  } catch (error) {
    console.error("Erro ao calcular dashboard:", error)
    // Retorno seguro em caso de erro
    return {
      faturamentoMes: 0,
      ticketMedio: 0,
      pedidosHoje: 0,
      pedidosPendentes: 0,
      totalProdutos: 0,
      produtosAtivos: 0,
      insumosBaixoEstoque: 0,
      recentOrders: [],
      listaInsumosCriticos: [],
    }
  }
}