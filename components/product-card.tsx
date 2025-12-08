"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <article className="group overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium",
            product.status === "pronta-entrega" ? "bg-verde-pronta text-white" : "bg-roxo-encomenda text-white",
          )}
        >
          {product.status === "pronta-entrega" ? "Pronta Entrega" : "Sob Encomenda"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-card-foreground">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">A partir de</span>
            <p className="text-lg font-semibold text-primary">{formatPrice(product.basePrice)}</p>
          </div>

          <Button onClick={onClick} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            Personalizar
          </Button>
        </div>
      </div>
    </article>
  )
}
