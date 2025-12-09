export interface Insumo {
  id: string
  nome: string
  unidade: "kg" | "g" | "L" | "mL" | "un"
  custoUnitario: number
  estoqueAtual: number
  estoqueMinimo: number
  status: "em_estoque" | "critico"
}
