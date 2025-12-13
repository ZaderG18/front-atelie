"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return orders
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return []
  }
}

export async function updateOrderStatus(orderId: number, newStatus: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    })

    revalidatePath("/admin/pedidos")

    return { success: true, order }
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    return { success: false, error: "Erro ao atualizar status" }
  }
}

export async function deleteOrder(orderId: number) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    })

    revalidatePath("/admin/pedidos")

    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar pedido:", error)
    return { success: false, error: "Erro ao deletar pedido" }
  }
}
