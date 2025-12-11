"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProdutosTable } from "@/components/admin/produtos-table"
import { ProdutoModal } from "@/components/admin/produto-modal"
import type { Produto } from "@/lib/admin-types"
import { API_URL } from "@/lib/api-config"

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)

  // 1. BUSCAR PRODUTOS
  const fetchProdutos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`)
      const data = await response.json()

      const mappedData = data.map((item: any) => ({
        id: item.id.toString(),
        nome: item.name,
        descricao: item.description || "",
        preco: Number(item.sale_price),
        categoria: item.category,
        imagem: item.image_url,
        sobEncomenda: Boolean(item.is_made_to_order),
        visivelVitrine: Boolean(item.is_active), 
      }))

      setProdutos(mappedData)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  // 2. SALVAR
  const handleSaveProduto = async (data: Omit<Produto, "id"> & { arquivoImagem?: File | null }) => {
    try {
      const formData = new FormData()
      formData.append("name", data.nome)
      formData.append("description", data.descricao)
      formData.append("sale_price", data.preco.toString())
      formData.append("category", data.categoria)
      formData.append("is_made_to_order", data.sobEncomenda ? "1" : "0")
      formData.append("is_active", data.visivelVitrine ? "1" : "0")
      
      if (data.arquivoImagem) {
        formData.append("image", data.arquivoImagem)
      }

      let url =`${API_URL}/api/products`
      let method = "POST"

      if (produtoEditando) {
        url = `${url}/${produtoEditando.id}`
        formData.append("_method", "PUT")
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Accept": "application/json" },
        body: formData
      })

      if (response.ok) {
        await fetchProdutos()
        setIsModalOpen(false)
        setProdutoEditando(null)
      } else {
        const errorData = await response.json()
        console.error("Erro do Laravel:", errorData)
        alert("Erro ao salvar produto. Verifique o console.")
      }
    } catch (error) {
      console.error("Erro de conexão:", error)
    }
  }

  // 3. DELETAR
  const handleDeleteProduto = async (id: string) => {
    if (!confirm("Tem certeza?")) return
    try {
      await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" })
      setProdutos(produtos.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Erro ao deletar:", error)
    }
  }

  // 4. TOGGLE (Visual por enquanto)
  const handleToggleVitrine = async (id: string) => {
     setProdutos(produtos.map(p => p.id === id ? {...p, visivelVitrine: !p.visivelVitrine} : p))
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
        {/* CORREÇÃO: Removemos o código errado que estava aqui dentro */}
        <AdminHeader 
            title="Gerenciar Produtos" 
            actionLabel="Novo Produto" 
            onAction={handleNovoProduto} 
        />

        <main className="flex-1 p-6 overflow-auto">
          {isLoading ? (
            <p className="text-center py-10 text-gray-500 dark:text-slate-400">Carregando vitrine...</p>
          ) : (
            <ProdutosTable
              produtos={produtos}
              onEdit={handleEditProduto}
              onDelete={handleDeleteProduto}
              onToggleVitrine={handleToggleVitrine} 
            />
          )}
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
