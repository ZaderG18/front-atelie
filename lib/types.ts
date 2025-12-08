export type ProductStatus = "pronta-entrega" | "sob-encomenda"

export type Category = "bolos-festivos" | "bolos-no-pote" | "docinhos" | "salgados"

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

export interface CartItem {
  product: Product
  weight: string
  flavor: string
  additionals: string[]
  observation: string
  totalPrice: number
  quantity: number
}
