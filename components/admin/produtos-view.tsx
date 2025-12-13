"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProdutoModal } from "@/components/admin/produto-modal"
import { saveProduct, deleteProduct, toggleProductVisibility } from "@/app/_actions/products"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, Search } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import Image from "next/image"

// Interface unificada
interface Produto {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  is_made_to_order: boolean
  isActive?: boolean
}

interface ProdutosViewProps {
  initialProdutos: Produto[]
}

export function ProdutosView({ initialProdutos }: ProdutosViewProps) {
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = produtos.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSaveProduto = async (data: any) => {
    // Monta o payload final para a Server Action
    const payload = {
        id: produtoEditando?.id,
        name: data.nome,
        description: data.descricao,
        sale_price: data.preco,
        category: data.categoria,
        image_url: data.imagem,
        is_made_to_order: data.sobEncomenda,
        is_active: data.visivelVitrine
    }

    const result = await saveProduct(payload)

    if (result.success) {
      toast.success(produtoEditando ? "Produto atualizado!" : "Produto criado!")
      setIsModalOpen(false)
      setProdutoEditando(null)
      window.location.reload()
    } else {
      toast.error("Erro ao salvar: " + result.error)
    }
  }

  // CORRIGIDO: O nome da função agora é consistente
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    
    const result = await deleteProduct(id)
    if (result.success) {
        toast.success("Produto removido.")
        setProdutos(produtos.filter(p => p.id !== id))
    } else {
        toast.error("Erro ao remover.")
    }
  }

  const handleToggleVitrine = async (id: number, currentStatus: boolean) => {
      const result = await toggleProductVisibility(id, currentStatus)
      if (result.success) {
          toast.success("Visibilidade alterada.")
          setProdutos(produtos.map(p => 
            p.id === id ? { ...p, isActive: !currentStatus } : p
          ))
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
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Buscar por nome ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-white"
                />
            </div>

            <div className="border rounded-lg bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[80px]">Imagem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-100 border">
                            <Image 
                                src={product.image || "/placeholder-cake.jpg"} 
                                alt={product.name} 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                        <Badge variant="outline" className="capitalize">
                            {product.category}
                        </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                            {product.isActive === false ? (
                                <Badge variant="destructive">Oculto</Badge>
                            ) : (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600">Vitrine</Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleToggleVitrine(product.id, !!product.isActive)}
                                title={product.isActive !== false ? "Ocultar da Vitrine" : "Mostrar na Vitrine"}
                            >
                                {product.isActive !== false ? (
                                    <Eye className="w-4 h-4 text-slate-500" />
                                ) : (
                                    <EyeOff className="w-4 h-4 text-slate-400" />
                                )}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduto(product)}>
                            <Edit className="w-4 h-4 text-blue-500" />
                            </Button>
                            {/* CORRIGIDO: Chama a função correta */}
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                                Nenhum produto encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
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