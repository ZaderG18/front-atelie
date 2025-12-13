"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// Importamos os Enums para garantir que o status/origem sejam válidos
import { OrderStatus, OrderOrigin, PaymentMethod } from "@prisma/client"

// ==========================================
// 1. BUSCAR PEDIDOS
// ==========================================
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true, // Traz os produtos do pedido
      },
      orderBy: {
        createdAt: "desc", // CORRIGIDO: created_at -> createdAt
      },
    })

    return orders
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return []
  }
}

// ==========================================
// 2. ATUALIZAR STATUS
// ==========================================
export async function updateOrderStatus(orderId: number, newStatus: string) {
  try {
    // Tentamos converter a string recebida para o Enum do Prisma
    // Ex: "pending" vira "PENDING"
    const statusEnum = newStatus.toUpperCase() as OrderStatus

    // Verificação de segurança simples
    if (!Object.values(OrderStatus).includes(statusEnum)) {
      throw new Error("Status inválido")
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: statusEnum },
    })

    revalidatePath("/admin/pedidos")
    revalidatePath("/admin") 

    return { success: true, order }
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    return { success: false, error: "Erro ao atualizar status" }
  }
}

// ==========================================
// 3. DELETAR PEDIDO
// ==========================================
export async function deleteOrder(orderId: number) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    })

    revalidatePath("/admin/pedidos")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar pedido:", error)
    return { success: false, error: "Erro ao deletar pedido" }
  }
}

// ==========================================
// 4. CRIAR PEDIDO (A Lógica Pesada)
// ==========================================
export async function createOrder(data: {
  customer_name: string
  total_amount: number
  status: string
  origin: string
  payment_method: string
  notes: string
  items: any[]
}) {
  try {
    // Mapas para converter string do Front (minúsculo) para Enum do Banco (Maiúsculo)
    const statusMap: Record<string, OrderStatus> = {
      "pending": "PENDING",
      "confirmed": "CONFIRMED",
      "preparing": "PREPARING",
      "ready": "READY",
      "delivered": "DELIVERED",
      "canceled": "CANCELED"
    }

    const originMap: Record<string, OrderOrigin> = {
      "whatsapp": "WHATSAPP",
      "instagram": "INSTAGRAM",
      "balcao": "BALCAO",
      "site": "SITE",
      "telefone": "WHATSAPP", 
      "ifood": "IFOOD"
    }

    const paymentMap: Record<string, PaymentMethod> = {
      "pix": "PIX",
      "card": "CREDIT_CARD",
      "money": "CASH",
      "debit": "DEBIT_CARD"
    }

    // Criamos o pedido no banco
    const order = await prisma.order.create({
      data: {
        // Campos simples (camelCase)
        customerName: data.customer_name,
        totalAmount: data.total_amount,
        notes: data.notes,

        // Campos Enum (usamos os mapas ou fallback)
        status: statusMap[data.status] || "PENDING",
        origin: originMap[data.origin] || "BALCAO",
        paymentMethod: paymentMap[data.payment_method] || "CASH",

        // Campos Relacionais (Itens)
        items: {
          create: data.items.map((item) => ({
            productId: Number(item.product_id), // Converte string ID para numero
            productName: item.product_name,     // Snapshot do nome
            quantity: Number(item.quantity),
            unitPrice: Number(item.price),      // Preço unitário
            totalPrice: Number(item.price) * Number(item.quantity) // Total da linha (obrigatório agora)
          })),
        },
      },
    })

    // Atualiza caches para a tela atualizar sozinha
    revalidatePath("/admin/pedidos")
    revalidatePath("/admin") 
    
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return { success: false, error: "Falha ao salvar no banco de dados. Verifique os logs." }
  }
}