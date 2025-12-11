export type ProductStatus = "pronta-entrega" | "sob-encomenda"

// Adicionei 'outros' para garantir que categorias novas não quebrem
export type Category = "bolos-festivos" | "bolos-no-pote" | "docinhos" | "salgados" | "outros"

export interface Product {
  id: string
  name: string
  description: string
  image: string
  basePrice: number
  status: ProductStatus
  category: Category
  weights: { label: string; priceModifier: number }[]
  flavors: string[]
  additionals: { name: string; price: number }[]
}

// Interface atualizada para funcionar com o CartDrawer novo
export interface CartItem {
  id: string          
  name: string        
  image: string       
  basePrice: number   
  
  // Opções Selecionadas (Opcionais pois nem todo produto tem peso/sabor)
  selectedWeight?: { label: string; priceModifier: number }
  selectedFlavor?: string
  additionals?: { name: string; price: number }[] 
  
  observation?: string
  quantity: number
}