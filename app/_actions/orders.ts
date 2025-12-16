'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {
  OrderStatus,
  OrderOrigin,
  PaymentMethod,
  TransactionType
} from "@prisma/client"

interface CreateOrderInput {
  customer_name: string
  status?: string
  origin?: string
  payment_method?: string
  notes?: string
  total_amount: number
  items: {
    product_id: number
    product_name: string
    price: number
    quantity: number
  }[]
}

export async function createOrder(data: CreateOrderInput) {
  try {
    if (!data.items || data.items.length === 0) {
      throw new Error("Pedido sem itens")
    }

    // =============================
    // Conversão segura para Enums (CORRIGIDO)
    // =============================
    // Adicionamos '?? ""' para garantir que nunca usamos undefined como índice
    
    const statusEnum =
      (OrderStatus as any)[data.status?.toUpperCase() ?? ""] || OrderStatus.PENDING

    const originEnum =
      (OrderOrigin as any)[data.origin?.toUpperCase() ?? ""] || OrderOrigin.BALCAO

    const paymentEnum =
      (PaymentMethod as any)[data.payment_method?.toUpperCase() ?? ""] || PaymentMethod.PIX

    // =============================
    // Normalização financeira
    // =============================
    const totalAmount = Number(data.total_amount.toFixed(2))

    const order = await prisma.$transaction(async (tx) => {
      // 1️⃣ Criar pedido
      const createdOrder = await tx.order.create({
        data: {
          customerName: data.customer_name,
          notes: data.notes,
          totalAmount,
          status: statusEnum,
          origin: originEnum,
          paymentMethod: paymentEnum,
        },
      })

      // 2️⃣ Criar itens
      await tx.orderItem.createMany({
        data: data.items.map((item) => ({
          orderId: createdOrder.id,
          productId: Number(item.product_id),
          productName: item.product_name,
          quantity: Number(item.quantity),
          unitPrice: Number(item.price),
          totalPrice: Number((item.price * item.quantity).toFixed(2)),
        })),
      })

      // ==============================================================
      // 3️⃣ Criar transação financeira (APENAS SE ESTIVER PAGO/CONFIRMADO)
      // ==============================================================
      const isPaid = 
          statusEnum === OrderStatus.CONFIRMED || 
          statusEnum === OrderStatus.DELIVERED || 
          statusEnum === OrderStatus.READY;

      if (isPaid) {
          await tx.transaction.create({
            data: {
              description: `Venda Pedido #${createdOrder.id} - ${data.customer_name}`,
              amount: totalAmount,
              type: TransactionType.ENTRADA,
              category: "Vendas",
              date: new Date(),
            },
          })
      }

      return createdOrder
    })

    revalidatePath("/admin")
    revalidatePath("/admin/pedidos")
    revalidatePath("/admin/financeiro")

    return { success: true, orderId: order.id }

  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return { success: false, error: String(error) }
  }
}

// --------------------------------------------------------
// Mantenha as outras funções (getOrders, update, delete) abaixo
// --------------------------------------------------------

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    return orders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice)
      }))
    }))
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return []
  }
}

export async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
        const statusEnum = (OrderStatus as any)[newStatus.toUpperCase() ?? ""] || OrderStatus.PENDING
        
        await prisma.order.update({
            where: { id: orderId },
            data: { status: statusEnum }
        })
        
        revalidatePath("/admin/pedidos")
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar status:", error)
        return { success: false, error: String(error) }
    }
}

export async function deleteOrder(id: number) {
    try {
        await prisma.order.delete({ where: { id } })
        revalidatePath("/admin/pedidos")
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Erro ao deletar:", error)
        return { success: false, error: String(error) }
    }
}