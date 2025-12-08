// components/product-grid.tsx

import { Product } from "@/lib/types"
import { ProductCard } from "./product-card"
// Remova a importação: import { products } from "@/lib/products"

interface ProductGridProps {
  category: string
  onProductClick: (product: Product) => void
  products: Product[] // <--- Adicione esta linha nova
}

export function ProductGrid({ category, onProductClick, products }: ProductGridProps) {
  
  // Filtra a lista que veio do Laravel (e não mais a lista fixa)
  const filteredProducts = category === "todos" 
    ? products 
    : products.filter((p) => p.category === category)

  if (filteredProducts.length === 0) {
     return <div className="text-center w-full py-10">Nenhum produto nesta categoria.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
      ))}
    </div>
  )
}
