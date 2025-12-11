"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingBag, Send } from "lucide-react"
import type { CartItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { API_URL } from "@/lib/api-config"

interface CartDrawerProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onRemoveItem: (index: number) => void
}

export function CartDrawer({ items, isOpen, onClose, onRemoveItem }: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcula o total
  const total = items.reduce((acc, item) => {
    const basePrice = item.basePrice || 0
    const weightPrice = item.selectedWeight?.priceModifier || 0
    // Adicione lógica para adicionais se houver
    return acc + basePrice + weightPrice
  }, 0)

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert("Por favor, digite seu nome para identificarmos o pedido.")
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Monta o objeto para o Banco de Dados
      const payload = {
        customer_name: customerName,
        total_amount: total,
        status: "pending",
        origin: "site_whatsapp",
        payment_method: "combinar", // Será decidido no Zap
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name, // Importante salvar o nome caso mude depois
          price: (item.basePrice || 0) + (item.selectedWeight?.priceModifier || 0),
          quantity: 1 // Por enquanto o carrinho não tem seletor de qtd por item, assume 1
        }))
      }

      // 2. Envia para a API (Salva no Render/Supabase)
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error("Erro ao salvar pedido")

      const pedidoCriado = await response.json()

      // 3. Monta a mensagem do WhatsApp com o ID gerado
      const message = `Olá! Me chamo *${customerName}* e acabei de fazer o pedido *#${pedidoCriado.id}* pelo site.\n\n` +
        `Valor Total: *${formatCurrency(total)}*\n` +
        `Gostaria de combinar o pagamento e a entrega!`

      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`

      // 4. Redireciona e fecha
      window.open(whatsappUrl, "_blank")
      onClose()
      // Aqui você pode adicionar uma função para limpar o carrinho se quiser

    } catch (error) {
      console.error(error)
      alert("Houve um erro ao processar. Tente novamente ou chame no WhatsApp direto.")
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
                    {/* Imagem pequena */}
                    <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    {/* Detalhes */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <span className="font-medium line-clamp-1">{item.name}</span>
                        <span className="font-semibold">
                          {formatCurrency((item.basePrice || 0) + (item.selectedWeight?.priceModifier || 0))}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {item.selectedWeight?.label !== "Padrão" && (
                          <span>{item.selectedWeight?.label} • </span>
                        )}
                        {item.selectedFlavor !== "Padrão" && (
                          <span>{item.selectedFlavor}</span>
                        )}
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="self-start text-xs font-medium text-red-500 hover:underline flex items-center gap-1 mt-1"
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
                <Label htmlFor="name">Seu Nome (para o pedido)</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Ana Silva" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <SheetFooter>
                <Button 
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white" 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processando..." : (
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
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 opacity-20" />
            <p>Seu carrinho está vazio</p>
            <Button variant="link" onClick={onClose}>
              Ver Cardápio
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
