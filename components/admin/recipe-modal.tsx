"use client"

import { useState, useEffect, useMemo } from "react"
import {
  FlaskConical,
  Plus,
  Trash2,
  Search,
  Loader2,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

import { formatCurrency } from "@/lib/utils"
import {
  getProductRecipe,
  addIngredientToRecipe,
  removeIngredientFromRecipe,
} from "@/app/_actions/recipe"

import { toast } from "sonner"

/* =====================================================
   Types
===================================================== */
interface Ingredient {
  id: number
  name: string
  unit: string
  costPrice: number
}

interface RecipeItem {
  id: number
  ingredientId: number
  name: string
  unit: string
  quantity: number
  cost: number
}

interface RecipeModalProps {
  isOpen: boolean
  onClose: () => void
  productId: number
  productName: string
  availableIngredients: Ingredient[]
}

/* =====================================================
   Component
===================================================== */
export function RecipeModal({
  isOpen,
  onClose,
  productId,
  productName,
  availableIngredients,
}: RecipeModalProps) {
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([])
  const [selectedIngredientId, setSelectedIngredientId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  /* =====================================================
     Load Recipe (Blindado)
  ===================================================== */
  useEffect(() => {
    if (!isOpen || !productId) return

    let mounted = true

    async function load() {
      setIsLoading(true)
      try {
        const items = await getProductRecipe(productId)
        if (mounted) setRecipeItems(items)
      } catch {
        toast.error("Erro ao carregar receita")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [isOpen, productId])

  /* =====================================================
     Helpers
  ===================================================== */
  const filteredIngredients = useMemo(() => {
    return availableIngredients.filter((ing) =>
      ing.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [availableIngredients, searchTerm])

  const totalCost = useMemo(() => {
    return recipeItems.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0,
    )
  }, [recipeItems])

  /* =====================================================
     Actions
  ===================================================== */
  async function handleAddIngredient() {
    const ingredientId = Number(selectedIngredientId)
    const qty = Number(quantity)

    if (!ingredientId || qty <= 0) {
      toast.warning("Quantidade inválida")
      return
    }

    const alreadyExists = recipeItems.some(
      (item) => item.ingredientId === ingredientId,
    )

    if (alreadyExists) {
      toast.warning("Ingrediente já adicionado à receita")
      return
    }

    setIsAdding(true)

    const result = await addIngredientToRecipe(
      productId,
      ingredientId,
      qty,
    )

    if (result.success) {
      toast.success("Ingrediente adicionado!")
      setQuantity("")
      setSelectedIngredientId("")
      const updated = await getProductRecipe(productId)
      setRecipeItems(updated)
    } else {
      toast.error(result.error || "Erro ao adicionar ingrediente")
    }

    setIsAdding(false)
  }

  async function handleRemoveItem(id: number) {
    const previous = [...recipeItems]
    setRecipeItems((prev) => prev.filter((i) => i.id !== id))

    const result = await removeIngredientFromRecipe(id)

    if (!result.success) {
      toast.error("Erro ao remover ingrediente")
      setRecipeItems(previous)
    } else {
      toast.success("Ingrediente removido")
    }
  }

  /* =====================================================
     Render
  ===================================================== */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-600" />
            <DialogTitle>
              Ficha Técnica:
              <span className="text-purple-700 ml-1">{productName}</span>
            </DialogTitle>
          </div>
          <DialogDescription>
            Gerencie os ingredientes e o custo de produção.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Adição */}
          <div className="border rounded-lg p-4 bg-slate-50">
            <Label className="font-semibold mb-3 block">
              Adicionar Ingrediente
            </Label>

            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-12 sm:col-span-6 space-y-2">
                <Label className="text-xs">Ingrediente</Label>
                <Select
                  value={selectedIngredientId}
                  onValueChange={setSelectedIngredientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 sticky top-0 bg-white border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Buscar..."
                          value={searchTerm}
                          onChange={(e) =>
                            setSearchTerm(e.target.value)
                          }
                          className="pl-8 h-9"
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {filteredIngredients.map((ing) => (
                      <SelectItem
                        key={ing.id}
                        value={ing.id.toString()}
                      >
                        {ing.name} ({ing.unit}) •{" "}
                        {formatCurrency(ing.costPrice)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label className="text-xs">Quantidade</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleAddIngredient}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Tabela */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : recipeItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Nenhum ingrediente adicionado
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingrediente</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">
                      Quantidade
                    </TableHead>
                    <TableHead className="text-right">
                      Custo
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipeItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.unit}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity.toFixed(3)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          item.cost * item.quantity,
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveItem(item.id)
                          }
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div>
              <p className="text-sm font-medium text-purple-700">
                Custo Total de Produção
              </p>
              <p className="text-xs text-purple-600">
                {recipeItems.length} ingrediente(s)
              </p>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {formatCurrency(totalCost)}
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Concluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
