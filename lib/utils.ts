import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Junta classes CSS de forma inteligente
 * (Padrão oficial shadcn/ui)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatter global para Real Brasileiro
 * Evita recriar Intl.NumberFormat várias vezes
 */
const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

/**
 * Formata valores monetários para R$
 * Aceita number ou string
 * Protegido contra NaN, undefined, null
 */
export function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value)

  if (isNaN(amount)) {
    return brlFormatter.format(0)
  }

  return brlFormatter.format(amount)
}

/**
 * Formata números simples (sem símbolo de moeda)
 * Útil para inputs, relatórios e impressão
 */
export function formatNumber(value: number | string | null | undefined) {
  const amount = Number(value)

  if (isNaN(amount)) {
    return "0,00"
  }

  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
