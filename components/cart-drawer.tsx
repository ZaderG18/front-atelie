"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingBag, Send } from "lucide-react"
import type { CartItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { createOrder } from "@/app/_actions/checkout"
import { toast } from "sonner"

interface CartDrawerProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onRemoveItem: (index: number) => void
}

// ⚠️ ATENÇÃO: TROQUE PELO SEU NÚMERO REAL (COM CÓDIGO DO PAÍS E DDD)
// Ex: 5511999999999
const PHONE_NUMBER = "5511999999999" 

export function CartDrawer({ items, isOpen, onClose, onRemoveItem }: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Otimização: Só recalcula se 'items' mudar
  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const basePrice = item.basePrice || 0
      const weightPrice = item.selectedWeight?.priceModifier || 0
      return acc + basePrice + weightPrice
    }, 0)
  }, [items])

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      toast.warning("Nome obrigatório", {
        description: "Por favor, digite seu nome para identificarmos o pedido."
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createOrder({
        customer_name: customerName,
        total_amount: total,
        status: "pending",
        origin: "site",
        payment_method: "combinar",
        items: items.map((item) => ({
          product_id: item.id, // A action converte para número
          product_name: item.name,
          price: (item.basePrice || 0) + (item.selectedWeight?.priceModifier || 0),
          quantity: 1, 
        })),
      })

      if (!result.success || !result.orderId) {
        throw new Error(result.error || "Erro ao criar pedido")
      }

      const orderId = result.orderId // Pegamos o ID direto (é um number)

      // Sucesso!
      toast.success("Pedido iniciado!", {
        description: "Redirecionando para o WhatsApp..."
      })

      // Monta a mensagem CORRIGIDA
      const message =
        `Olá! Me chamo *${customerName}*.\n` +
        `Acabei de fazer o pedido *#${orderId}* pelo site.\n\n` + // <--- CORRIGIDO AQUI
        `Valor Total: *${formatCurrency(total)}*\n` +
        `Gostaria de combinar o pagamento e a entrega!`

      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`

      // Pequeno delay para o usuário ver o toast antes de abrir a aba
      setTimeout(() => {
        window.open(whatsappUrl, "_blank")
        onClose()
        setCustomerName("") 
        // Aqui você deveria idealmente limpar o carrinho também
        // chamando uma função clearCart() se ela existisse nas props
      }, 1000)

    } catch (error) {
      console.error(error)
      toast.error("Erro ao processar", {
        description: "Tente novamente ou nos chame diretamente no WhatsApp."
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
                    {/* Imagem Otimizada */}
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted shrink-0">
                      <Image
                        src={item.image || "/placeholder-cake.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Detalhes */}
                    <div className="flex flex-1 flex-col justify-between min-h-[64px]">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium line-clamp-2 text-sm">{item.name}</span>
                        <span className="font-semibold text-sm whitespace-nowrap">
                          {formatCurrency((item.basePrice || 0) + (item.selectedWeight?.priceModifier || 0))}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        {item.selectedWeight?.label !== "Padrão" && <span>{item.selectedWeight?.label}</span>}
                        {item.selectedWeight?.label !== "Padrão" && item.selectedFlavor !== "Padrão" && <span> • </span>}
                        {item.selectedFlavor !== "Padrão" && <span>{item.selectedFlavor}</span>}
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="self-start text-xs font-medium text-red-500 hover:text-red-600 hover:underline flex items-center gap-1 mt-2"
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

              {/* Input Nome do Cliente */}
              <div className="space-y-2">
                <Label htmlFor="name">Seu Nome <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="Ex: Ana Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  // Permite enviar com Enter
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCheckout()
                  }}
                />
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">{formatCurrency(total)}</span>
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
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground">
            <div className="bg-slate-100 p-6 rounded-full dark:bg-slate-800">
                <ShoppingBag className="h-10 w-10 opacity-50" />
            </div>
            <p className="text-lg font-medium">Seu carrinho está vazio</p>
            <Button variant="outline" onClick={onClose}>
              Continuar Comprando
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}