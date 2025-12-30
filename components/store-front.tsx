"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoryFilters } from "@/components/category-filters"
import { ProductGrid } from "@/components/product-grid"
import { ProductModal } from "@/components/product-modal"
import { CartDrawer } from "@/components/cart-drawer"
import { MobileMenu } from "@/components/mobile-menu"
import type { Product, CartItem } from "@/lib/types"

interface StoreFrontProps {
  initialProducts: Product[]
  settings?: any // Recebe as configurações do banco
}

export function StoreFront({ initialProducts, settings }: StoreFrontProps) {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // ============================
  // Produto → Modal
  // ============================
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  // ============================
  // Adicionar ao Carrinho
  // ============================
  const handleAddToCart = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      // 🔍 Verifica se já existe item IGUAL (produto + opções)
      const existingIndex = prev.findIndex(
        (i) =>
          i.id === item.id &&
          i.selectedWeight?.label === item.selectedWeight?.label &&
          i.selectedFlavor === item.selectedFlavor &&
          JSON.stringify(i.additionals) === JSON.stringify(item.additionals) &&
          i.observation === item.observation,
      )

      if (existingIndex >= 0) {
        // 🧮 Soma a quantidade
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        }
        return updated
      }

      return [...prev, item]
    })

    setIsModalOpen(false)
    setIsCartOpen(true)
  }, [])

  // ============================
  // Remover item
  // ============================
  const handleRemoveFromCart = useCallback((index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // ============================
  // Limpar carrinho (pós-checkout)
  // ============================
  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  // ============================
  // Scroll suave para o cardápio
  // ============================
  const scrollToMenu = () => {
    document
      .getElementById("cardapio")
      ?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      {/* 🚫 AVISO DE LOJA FECHADA (Novo) */}
      {settings && !settings.lojaAberta && (
        <div className="bg-red-600 text-white text-center py-3 px-4 text-sm font-bold shadow-md animate-in slide-in-from-top sticky top-[72px] z-40">
          🕒 A loja está fechada no momento. Você pode navegar, mas aceitamos apenas agendamentos.
        </div>
      )}

      <HeroSection onCtaClick={scrollToMenu} />

      <section id="cardapio" className="px-4 py-12 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Nosso Cardápio
          </h2>

          <CategoryFilters
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {initialProducts.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <p>Nenhum produto disponível no momento.</p>
            </div>
          ) : (
            <ProductGrid
              products={initialProducts}
              category={selectedCategory}
              onProductClick={handleProductClick}
            />
          )}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Passamos 'settings' para o Carrinho calcular taxas e usar o Zap correto */}
      <CartDrawer
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveFromCart}
        clearCart={clearCart}
        settings={settings} 
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </main>
  )
}