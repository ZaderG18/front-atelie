"use client"

import { useState, useEffect } from "react"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Product, CartItem } from "@/lib/types"

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: CartItem) => void
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [selectedWeight, setSelectedWeight] = useState(0)
  const [selectedFlavor, setSelectedFlavor] = useState(0)
  const [selectedAdditionals, setSelectedAdditionals] = useState<number[]>([])
  const [observation, setObservation] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (isOpen) {
      setSelectedWeight(0)
      setSelectedFlavor(0)
      setSelectedAdditionals([])
      setObservation("")
      setQuantity(1)
    }
  }, [isOpen, product])

  if (!product) return null

  const toggleAdditional = (index: number) => {
    setSelectedAdditionals((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const calculateTotal = () => {
    const basePrice = product.basePrice + product.weights[selectedWeight].priceModifier
    const additionalsTotal = selectedAdditionals.reduce((sum, idx) => sum + product.additionals[idx].price, 0)
    return (basePrice + additionalsTotal) * quantity
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleAddToCart = () => {
    onAddToCart({
      product,
      weight: product.weights[selectedWeight].label,
      flavor: product.flavors[selectedFlavor],
      additionals: selectedAdditionals.map((idx) => product.additionals[idx].name),
      observation,
      totalPrice: calculateTotal(),
      quantity,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
          aria-label="Fechar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="aspect-video w-full overflow-hidden">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="p-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-foreground">
            {product.name}
          </h2>
          <p className="mt-2 text-muted-foreground">{product.description}</p>

          {/* Weight Selection */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-foreground">Escolha o Tamanho</h3>
            <div className="flex flex-wrap gap-2">
              {product.weights.map((weight, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWeight(idx)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm transition-all",
                    selectedWeight === idx
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50",
                  )}
                >
                  {weight.label}
                  {weight.priceModifier > 0 && (
                    <span className="ml-1 text-xs opacity-75">(+{formatPrice(weight.priceModifier)})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Selection */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-foreground">Escolha a Massa</h3>
            <div className="flex flex-wrap gap-2">
              {product.flavors.map((flavor, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFlavor(idx)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm transition-all",
                    selectedFlavor === idx
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50",
                  )}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          {/* Additionals */}
          {product.additionals.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">Adicionais</h3>
              <div className="space-y-2">
                {product.additionals.map((additional, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleAdditional(idx)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all",
                      selectedAdditionals.includes(idx)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/50",
                    )}
                  >
                    <span className="text-foreground">{additional.name}</span>
                    <span className="text-muted-foreground">+{formatPrice(additional.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Observation */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-foreground">Observações</h3>
            <Textarea
              placeholder="Alguma observação especial? (ex: sem glúten, alergia, etc.)"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Quantidade</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Total and Add to Cart */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <div>
              <span className="text-sm text-muted-foreground">Total</span>
              <p className="text-2xl font-semibold text-primary">{formatPrice(calculateTotal())}</p>
            </div>
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="rounded-xl bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
