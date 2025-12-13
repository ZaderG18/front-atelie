"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { InsumosTable } from "@/components/admin/insumos-table"
import { InsumoModal } from "@/components/admin/insumo-modal"
import { saveIngredient, deleteIngredient } from "@/app/_actions/ingredients" // Actions
import type { Insumo } from "@/lib/admin-types" // Certifique-se que esse tipo existe ou defina aqui
import { toast } from "sonner" // Ou use alert padrão

interface InsumosViewProps {
  initialInsumos: Insumo[]
}

export function InsumosView({ initialInsumos }: InsumosViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)

  // Abertura do Modal (Novo)
  const handleNovoInsumo = () => {
    setEditingInsumo(null)
    setIsModalOpen(true)
  }

  // Abertura do Modal (Edição)
  const handleEditInsumo = (insumo: Insumo) => {
    setEditingInsumo(insumo)
    setIsModalOpen(true)
  }

  // Salvar (Chama Server Action)
  const handleSaveInsumo = async (dados: any) => {
    const result = await saveIngredient({
      id: editingInsumo?.id,
      ...dados
    })

    if (result.success) {
      toast.success("Ingrediente salvo com sucesso!")
      setIsModalOpen(false)
      setEditingInsumo(null)
    } else {
      toast.error("Erro ao salvar: " + result.error)
    }
  }

  // Deletar (Chama Server Action)
  const handleDeleteInsumo = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return

    const result = await deleteIngredient(id)
    if (result.success) {
      toast.success("Item removido.")
    } else {
      toast.error("Erro ao remover.")
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="insumos" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          title="Gerenciar Insumos" 
          actionLabel="Novo Insumo" 
          onAction={handleNovoInsumo} 
        />

        <main className="flex-1 overflow-y-auto p-6">
          <InsumosTable 
            insumos={initialInsumos} 
            onEdit={handleEditInsumo} 
            onDelete={handleDeleteInsumo} 
          />
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