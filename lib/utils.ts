import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Função para combinar classes do Tailwind (já existia)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 👇 NOVA FUNÇÃO: Formatar Dinheiro (R$)
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}