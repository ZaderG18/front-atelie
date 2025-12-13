// app/_actions/get-products.ts
"use server"

import { products } from "@/lib/products"

export async function getProducts() {
  try {
    // Retorna os produtos estáticos
    return products
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }
}
