"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoryFilters } from "@/components/category-filters"
import { ProductGrid } from "@/components/product-grid"
import { ProductModal } from "@/components/product-modal"
import { CartDrawer } from "@/components/cart-drawer"
import { MobileMenu } from "@/components/mobile-menu"
import type { Product, CartItem } from "@/lib/types"

// Importamos a lista estática para usar APENAS como Backup (Fallback)
import { products as STATIC_PRODUCTS } from "@/lib/products"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Estados para gerenciar os dados da API
  const [products, setProducts] = useState<Product[]>([]) 
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("📡 Tentando conectar com Laravel...")
        
        // Tenta buscar no Laravel (usando IP 127.0.0.1 para evitar erro no Windows)
        const response = await fetch("http://127.0.0.1:8000/api/products")
        
        if (!response.ok) throw new Error("API não respondeu")
        
        const data = await response.json()

        // Formata os dados vindos do Banco de Dados
        const dbProducts = data.map((item: any) => {
          let categoryFrontend = "todos"
          
          switch (item.category) {
            case "bolos_festivos": categoryFrontend = "bolos_festivos"; break
            case "bolos_pote": categoryFrontend = "bolos-no-pote"; break
            case "docinhos": categoryFrontend = "docinhos"; break
            case "salgados": categoryFrontend = "salgados"; break
            default: categoryFrontend = item.category
          }

          return {
            id: item.id.toString(),
            name: item.name,
            description: item.description,
            image: item.image_url || "/placeholder-cake.jpg",
            basePrice: Number.parseFloat(item.sale_price),
            status: item.is_made_to_order ? "sob-encomenda" : "pronta-entrega",
            category: categoryFrontend,
            weights: [{ label: "Padrão", priceModifier: 0 }],
            flavors: ["Padrão"],
            additionals: [],
          }
        })

        console.log("✅ Conectado! Usando dados do Laravel.")
        setProducts(dbProducts)

      } catch (error) {
        console.warn("⚠️ Laravel offline. Usando Cardápio de Backup.")
        // Se der erro, usamos a lista que já existia no projeto
        setProducts(STATIC_PRODUCTS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

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
          {/* CORREÇÃO APLICADA AQUI: font-serif em vez da variável quebrada */}
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Nosso Cardápio
          </h2>

          <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />

          {isLoading ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">
              Verificando o forno... 🍰
            </div>
          ) : (
            <ProductGrid 
              products={products} 
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