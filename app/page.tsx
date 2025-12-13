"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoryFilters } from "@/components/category-filters"
import { ProductGrid } from "@/components/product-grid"
import { ProductModal } from "@/components/product-modal"
import { CartDrawer } from "@/components/cart-drawer"
import { MobileMenu } from "@/components/mobile-menu"
import type { Product, CartItem } from "@/lib/types"
import { products as staticProducts } from "@/lib/products"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [products] = useState<Product[]>(staticProducts)
  const [isLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item])
    setIsModalOpen(false)
    setIsCartOpen(true)
  }

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }

  const scrollToMenu = () => {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header
        cartItemsCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <HeroSection onCtaClick={scrollToMenu} />

      <section id="cardapio" className="px-4 py-12 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Nosso Cardápio
          </h2>

          <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Carregando delícias...</p>
            </div>
          ) : (
            <ProductGrid products={products} category={selectedCategory} onProductClick={handleProductClick} />
          )}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveFromCart}
      />

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </main>
  )
}
