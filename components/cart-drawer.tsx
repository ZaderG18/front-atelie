"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingBag, Send } from "lucide-react"
import { toast } from "sonner"

import type { CartItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { createOrder } from "@/app/_actions/orders"

/* =====================================================
   Helpers
===================================================== */
function calculateItemUnitPrice(item: CartItem) {
  const base = item.basePrice || 0
  const weight = item.selectedWeight?.priceModifier || 0
  const additionals =
    item.additionals?.reduce((sum, add) => sum + add.price, 0) || 0

  return base + weight + additionals
}

function buildProductName(item: CartItem) {
  const details = [
    item.selectedWeight?.label,
    item.selectedFlavor,
    item.additionals?.length
      ? `Extras: ${item.additionals.map(a => a.name).join(", ")}`
      : null,
    item.observation ? `Obs: ${item.observation}` : null,
  ]
    .filter(Boolean)
    .join(" • ")

  return details ? `${item.name} (${details})` : item.name
}

/* =====================================================
   Props (AQUI ESTAVA O ERRO, FALTAVA O SETTINGS)
===================================================== */
interface CartDrawerProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onRemoveItem: (index: number) => void
  clearCart?: () => void
  settings?: any // <--- Adicionamos isto para aceitar as configs
}

/* =====================================================
   Component
===================================================== */
export function CartDrawer({
  items,
  isOpen,
  onClose,
  onRemoveItem,
  clearCart,
  settings,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Configurações Dinâmicas (Zap do Admin ou Padrão)
  // Removemos caracteres não numéricos para o link
  const whatsappNumber = settings?.whatsapp 
    ? settings.whatsapp.replace(/\D/g, '') 
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999"
  
  // 2. Cálculo do Subtotal (Produtos)
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + calculateItemUnitPrice(item) * item.quantity
    }, 0)
  }, [items])

  // 3. Cálculo da Taxa de Entrega
  const deliveryFee = useMemo(() => {
    if (!settings) return 0
    
    // Regra de Frete Grátis
    if (settings.freteGratis > 0 && subtotal >= Number(settings.freteGratis)) {
      return 0
    }

    // Regra de Taxa Fixa
    if (settings.tipoTaxaEntrega === 'fixa') {
      return Number(settings.taxaFixa || 0)
    }

    // (Futuro: Cálculo por bairro entraria aqui)
    return 0 
  }, [subtotal, settings])

  const total = subtotal + deliveryFee

  async function handleCheckout() {
    if (!customerName.trim()) {
      toast.warning("Nome obrigatório", {
        description: "Digite seu nome para identificarmos o pedido.",
      })
      return
    }

    if (items.length === 0) {
      toast.warning("Carrinho vazio")
      return
    }

    setIsSubmitting(true)

    try {
      const orderItems = items.map(item => {
        const unitPrice = calculateItemUnitPrice(item)
        return {
          product_id: Number(item.id),
          product_name: buildProductName(item),
          price: unitPrice,
          quantity: item.quantity,
        }
      })

      // Cria pedido no Banco
      const result = await createOrder({
        customer_name: customerName,
        status: "PENDING",
        origin: "SITE",
        payment_method: "PIX",
        notes: "Pedido via Site",
        total_amount: total, // Total JÁ com entrega
        items: orderItems,
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      const orderId = result.data?.orderId
      if (!orderId) throw new Error("ID do pedido não retornado")

      toast.success("Pedido enviado com sucesso!", {
        description: `Pedido #${orderId} registrado.`,
      })

      // Mensagem do WhatsApp com Detalhes Financeiros
      const message = 
        `Olá! Me chamo *${customerName}*.\n` +
        `Acabei de fazer o pedido *#${orderId}* pelo site.\n\n` +
        `--------------------------------\n` +
        items.map(i => `• ${i.quantity}x ${i.name}`).join("\n") +
        `\n--------------------------------\n` +
        `Subtotal: ${formatCurrency(subtotal)}\n` +
        (deliveryFee > 0 ? `Entrega: ${formatCurrency(deliveryFee)}\n` : `Entrega: Grátis\n`) +
        `*Total: ${formatCurrency(total)}*\n\n` +
        `Gostaria de combinar o pagamento e a entrega! 🎂`

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

      setTimeout(() => {
        window.open(whatsappUrl, "_blank")
        onClose()
        setCustomerName("")
        clearCart?.()
      }, 1200)

    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado"
      toast.error("Erro ao processar pedido", { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="space-y-4 py-4">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border shrink-0">
                      <Image
                        src={item.image || "/placeholder-cake.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm line-clamp-2">{item.name}</span>
                        <span className="font-semibold text-sm">
                          {formatCurrency(calculateItemUnitPrice(item) * item.quantity)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.selectedWeight?.label && <span>{item.selectedWeight.label}</span>}
                        {item.selectedFlavor && <span> • {item.selectedFlavor}</span>}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">Qtd: {item.quantity}</span>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" /> Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />

              <div className="space-y-2">
                <Label>Seu Nome <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Ex: Ana Silva"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCheckout()}
                />
              </div>

              {/* Resumo Financeiro com Entrega */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entrega</span>
                    {deliveryFee > 0 ? (
                        <span>{formatCurrency(deliveryFee)}</span>
                    ) : (
                        <span className="text-green-600 font-medium">Grátis</span>
                    )}
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <SheetFooter>
                <Button
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processando..." : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Finalizar no WhatsApp
                    </>
                  )}
                </Button>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-10 w-10 opacity-50" />
            <p className="text-lg font-medium">Seu carrinho está vazio</p>
            <Button variant="outline" onClick={onClose}>Continuar comprando</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}