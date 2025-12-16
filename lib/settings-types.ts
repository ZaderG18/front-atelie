// lib/settings-types.ts

export interface DeliveryNeighborhoodInput {
  id?: number // Opcional, pois novos bairros não têm ID ainda
  nome: string
  taxa: number | string // Aceita string durante a digitação, convertemos depois
}

export interface StoreSettingsInput {
  geral: {
    logo: string
    nomeConfeitaria: string
    telefone: string
    whatsapp: string
    descricao: string
    endereco: string
  }
  cardapio: {
    aberto: boolean
    horaAbertura: string
    horaFechamento: string
    diasFuncionamento: string[]
    tempoPreparo: string
    aceitaEncomendas: boolean
  }
  pagamentos: {
    pix: boolean
    chavePix: string
    tipoChavePix: string
    cartao: boolean
    dinheiro: boolean
  }
  entregas: {
    tipoTaxa: "fixa" | "bairro"
    taxaFixa: number | string
    freteGratis: number | string
    retiradaLocal: boolean
    bairros: DeliveryNeighborhoodInput[]
  }
}