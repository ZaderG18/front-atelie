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
import { API_URL } from "@/lib/api-config"

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
        const response = await fetch(`${API_URL}/api/products`)
        
        if (!response.ok) throw new Error("API não respondeu")
        
        const data = await response.json()

        // 1. FILTRAR: Só mostra o que está marcado como "Visível na Vitrine" (is_active = true)
        const activeProducts = data.filter((item: any) => item.is_active);

        // 2. FORMATAR: Traduz os dados do Banco para o Front
        const dbProducts = activeProducts.map((item: any) => {
          
          // O Admin já salva as categorias com os IDs certos ("brownies", "macarons", etc)
          // Mas caso tenha algum legado, mantemos o switch básico
          let categoryFrontend = item.category;
          
          if (item.category === "bolos_pote") categoryFrontend = "bolos-no-pote";

          return {
            id: item.id.toString(),
            name: item.name,
            description: item.description || "Delicioso e feito com amor.",
            // Usa a URL do Laravel ou placeholder
            image: item.image_url || "/placeholder-cake.jpg", 
            basePrice: Number.parseFloat(item.sale_price),
            status: item.is_made_to_order ? "sob-encomenda" : "pronta-entrega",
            category: categoryFrontend,
            weights: [{ label: "Padrão", priceModifier: 0 }],
            flavors: ["Padrão"],
            additionals: [],
          }
        })

        console.log("✅ Conectado! Carregando vitrine atualizada.")
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
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Nosso Cardápio
          </h2>

          <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />

          {isLoading ? (
            <div className="text-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
               <p className="text-gray-500">Tirando do forno... 🍰</p>
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