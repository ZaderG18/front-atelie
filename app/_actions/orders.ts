"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  OrderStatus,
  OrderOrigin,
  PaymentMethod,
  TransactionType,
  StockMovementType
} from "@prisma/client"

type CreateOrderResult = {
  orderId: number
}

/* ======================================================
   Tipagem padrão de retorno
====================================================== */
type ActionResult<T = unknown> =
  | { success: true; data?: T }
  | { success: false; error: string }

/* ======================================================
   Schema de validação com Tratamento de ENUMS
====================================================== */
const createOrderSchema = z.object({
  customer_name: z.string().min(1, "Nome do cliente é obrigatório"),
  
  // Preprocess: Transforma "whatsapp" em "WHATSAPP" antes de validar
  status: z.preprocess(
    (val) => String(val).toUpperCase(), 
    z.nativeEnum(OrderStatus)
  ).optional().default("PENDING"),
  
  origin: z.preprocess(
    (val) => String(val).toUpperCase(), 
    z.nativeEnum(OrderOrigin)
  ).optional().default("BALCAO"),
  
  payment_method: z.preprocess(
    (val) => String(val).toUpperCase(), 
    z.nativeEnum(PaymentMethod)
  ).optional().default("PIX"),

  notes: z.string().optional(),
  
  total_amount: z.number().positive("Total inválido"),
  
  items: z.array(
    z.object({
      product_id: z.number().int().positive(),
      product_name: z.string().min(1),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Pedido precisa ter ao menos um item"),
})

type CreateOrderInput = z.infer<typeof createOrderSchema>

/* ======================================================
   CREATE ORDER (BLINDADO)
====================================================== */
export async function createOrder(
  rawData: unknown
): Promise<ActionResult<CreateOrderResult>> {

  try {
    // 1. Validação e Limpeza dos Dados
    const parsed = createOrderSchema.safeParse(rawData)

    if (!parsed.success) {
      console.error("Erro de validação:", parsed.error.format())
      return {
        success: false,
        error: parsed.error.issues[0].message // Retorna o primeiro erro amigável
      }
    }

    const data = parsed.data
    const totalAmount = Number(data.total_amount.toFixed(2))

    // 2. Transação Atômica (Tudo ou Nada)
    const order = await prisma.$transaction(async (tx) => {
      
      // A) Criar Cabeçalho do Pedido
      const createdOrder = await tx.order.create({
        data: {
          customerName: data.customer_name,
          notes: data.notes,
          totalAmount,
          status: data.status,
          origin: data.origin,
          paymentMethod: data.payment_method,
        },
      })

      // B) Criar Itens do Pedido
      await tx.orderItem.createMany({
        data: data.items.map(item => ({
          orderId: createdOrder.id,
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: Number((item.price * item.quantity).toFixed(2)),
        })),
      })

      // C) Baixa de Estoque Inteligente (Receita)
      for (const item of data.items) {
        // Busca receita do produto
        const recipes = await tx.productRecipe.findMany({
          where: { productId: item.product_id },
          include: { ingredient: true }
        })

        for (const recipe of recipes) {
          const quantityToDecrement = Number(recipe.quantity) * item.quantity

          // Atualiza quantidade no ingrediente
          await tx.ingredient.update({
            where: { id: recipe.ingredientId },
            data: { 
              stockQuantity: { decrement: quantityToDecrement } 
            }
          })

          // Registra histórico de saída
          await tx.stockMovement.create({
            data: {
              type: StockMovementType.OUT,
              quantity: quantityToDecrement,
              ingredientId: recipe.ingredientId,
              orderId: createdOrder.id,
              reason: `Venda Pedido #${createdOrder.id}: ${item.product_name} (x${item.quantity})`,
              costPrice: recipe.ingredient.costPrice,
            }
          })
        }
      }

      // D) Lançamento Financeiro (Se aplicável)
      const isPaid =
        data.status === OrderStatus.CONFIRMED ||
        data.status === OrderStatus.READY ||
        data.status === OrderStatus.DELIVERED

      if (isPaid) {
        await tx.transaction.create({
          data: {
            description: `Venda Pedido #${createdOrder.id} - ${data.customer_name}`,
            amount: totalAmount,
            type: TransactionType.ENTRADA,
            category: "Vendas",
            date: new Date(),
            orderId: createdOrder.id,
          }
        })
      }

      return createdOrder
    })

    // 3. Atualizar Caches
    revalidatePath("/admin")
    revalidatePath("/admin/pedidos")
    revalidatePath("/admin/financeiro")
    revalidatePath("/admin/insumos")

    return { success: true, data: { orderId: order.id } }

  } catch (error) {
    console.error("Erro CRÍTICO ao criar pedido:", error)
    return { success: false, error: "Erro interno ao processar o pedido. Tente novamente." }
  }
}

/* ======================================================
   OUTRAS FUNÇÕES (LEITURA / ATUALIZAÇÃO)
====================================================== */

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })

    return orders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      }))
    }))
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return []
  }
}

export async function updateOrderStatus(
  orderId: number,
  newStatus: string // Aceita string e converte
): Promise<ActionResult> {
  try {
    // Conversão segura manual para update simples
    const statusEnum = (OrderStatus as any)[newStatus.toUpperCase()] || OrderStatus.PENDING

    await prisma.order.update({
      where: { id: orderId },
      data: { status: statusEnum }
    })

    revalidatePath("/admin")
    revalidatePath("/admin/pedidos")

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    return { success: false, error: "Erro ao atualizar status do pedido." }
  }
}

export async function deleteOrder(id: number): Promise<ActionResult> {
  try {
    await prisma.order.delete({ where: { id } })

    revalidatePath("/admin")
    revalidatePath("/admin/pedidos")
    revalidatePath("/admin/financeiro")

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir pedido:", error)
    return { success: false, error: "Erro ao excluir pedido." }
  }
}
export async function getPendingOrdersCount() {
  try {
    const count = await prisma.order.count({
      where: { status: "PENDING" }
    })
    return count
  } catch (error) {
    return 0
  }
}