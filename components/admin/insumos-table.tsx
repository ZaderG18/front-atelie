"use client"

import { AlertTriangle, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import type { Insumo } from "@/lib/admin-types"

interface InsumosTableProps {
  insumos: Insumo[]
  onEdit: (insumo: Insumo) => void
  onDelete: (id: string) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function formatQuantity(value: number, unit: string): string {
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: unit === "un" ? 0 : 1, maximumFractionDigits: 3 })} ${unit}`
}

export function InsumosTable({ insumos, onEdit, onDelete }: InsumosTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700">Nome</TableHead>
            <TableHead className="font-semibold text-slate-700">Unidade</TableHead>
            <TableHead className="font-semibold text-slate-700">Custo Unitário</TableHead>
            <TableHead className="font-semibold text-slate-700">Estoque Atual</TableHead>
            <TableHead className="font-semibold text-slate-700">Status</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insumos.map((insumo) => (
            <TableRow key={insumo.id} className="hover:bg-slate-50/50">
              <TableCell className="font-medium text-slate-900">{insumo.nome}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                  {insumo.unidade}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">
                {formatCurrency(insumo.custoUnitario)} / {insumo.unidade}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">{formatQuantity(insumo.estoqueAtual, insumo.unidade)}</span>
                  {insumo.status === "critico" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                </div>
              </TableCell>
              <TableCell>
                {insumo.status === "em_estoque" ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Em Estoque</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Crítico</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(insumo)}
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
                        <AlertDialogTitle>Excluir insumo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir &quot;{insumo.nome}&quot;? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(insumo.id)} className="bg-red-600 hover:bg-red-700">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
