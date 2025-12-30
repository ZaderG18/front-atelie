/* =====================================================
   STATUS DO PRODUTO (NEGÓCIO)
===================================================== */
export type ProductStatus =
  | "pronta-entrega"
  | "sob-encomenda"

/* =====================================================
   CATEGORIAS (RESILIENTE A NOVAS)
===================================================== */
export type Category =
  | "bolos-festivos"
  | "bolos-no-pote"
  | "docinhos"
  | "salgados"
  | "outros"

/* =====================================================
   TIPOS REUTILIZÁVEIS (OPÇÕES)
===================================================== */
export interface WeightOption {
  label: string
  priceModifier: number
}

export interface AdditionalOption {
  name: string
  price: number
}

/* =====================================================
   PRODUTO (VITRINE / CATÁLOGO)
===================================================== */
export interface Product {
  id: string
  name: string
  description: string
  image: string

  basePrice: number
  status: ProductStatus
  category: Category

  // Sempre arrays (mesmo vazios) para evitar undefined na UI
  weights: WeightOption[]
  flavors: string[]
  additionals: AdditionalOption[]
}

/* =====================================================
   ITEM DO CARRINHO (PRODUTO + ESCOLHAS)
===================================================== */
export interface CartItem {
  id: string
  name: string
  image: string
  basePrice: number

  // Opções selecionadas
  selectedWeight?: WeightOption
  selectedFlavor?: string

  // Sempre array para simplificar cálculo e renderização
  additionals: AdditionalOption[]

  observation?: string

  /** Quantidade mínima: 1 */
  quantity: number
}

/* =====================================================
   TIPOS AUXILIARES (CHECKOUT / CÁLCULO)
===================================================== */
export interface OrderItemInput {
  product_id: number
  product_name: string
  price: number
  quantity: number
}
