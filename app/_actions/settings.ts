'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// Importamos o tipo que criamos no passo anterior
import type { StoreSettingsInput } from "@/lib/settings-types"

// ==============================================================================
// 1. BUSCAR CONFIGURAÇÕES (Mantivemos sua lógica de criar se não existir)
// ==============================================================================
export async function getStoreSettings() {
  try {
    let settings = await prisma.storeSettings.findFirst({
      include: { bairros: true }
    })

    // Se não existir, cria a padrão (Singleton / Seed automático)
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          nomeConfeitaria: "Minha Confeitaria",
          // Cria com dados padrão para não quebrar a UI
          bairros: {
            create: [
              { nome: "Centro", taxa: 10.00 },
              { nome: "Bairro Vizinho", taxa: 15.00 }
            ]
          }
        },
        include: { bairros: true }
      })
    }

    // Serializar Decimals para Number (Obrigatório para passar do Server pro Client)
    return {
      ...settings,
      taxaFixa: Number(settings.taxaFixa),
      freteGratis: Number(settings.freteGratis),
      bairros: settings.bairros.map(b => ({
        ...b,
        taxa: Number(b.taxa)
      }))
    }

  } catch (error) {
    console.error("Erro ao buscar configs:", error)
    return null
  }
}

// ==============================================================================
// 2. SALVAR CONFIGURAÇÕES (Versão Blindada com Tipagem)
// ==============================================================================
export async function updateStoreSettings(data: StoreSettingsInput) {
  try {
    // Validação Básica
    if (!data.geral.nomeConfeitaria.trim()) {
      return { success: false, error: "O nome da confeitaria é obrigatório." }
    }

    const existing = await prisma.storeSettings.findFirst()
    if (!existing) throw new Error("Configuração não encontrada")

    await prisma.$transaction(async (tx) => {
      // 2.1. Atualiza dados planos
      await tx.storeSettings.update({
        where: { id: existing.id },
        data: {
          // Geral
          nomeConfeitaria: data.geral.nomeConfeitaria,
          telefone: data.geral.telefone,
          whatsapp: data.geral.whatsapp,
          descricao: data.geral.descricao,
          endereco: data.geral.endereco,
          logoUrl: data.geral.logo,

          // Cardápio
          lojaAberta: data.cardapio.aberto,
          horaAbertura: data.cardapio.horaAbertura,
          horaFechamento: data.cardapio.horaFechamento,
          diasFuncionamento: data.cardapio.diasFuncionamento,
          tempoPreparo: data.cardapio.tempoPreparo,
          aceitaEncomendas: data.cardapio.aceitaEncomendas,

          // Pagamentos
          aceitaPix: data.pagamentos.pix,
          chavePix: data.pagamentos.chavePix,
          tipoChavePix: data.pagamentos.tipoChavePix,
          aceitaCartao: data.pagamentos.cartao,
          aceitaDinheiro: data.pagamentos.dinheiro,

          // Entregas
          tipoTaxaEntrega: data.entregas.tipoTaxa,
          // CONVERSÃO SEGURA: Garante que vira número ou 0
          taxaFixa: Number(data.entregas.taxaFixa || 0),
          freteGratis: Number(data.entregas.freteGratis || 0),
          retiradaLocal: data.entregas.retiradaLocal,
        }
      })

      // 2.2. Atualiza Bairros (Remove antigos e recria novos)
      if (data.entregas.bairros) {
        // Limpa a tabela de bairros vinculada a essa configuração
        await tx.deliveryNeighborhood.deleteMany({
           where: { settingsId: existing.id }
        })
        
        // Insere os novos se houver
        if (data.entregas.bairros.length > 0) {
          await tx.deliveryNeighborhood.createMany({
            data: data.entregas.bairros.map(b => ({
              settingsId: existing.id,
              nome: b.nome,
              taxa: Number(b.taxa || 0) // Segurança extra aqui também
            }))
          })
        }
      }
    })

    // Revalidação poderosa: Atualiza admin e o site público
    revalidatePath("/admin/configuracoes")
    revalidatePath("/admin")
    revalidatePath("/") 

    return { success: true }

  } catch (error) {
    console.error("Erro ao salvar:", error)
    return { success: false, error: "Falha ao salvar configurações" }
  }
}