"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProdutosTable } from "@/components/admin/produtos-table"
import { ProdutoModal } from "@/components/admin/produto-modal"
import type { Produto } from "@/lib/admin-types"
import { saveProduct, deleteProduct, toggleProductVisibility } from "@/app/_actions/products"
import { toast } from "sonner"

interface ProdutosViewProps {
  initialProdutos: Produto[]
}

export function ProdutosView({ initialProdutos }: ProdutosViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)

  // 1. SALVAR (Adapta os dados do Modal para FormData e envia pro Server)
  const handleSaveProduto = async (data: Omit<Produto, "id"> & { arquivoImagem?: File | null }) => {
    const formData = new FormData()
    
    // Se for edição, mandamos o ID
    if (produtoEditando) {
        formData.append("id", produtoEditando.id)
    }

    formData.append("name", data.nome)
    formData.append("description", data.descricao)
    formData.append("sale_price", data.preco.toString())
    formData.append("category", data.categoria)
    formData.append("is_made_to_order", data.sobEncomenda ? "1" : "0")
    formData.append("is_active", data.visivelVitrine ? "1" : "0")
    
    if (data.arquivoImagem) {
      formData.append("image", data.arquivoImagem)
    }

    const result = await saveProduct(formData)

    if (result.success) {
      toast.success(produtoEditando ? "Produto atualizado!" : "Produto criado!")
      setIsModalOpen(false)
      setProdutoEditando(null)
    } else {
      toast.error("Erro ao salvar: " + result.error)
    }
  }

  // 2. DELETAR
  const handleDeleteProduto = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    
    const result = await deleteProduct(id)
    if (result.success) {
        toast.success("Produto removido.")
    } else {
        toast.error("Erro ao remover.")
    }
  }

  // 3. TOGGLE VISIBILIDADE
  const handleToggleVitrine = async (id: string) => {
      // Encontramos o produto para saber o status atual
      const prod = initialProdutos.find(p => p.id === id)
      if (!prod) return

      const result = await toggleProductVisibility(id, prod.visivelVitrine)
      if (result.success) {
          toast.success("Visibilidade alterada.")
      } else {
          toast.error("Erro ao alterar.")
      }
  }

  const handleNovoProduto = () => {
    setProdutoEditando(null)
    setIsModalOpen(true)
  }

  const handleEditProduto = (produto: Produto) => {
    setProdutoEditando(produto)
    setIsModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="produtos" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
            title="Gerenciar Produtos" 
            actionLabel="Novo Produto" 
            onAction={handleNovoProduto} 
        />

        <main className="flex-1 p-6 overflow-auto">
           {/* Tabela recebe os dados iniciais. 
               Como usamos Server Actions com revalidatePath, 
               a página recarrega os dados sozinha quando muda algo! */}
            <ProdutosTable
              produtos={initialProdutos}
              onEdit={handleEditProduto}
              onDelete={handleDeleteProduto}
              onToggleVitrine={handleToggleVitrine} 
            />
        </main>

        <ProdutoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setProdutoEditando(null)
          }}
          onSave={handleSaveProduto}
          produto={produtoEditando}
        />
      </div>
    </div>
  )
}