export interface Insumo {
  id: string
  nome: string
  unidade: "kg" | "g" | "L" | "mL" | "un"
  custoUnitario: number
  estoqueAtual: number
  estoqueMinimo: number
  status: "em_estoque" | "critico"
}

export type CategoriaAdmin =
  | "bolos_festivos"
  | "bolos_no_pote"
  | "docinhos"
  | "salgados"
  | "tortas"
  | "brownies"
  | "macarons"
  | "cheesecakes"
  | "outros"

export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: CategoriaAdmin
  imagem: string | null
  sobEncomenda: boolean
  visivelVitrine: boolean
}

export const categoriasConfig: Record<CategoriaAdmin, { label: string; cor: string }> = {
  bolos_festivos: { label: "Bolos Festivos", cor: "bg-pink-100 text-pink-700" },
  bolos_no_pote: { label: "Bolos no Pote", cor: "bg-amber-100 text-amber-700" },
  docinhos: { label: "Docinhos", cor: "bg-emerald-100 text-emerald-700" },
  salgados: { label: "Salgados", cor: "bg-orange-100 text-orange-700" },
  tortas: { label: "Tortas", cor: "bg-blue-100 text-blue-700" },
  brownies: { label: "Brownies", cor: "bg-stone-200 text-stone-700" },
  macarons: { label: "Macarons", cor: "bg-purple-100 text-purple-700" },
  cheesecakes: { label: "Cheesecakes", cor: "bg-yellow-100 text-yellow-700" },
  outros: { label: "Outros", cor: "bg-slate-100 text-slate-700" },
}
