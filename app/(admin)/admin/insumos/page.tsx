"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { InsumosTable } from "@/components/admin/insumos-table"
import { InsumoModal } from "@/components/admin/insumo-modal"
import type { Insumo } from "@/lib/admin-types"
import { API_URL } from "@/lib/api-config"

export default function InsumosPage() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)

  const fetchInsumos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ingredients`)
      const data = await response.json()

      const mappedData = data.map((item: any) => ({
        id: item.id.toString(),
        nome: item.name,
        unidade: item.unit,
        custoUnitario: Number(item.cost_price),
        estoqueAtual: Number(item.stock_quantity),
        estoqueMinimo: Number(item.min_stock_alert || 0),
        status: Number(item.stock_quantity) < Number(item.min_stock_alert) 
          ? "critico" 
          : "em_estoque",
      }))

      setInsumos(mappedData)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar insumos:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInsumos()
  }, [])

  const handleSaveInsumo = async (dadosInsumo: Omit<Insumo, "id" | "status">) => {
    try {
      const payload = {
        name: dadosInsumo.nome,
        unit: dadosInsumo.unidade,
        cost_price: dadosInsumo.custoUnitario,
        stock_quantity: dadosInsumo.estoqueAtual,
        min_stock_alert: dadosInsumo.estoqueMinimo
      }

      let url = "http://127.0.0.1:8000/api/ingredients"
      let method = "POST"

      if (editingInsumo) {
        url = `${url}/${editingInsumo.id}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method: method,
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json" 
        },
        body: JSON.stringify(payload)
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
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/ingredients/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" } 
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
            <InsumosTable 
              insumos={insumos} 
              onEdit={handleEditInsumo} 
              onDelete={handleDeleteInsumo} 
            />
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