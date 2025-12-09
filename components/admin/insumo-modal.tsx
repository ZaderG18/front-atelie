"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Insumo } from "@/lib/admin-types"

interface InsumoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (insumo: Omit<Insumo, "id" | "status">) => void
  insumo: Insumo | null
}

const unidades = [
  { value: "kg", label: "Quilograma (kg)" },
  { value: "g", label: "Grama (g)" },
  { value: "L", label: "Litro (L)" },
  { value: "mL", label: "Mililitro (mL)" },
  { value: "un", label: "Unidade (un)" },
]

export function InsumoModal({ isOpen, onClose, onSave, insumo }: InsumoModalProps) {
  const [nome, setNome] = useState("")
  const [unidade, setUnidade] = useState<Insumo["unidade"]>("kg")
  const [custoUnitario, setCustoUnitario] = useState("")
  const [estoqueAtual, setEstoqueAtual] = useState("")
  const [estoqueMinimo, setEstoqueMinimo] = useState("")

  useEffect(() => {
    if (insumo) {
      setNome(insumo.nome)
      setUnidade(insumo.unidade)
      setCustoUnitario(insumo.custoUnitario.toString())
      setEstoqueAtual(insumo.estoqueAtual.toString())
      setEstoqueMinimo(insumo.estoqueMinimo.toString())
    } else {
      setNome("")
      setUnidade("kg")
      setCustoUnitario("")
      setEstoqueAtual("")
      setEstoqueMinimo("")
    }
  }, [insumo, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      nome,
      unidade,
      custoUnitario: Number.parseFloat(custoUnitario),
      estoqueAtual: Number.parseFloat(estoqueAtual),
      estoqueMinimo: Number.parseFloat(estoqueMinimo),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">{insumo ? "Editar Insumo" : "Novo Insumo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-slate-700">
              Nome do Insumo
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Farinha de Trigo Premium"
              required
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade" className="text-slate-700">
                Unidade
              </Label>
              <Select value={unidade} onValueChange={(v: string) => setUnidade(v as Insumo["unidade"])}>
                <SelectTrigger className="border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custoUnitario" className="text-slate-700">
                Custo Unitário (R$)
              </Label>
              <Input
                id="custoUnitario"
                type="number"
                step="0.01"
                min="0"
                value={custoUnitario}
                onChange={(e) => setCustoUnitario(e.target.value)}
                placeholder="0,00"
                required
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoqueAtual" className="text-slate-700">
                Estoque Atual
              </Label>
              <Input
                id="estoqueAtual"
                type="number"
                step="0.001"
                min="0"
                value={estoqueAtual}
                onChange={(e) => setEstoqueAtual(e.target.value)}
                placeholder="0"
                required
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoqueMinimo" className="text-slate-700">
                Estoque Mínimo
              </Label>
              <Input
                id="estoqueMinimo"
                type="number"
                step="0.001"
                min="0"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                placeholder="0"
                required
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-300 text-slate-700 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {insumo ? "Salvar Alterações" : "Criar Insumo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
