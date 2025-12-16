'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { TransactionType } from "@prisma/client"

// 1. Criar Lançamento (Mantive igual)
export async function createTransaction(data: any) {
  try {
    await prisma.transaction.create({
      data: {
        description: data.descricao,
        
        // --- AQUI ESTAVA O ERRO ---
        // ANTES: amount: parseFloat(data.valor.toString().replace(",", ".")), 
        // AGORA: Recebemos o número direto (ex: 80) ou convertemos com segurança
        amount: Number(data.valor), 
        
        type: data.tipo === "entrada" ? TransactionType.ENTRADA : TransactionType.SAIDA,
        category: data.categoria,
        date: new Date(data.data), 
      }
    })
    
    revalidatePath("/admin/financeiro")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar transação:", error)
    return { success: false, error: "Erro ao salvar." }
  }
}

// 2. Buscar Dados do Dashboard (REFEITO)
export async function getFinancialDashboardData() {
  const now = new Date()
  
  // Define o início da busca para 6 meses atrás (para pegar histórico)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  
  // Limites para o "Mês Atual" (para os Cards e Rosca)
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // 1. Busca TUDO dos últimos 6 meses de uma vez
  const allTransactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: sixMonthsAgo
      }
    },
    orderBy: { date: 'asc' } // Ordem cronológica para o gráfico de barras
  })

  // ==========================================================
  // PARTE A: Dados do Mês Atual (Cards e Gráfico de Rosca)
  // ==========================================================
  const currentMonthTransactions = allTransactions.filter(t => 
    t.date >= startOfCurrentMonth && t.date <= endOfCurrentMonth
  )

  let entradaMes = 0
  let saidaMes = 0

  currentMonthTransactions.forEach(t => {
    if (t.type === TransactionType.ENTRADA) entradaMes += Number(t.amount)
    else saidaMes += Number(t.amount)
  })

  // Agrupamento por Categoria (Rosca) - Só do mês atual
  const categoryMap = new Map<string, number>()
  currentMonthTransactions
    .filter(t => t.type === TransactionType.SAIDA)
    .forEach(t => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + Number(t.amount))
    })

  const categoriasChart = Array.from(categoryMap.entries()).map(([categoria, valor]) => ({
    categoria,
    valor,
    porcentagem: Math.round((valor / (saidaMes || 1)) * 100),
  })).sort((a, b) => b.valor - a.valor)

  // ==========================================================
  // PARTE B: Histórico 6 Meses (Gráfico de Barras)
  // ==========================================================
  // Cria um mapa com os últimos 6 meses zerados
  const historyMap = new Map<string, { mes: string, faturamento: number, despesas: number, sortDate: number }>()
  
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    // Chave única ex: "2023-12"
    const key = `${d.getFullYear()}-${d.getMonth()}` 
    // Nome ex: "Dez"
    const monthName = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '') 
    
    // Inicializa o mês zerado
    historyMap.set(key, { 
        mes: monthName.charAt(0).toUpperCase() + monthName.slice(1), // Capitaliza (dez -> Dez)
        faturamento: 0, 
        despesas: 0,
        sortDate: d.getTime() // Para ordenar depois
    })
  }

  // Preenche com os dados reais
  allTransactions.forEach(t => {
    const key = `${t.date.getFullYear()}-${t.date.getMonth()}`
    const entry = historyMap.get(key)
    
    if (entry) {
        if (t.type === TransactionType.ENTRADA) {
            entry.faturamento += Number(t.amount)
        } else {
            entry.despesas += Number(t.amount)
        }
    }
  })

  // Converte Map para Array e ordena cronologicamente
  const historicoChart = Array.from(historyMap.values())
    .sort((a, b) => a.sortDate - b.sortDate)

  // ==========================================================
  // RETORNO FINAL
  // ==========================================================
  return {
    resumo: {
      faturamentoBruto: entradaMes,
      despesasTotais: saidaMes,
      lucroLiquido: entradaMes - saidaMes
    },
    // Lista de lançamentos (apenas do mês atual para a tabela, ou pode mandar tudo se preferir)
    lancamentos: currentMonthTransactions
      .sort((a, b) => b.date.getTime() - a.date.getTime()) // Mais recentes primeiro
      .map(t => ({
        id: t.id,
        descricao: t.description,
        categoria: t.category,
        valor: Number(t.amount),
        tipo: t.type === TransactionType.ENTRADA ? "entrada" : "saida",
        data: t.date.toISOString()
    })),
    categorias: categoriasChart,
    historico: historicoChart // <--- NOVO CAMPO
  }
}