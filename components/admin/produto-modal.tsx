"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Categorias hardcoded para não depender de arquivo externo
const categoriasConfig = {
  "bolos_festivos": "Bolos Festivos",
  "bolos_no_pote": "Bolos de Pote",
  "docinhos": "Docinhos",
  "salgados": "Salgados",
  "bebidas": "Bebidas",
  "kits_festa": "Kits Festa"
}

// Interface alinhada com o Banco de Dados (Prisma)
interface Produto {
  id?: number
  name: string
  description: string
  price: number
  category: string
  image: string
  is_made_to_order: boolean
  isActive?: boolean
}

interface ProdutoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  produto: Produto | null
}

export function ProdutoModal({ isOpen, onClose, onSave, produto }: ProdutoModalProps) {
  // Estados locais do formulário
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [categoria, setCategoria] = useState("bolos_festivos")
  const [sobEncomenda, setSobEncomenda] = useState(false)
  const [visivelVitrine, setVisivelVitrine] = useState(true)
  
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [arquivoImagem, setArquivoImagem] = useState<File | null>(null) 
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (produto) {
      // CORREÇÃO: Mapeia do Inglês (Banco) para os estados do Form
      setNome(produto.name)
      setDescricao(produto.description || "")
      setPreco(produto.price ? produto.price.toString() : "")
      // Tenta achar a chave da categoria pelo nome, ou usa o slug direto
      setCategoria(produto.category || "bolos_festivos") 
      setSobEncomenda(produto.is_made_to_order)
      setVisivelVitrine(produto.isActive !== false)
      setImagemPreview(produto.image)
      setArquivoImagem(null)
    } else {
      // Limpa o form
      setNome("")
      setDescricao("")
      setPreco("")
      setCategoria("bolos_festivos")
      setSobEncomenda(false)
      setVisivelVitrine(true)
      setImagemPreview(null)
      setArquivoImagem(null)
    }
  }, [produto, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArquivoImagem(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagemPreview(null)
    setArquivoImagem(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Devolve os dados formatados para o Pai
    onSave({
      nome, 
      descricao,
      preco: Number.parseFloat(preco), 
      categoria,
      imagem: imagemPreview,
      arquivoImagem: arquivoImagem, // Manda o arquivo se tiver
      sobEncomenda,
      visivelVitrine,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
             {produto ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>Preencha os detalhes do produto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          
          {/* Upload de Imagem */}
          <div className="space-y-2">
            <Label className="text-slate-700">Imagem do Produto</Label>
            <div className="flex items-start gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 cursor-pointer flex flex-col items-center justify-center bg-slate-50 transition-colors"
              >
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500">Upload</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              
              {imagemPreview && (
                <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-200">
                  <Image src={imagemPreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-slate-700">Nome do Produto</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          {/* Preço e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco" className="text-slate-700">Preço de Venda (R$)</Label>
              <Input id="preco" type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-slate-700">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoriasConfig).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-slate-700">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
          </div>

          {/* Configurações */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <Label className="text-slate-700 font-medium">Configurações</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sobEncomenda">Sob Encomenda?</Label>
                <p className="text-xs text-slate-500">Requer tempo de preparo</p>
              </div>
              <Switch id="sobEncomenda" checked={sobEncomenda} onCheckedChange={setSobEncomenda} className="data-[state=checked]:bg-blue-600"/>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="visivelVitrine">Exibir na Vitrine?</Label>
                <p className="text-xs text-slate-500">Visível para clientes</p>
              </div>
              <Switch id="visivelVitrine" checked={visivelVitrine} onCheckedChange={setVisivelVitrine} className="data-[state=checked]:bg-blue-600"/>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}