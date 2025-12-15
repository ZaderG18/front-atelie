"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// Importamos os Enums para garantir que o status/origem sejam válidos
import { OrderStatus, OrderOrigin, PaymentMethod } from "@prisma/client"

export async function createOrder(data: {
  customer_name: string
  status: string
  origin: string
  payment_method: string
  notes?: string
  items: {
    product_id: number
    product_name: string
    quantity: number
    price: number
  }[]
}) {
  try {
    if (!data.items || data.items.length === 0) {
      throw new Error("Pedido sem itens")
    }

    const statusMap: Record<string, OrderStatus> = {
      pending: "PENDING",
      confirmed: "CONFIRMED",
      preparing: "PREPARING",
      ready: "READY",
      delivered: "DELIVERED",
      canceled: "CANCELED",
    }

    const originMap: Record<string, OrderOrigin> = {
      whatsapp: "WHATSAPP",
      instagram: "INSTAGRAM",
      balcao: "BALCAO",
      site: "SITE",
      telefone: "WHATSAPP",
      ifood: "IFOOD",
    }

    const paymentMap: Record<string, PaymentMethod> = {
      pix: "PIX",
      card: "CREDIT_CARD",
      money: "CASH",
      debit: "DEBIT_CARD",
    }

    // 🔒 Cálculo REAL do total no backend
    const totalAmount = data.items.reduce((acc, item) => {
      return acc + Number(item.price) * Number(item.quantity)
    }, 0)

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerName: data.customer_name,
          notes: data.notes,
          totalAmount,

          status: statusMap[data.status] ?? "PENDING",
          origin: originMap[data.origin] ?? "BALCAO",
          paymentMethod: paymentMap[data.payment_method] ?? "CASH",
        },
      })

      await tx.orderItem.createMany({
        data: data.items.map((item) => ({
          orderId: createdOrder.id,
          productId: Number(item.product_id),
          productName: item.product_name,
          quantity: Number(item.quantity),
          unitPrice: Number(item.price),
          totalPrice: Number(item.price) * Number(item.quantity),
        })),
      })

      return createdOrder
    })

    revalidatePath("/admin/pedidos")
    revalidatePath("/admin")

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return {
      success: false,
      error: "Erro ao processar o pedido",
    }
  }
}
