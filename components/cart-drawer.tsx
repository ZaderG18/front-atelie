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
import type { CartItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { createOrder } from "@/app/_actions/orders"
import { toast } from "sonner"

interface CartDrawerProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onRemoveItem: (index: number) => void
  clearCart?: () => void
}

// ⚠️ TROQUE PELO NÚMERO REAL
const PHONE_NUMBER = "5511999999999"

export function CartDrawer({
  items,
  isOpen,
  onClose,
  onRemoveItem,
  clearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ Total calculado corretamente (backend também valida)
  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const base = item.basePrice || 0
      const weight = item.selectedWeight?.priceModifier || 0
      const additionals =
        item.additionals?.reduce((sum, add) => sum + add.price, 0) || 0

      return acc + (base + weight + additionals) * item.quantity
    }, 0)
  }, [items])

  const handleCheckout = async () => {
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
      const result = await createOrder({
        customer_name: customerName,
        status: "pending",
        origin: "site",
        payment_method: "money",
        notes: "Pedido iniciado pelo site",
        items: items.map((item) => ({
          product_id: item.id,
          product_name: `${item.name}
${item.selectedWeight ? ` • ${item.selectedWeight.label}` : ""}
${item.selectedFlavor ? ` • ${item.selectedFlavor}` : ""}
${
  item.additionals?.length
    ? ` • Extras: ${item.additionals.map((a) => a.name).join(", ")}`
    : ""
}
${item.observation ? ` • Obs: ${item.observation}` : ""}`,
          quantity: item.quantity,
          price:
            (item.basePrice || 0) +
            (item.selectedWeight?.priceModifier || 0) +
            (item.additionals?.reduce((sum, a) => sum + a.price, 0) || 0),
        })),
      })

      if (!result.success || !result.orderId) {
        throw new Error(result.error || "Erro ao criar pedido")
      }

      toast.success("Pedido registrado!", {
        description: "Abrindo WhatsApp para finalizar.",
      })

      const message =
        `Olá! Me chamo *${customerName}*.\n` +
        `Acabei de fazer o pedido *#${result.orderId}* pelo site.\n\n` +
        `Valor total: *${formatCurrency(total)}*\n` +
        `Gostaria de combinar pagamento e entrega 😊`

      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
        message,
      )}`

      setTimeout(() => {
        window.open(whatsappUrl, "_blank")
        onClose()
        setCustomerName("")
        clearCart?.()
      }, 800)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao processar pedido", {
        description: "Tente novamente ou chame no WhatsApp.",
      })
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
                  <div key={index} className="flex gap-4 items-start">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted shrink-0">
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
                        <span className="font-medium text-sm line-clamp-2">
                          {item.name}
                        </span>
                        <span className="font-semibold text-sm">
                          {formatCurrency(
                            ((item.basePrice || 0) +
                              (item.selectedWeight?.priceModifier || 0) +
                              (item.additionals?.reduce(
                                (sum, a) => sum + a.price,
                                0,
                              ) || 0)) *
                              item.quantity,
                          )}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {item.selectedWeight?.label && (
                          <span>{item.selectedWeight.label}</span>
                        )}
                        {item.selectedFlavor && (
                          <span> • {item.selectedFlavor}</span>
                        )}
                      </div>

                      <span className="text-xs text-muted-foreground">
                        Quantidade: {item.quantity}
                      </span>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="h-3 w-3" /> Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />

              <div className="space-y-2">
                <Label>
                  Seu Nome <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Ex: Ana Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckout()}
                />
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  {formatCurrency(total)}
                </span>
              </div>

              <SheetFooter>
                <Button
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Processando..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Finalizar no WhatsApp
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
            <Button variant="outline" onClick={onClose}>
              Continuar comprando
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
