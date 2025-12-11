"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { InsumosTable } from "@/components/admin/insumos-table"
import { InsumoModal } from "@/components/admin/insumo-modal"
import type { Insumo } from "@/lib/admin-types"
import { API_URL } from "@/lib/api-config"

const MOCK_INSUMOS: Insumo[] = [
  {
    id: "1",
    nome: "Farinha de Trigo Premium",
    unidade: "kg",
    custoUnitario: 5.5,
    estoqueAtual: 25,
    estoqueMinimo: 10,
    status: "em_estoque",
  },
  {
    id: "2",
    nome: "Açúcar Refinado",
    unidade: "kg",
    custoUnitario: 4.2,
    estoqueAtual: 30,
    estoqueMinimo: 15,
    status: "em_estoque",
  },
  {
    id: "3",
    nome: "Leite Condensado",
    unidade: "un",
    custoUnitario: 7.9,
    estoqueAtual: 48,
    estoqueMinimo: 20,
    status: "em_estoque",
  },
  {
    id: "4",
    nome: "Chocolate em Pó 50%",
    unidade: "kg",
    custoUnitario: 32.0,
    estoqueAtual: 3,
    estoqueMinimo: 5,
    status: "critico",
  },
  {
    id: "5",
    nome: "Manteiga sem Sal",
    unidade: "kg",
    custoUnitario: 45.0,
    estoqueAtual: 8,
    estoqueMinimo: 5,
    status: "em_estoque",
  },
  {
    id: "6",
    nome: "Ovos Caipiras",
    unidade: "un",
    custoUnitario: 1.2,
    estoqueAtual: 60,
    estoqueMinimo: 30,
    status: "em_estoque",
  },
  {
    id: "7",
    nome: "Creme de Leite Fresco",
    unidade: "L",
    custoUnitario: 18.5,
    estoqueAtual: 4,
    estoqueMinimo: 8,
    status: "critico",
  },
  {
    id: "8",
    nome: "Essência de Baunilha",
    unidade: "ml",
    custoUnitario: 0.15,
    estoqueAtual: 500,
    estoqueMinimo: 200,
    status: "em_estoque",
  },
  {
    id: "9",
    nome: "Fermento em Pó",
    unidade: "g",
    custoUnitario: 0.08,
    estoqueAtual: 800,
    estoqueMinimo: 300,
    status: "em_estoque",
  },
  {
    id: "10",
    nome: "Leite Integral",
    unidade: "L",
    custoUnitario: 5.8,
    estoqueAtual: 12,
    estoqueMinimo: 10,
    status: "em_estoque",
  },
]

export default function InsumosPage() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(false)

  const fetchInsumos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ingredients`)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API não retornou JSON válido")
      }

      const data = await response.json()

      const mappedData = data.map((item: any) => ({
        id: item.id.toString(),
        nome: item.name,
        unidade: item.unit,
        custoUnitario: Number(item.cost_price),
        estoqueAtual: Number(item.stock_quantity),
        estoqueMinimo: Number(item.min_stock_alert || 0),
        status: Number(item.stock_quantity) < Number(item.min_stock_alert) ? "critico" : "em_estoque",
      }))

      setInsumos(mappedData)
      setIsUsingMockData(false)
    } catch (error) {
      console.error("Erro ao buscar insumos, usando dados locais:", error)
      setInsumos(MOCK_INSUMOS)
      setIsUsingMockData(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInsumos()
  }, [])

  const handleSaveInsumo = async (dadosInsumo: Omit<Insumo, "id" | "status">) => {
    if (isUsingMockData) {
      const novoInsumo: Insumo = {
        id: editingInsumo?.id || Date.now().toString(),
        ...dadosInsumo,
        status: dadosInsumo.estoqueAtual < dadosInsumo.estoqueMinimo ? "critico" : "em_estoque",
      }

      if (editingInsumo) {
        setInsumos(insumos.map((i) => (i.id === editingInsumo.id ? novoInsumo : i)))
      } else {
        setInsumos([...insumos, novoInsumo])
      }

      setIsModalOpen(false)
      setEditingInsumo(null)
      return
    }

    try {
      const payload = {
        name: dadosInsumo.nome,
        unit: dadosInsumo.unidade,
        cost_price: dadosInsumo.custoUnitario,
        stock_quantity: dadosInsumo.estoqueAtual,
        min_stock_alert: dadosInsumo.estoqueMinimo,
      }

      let url = `${API_URL}/api/ingredients`
      let method = "POST"

      if (editingInsumo) {
        url = `${url}/${editingInsumo.id}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchInsumos()
        setIsModalOpen(false)
        setEditingInsumo(null)
      } else {
        const errorData = await response.json()
        console.error("Erro do Laravel:", errorData)
        alert("Erro ao salvar. Verifique os dados.")
      }
    } catch (error) {
      console.error("Erro de conexão:", error)
    }
  }

  const handleDeleteInsumo = async (id: string) => {
    if (isUsingMockData) {
      setInsumos(insumos.filter((i) => i.id !== id))
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/ingredients/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      })

      if (response.ok) {
        setInsumos(insumos.filter((i) => i.id !== id))
      } else {
        const data = await response.json()
        alert(data.message || "Erro ao excluir ingrediente.")
      }
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const handleNovoInsumo = () => {
    setEditingInsumo(null)
    setIsModalOpen(true)
  }

  const handleEditInsumo = (insumo: Insumo) => {
    setEditingInsumo(insumo)
    setIsModalOpen(true)
  }

  return (
    // DARK MODE: Fundo escuro
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="insumos" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Gerenciar Insumos" actionLabel="Novo Insumo" onAction={handleNovoInsumo} />

        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 dark:text-slate-400">Carregando estoque...</div>
          ) : (
            <InsumosTable insumos={insumos} onEdit={handleEditInsumo} onDelete={handleDeleteInsumo} />
          )}
        </main>
      </div>

      <InsumoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingInsumo(null)
        }}
        onSave={handleSaveInsumo}
        insumo={editingInsumo}
      />
    </div>
  )
}
