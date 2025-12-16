export type TransactionTypeClient = "entrada" | "saida"

export interface FinancialSummary {
  faturamentoBruto: number
  despesasTotais: number
  lucroLiquido: number
}

export interface FinancialTransaction {
  id: number
  descricao: string
  categoria: string
  valor: number
  tipo: TransactionTypeClient
  data: string
}

export interface FinancialCategory {
  categoria: string
  valor: number
  porcentagem: number
}

export interface FinancialHistory {
  mes: string
  faturamento: number
  despesas: number
}

export interface FinancialDashboardData {
  resumo: FinancialSummary
  lancamentos: FinancialTransaction[]
  categorias: FinancialCategory[]
  historico: FinancialHistory[]
}