"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export interface CheckoutItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
}

export interface CheckoutData {
  customer_name: string
  total_amount: number
  status?: string
  origin?: string
  payment_method?: string
  notes?: string
  items: CheckoutItem[]
}

export async function createOrder(data: CheckoutData) {
  try {
    // Cria o pedido com os itens em uma única transação
    const order = await prisma.order.create({
      data: {
        customer_name: data.customer_name,
        total_amount: data.total_amount,
        status: data.status || "pending",
        origin: data.origin || "site",
        payment_method: data.payment_method || "combinar",
        notes: data.notes || null,
        items: {
          create: data.items.map((item) => ({
            product_id: Number.parseInt(item.product_id) || null,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    revalidatePath("/admin/pedidos")

    return { success: true, order }
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return { success: false, error: "Erro ao criar pedido" }
  }
}
