"use client"

import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Produto } from "@/lib/admin-types"
import { categoriasConfig } from "@/lib/admin-types"

interface ProdutosTableProps {
  produtos: Produto[]
  onEdit: (produto: Produto) => void
  onDelete: (id: string) => void
  onToggleVitrine: (id: string) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function ProdutosTable({ produtos, onEdit, onDelete, onToggleVitrine }: ProdutosTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700 w-16">Imagem</TableHead>
            <TableHead className="font-semibold text-slate-700">Nome</TableHead>
            <TableHead className="font-semibold text-slate-700">Categoria</TableHead>
            <TableHead className="font-semibold text-slate-700">Preço</TableHead>
            <TableHead className="font-semibold text-slate-700">Vitrine</TableHead>
            <TableHead className="font-semibold text-slate-700">Tipo</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => {
            const categoriaInfo = categoriasConfig[produto.categoria]
            return (
              <TableRow key={produto.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                    {produto.imagem ? (
                      <Image
                        src={produto.imagem || "/placeholder.svg"}
                        alt={produto.nome}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Sem img
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-900">{produto.nome}</TableCell>
                <TableCell>
                  <Badge className={`${categoriaInfo.cor} font-normal`}>{categoriaInfo.label}</Badge>
                </TableCell>
                <TableCell className="text-slate-600 font-medium">{formatCurrency(produto.preco)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={produto.visivelVitrine}
                      onCheckedChange={() => onToggleVitrine(produto.id)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-sm text-slate-500">{produto.visivelVitrine ? "Visível" : "Oculto"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {produto.sobEncomenda ? (
                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">Sob Encomenda</Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Pronta Entrega</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(produto)}
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir &quot;{produto.nome}&quot;? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(produto.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
