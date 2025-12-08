"use client"

import { X, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/lib/types"

interface CartDrawerProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onRemoveItem: (index: number) => void
}

export function CartDrawer({ items, isOpen, onClose, onRemoveItem }: CartDrawerProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const totalCart = items.reduce((sum, item) => sum + item.totalPrice, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-md bg-background shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-foreground">
              Seu Carrinho
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
              aria-label="Fechar carrinho"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-foreground">Carrinho vazio</p>
                <p className="mt-1 text-sm text-muted-foreground">Adicione produtos deliciosos ao seu carrinho!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 rounded-xl border border-border p-4">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.product.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.weight} • {item.flavor}
                        {item.additionals.length > 0 && <> • {item.additionals.join(", ")}</>}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                      <p className="mt-2 font-semibold text-primary">{formatPrice(item.totalPrice)}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="self-start rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                      aria-label="Remover item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-foreground">Total</span>
                <span className="text-xl font-semibold text-primary">{formatPrice(totalCart)}</span>
              </div>
              <Button size="lg" className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                Finalizar Pedido via WhatsApp
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
