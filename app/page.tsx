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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // ESTADOS NOVOS PARA A API
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // --- AQUI ESTÁ A CORREÇÃO: O useEffect envolve o fetch ---
  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((response) => response.json())
      .then((data) => {
        const formattedProducts = data.map((item: any) => {
          
          let categoryFrontend = "todos"; 

          // Lógica de Tradução (Laravel -> Frontend)
          switch(item.category) {
            case "bolos_festivos":
              categoryFrontend = "bolos_festivos"; // IGUAL ao ID do category-filters
              break;
            case "bolos_pote":
              categoryFrontend = "bolos-no-pote"; 
              break;
            case "docinhos":
              categoryFrontend = "docinhos";
              break;
            case "salgados":
              categoryFrontend = "salgados";
              break;
            default:
              categoryFrontend = item.category;
          }

          return {
            id: item.id.toString(),
            name: item.name,
            description: item.description,
            image: item.image_url || "/placeholder-cake.jpg",
            basePrice: parseFloat(item.sale_price),
            status: item.is_made_to_order ? "sob-encomenda" : "pronta-entrega",
            
            category: categoryFrontend, // Categoria traduzida
            
            weights: [{ label: "Padrão", priceModifier: 0 }],
            flavors: ["Padrão"],
            additionals: []
          }
        })
        
        setProducts(formattedProducts)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error)
        setIsLoading(false)
      })
  }, []) // <--- O array vazio [] garante que rode apenas 1 vez ao carregar a página

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
          <h2 className="mb-8 text-center font-[family-name:var(--font-playfair)] text-3xl font-semibold text-foreground md:text-4xl">
            Nosso Cardápio
          </h2>

          <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />

          {/* Grid de Produtos conectado à API */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">
              Buscando delícias no forno... 🍰
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
