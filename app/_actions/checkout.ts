"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// Importamos os Enums para não dar erro de tipo
import { OrderStatus, OrderOrigin, PaymentMethod } from "@prisma/client"

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
    // Mapeamento simples para garantir que "site" vire "SITE" (Enum)
    const originMap: Record<string, OrderOrigin> = {
        "site": "SITE",
        "whatsapp": "WHATSAPP",
        "instagram": "INSTAGRAM"
    }

    const paymentMap: Record<string, PaymentMethod> = {
        "pix": "PIX",
        "card": "CREDIT_CARD",
        "money": "CASH",
        "combinar": "CASH" // Fallback para Dinheiro se for "a combinar"
    }

    // Cria o pedido com os itens em uma única transação
    const order = await prisma.order.create({
      data: {
        // CORREÇÃO: Campos em camelCase
        customerName: data.customer_name,
        totalAmount: data.total_amount,
        notes: data.notes || null,
        
        // CORREÇÃO: Usando Enums
        status: "PENDING", // Pedido do site sempre começa Pendente
        origin: originMap[data.origin || "site"] || "SITE",
        paymentMethod: paymentMap[data.payment_method || "combinar"] || "CASH",
        
        items: {
          create: data.items.map((item) => ({
            productId: Number(item.product_id), // Converte string para number
            productName: item.product_name,
            quantity: item.quantity,
            // CORREÇÃO: Campos novos do Item
            unitPrice: item.price, 
            totalPrice: item.price * item.quantity // O novo banco exige o total da linha
          })),
        },
      },
    })

    // Revalida tudo para o Admin ver o pedido na hora
    revalidatePath("/admin/pedidos")
    revalidatePath("/admin")

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return { success: false, error: "Erro ao processar pedido. Tente novamente." }
  }
}