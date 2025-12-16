"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, Save } from "lucide-react"
import { createOrder } from "@/app/_actions/orders"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  price: number
}

interface OrderItem {
  product_id: number
  product_name: string
  price: number
  quantity: number
  total: number
}

interface NovoPedidoFormProps {
  products: Product[]
}

export function NovoPedidoForm({ products }: NovoPedidoFormProps) {
  const router = useRouter()

  // ==========================
  // Dados do Pedido
  // ==========================
  const [cliente, setCliente] = useState("")
  const [origem, setOrigem] = useState("whatsapp")
  const [pagamento, setPagamento] = useState("pix")
  const [obs, setObs] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ==========================
  // Itens
  // ==========================
  const [itens, setItens] = useState<OrderItem[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState("")
  const [qtd, setQtd] = useState(1)

  // ==========================
  // Total calculado SEMPRE
  // ==========================
  const totalPedido = useMemo(() => {
    return itens.reduce((acc, item) => acc + item.total, 0)
  }, [itens])

  // ==========================
  // Adicionar Item
  // ==========================
  const handleAddItem = () => {
    if (!produtoSelecionado || qtd <= 0) return

    const produto = products.find(
      (p) => p.id.toString() === produtoSelecionado
    )
    if (!produto) return

    setItens((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product_id === produto.id
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        const existing = updated[existingIndex]

        const newQuantity = existing.quantity + qtd
        updated[existingIndex] = {
          ...existing,
          quantity: newQuantity,
          total: newQuantity * existing.price,
        }

        return updated
      }

      return [
        ...prev,
        {
          product_id: produto.id,
          product_name: produto.name,
          price: produto.price,
          quantity: qtd,
          total: produto.price * qtd,
        },
      ]
    })

    setProdutoSelecionado("")
    setQtd(1)
  }

  // ==========================
  // Remover Item
  // ==========================
  const handleRemoveItem = (index: number) => {
    setItens((prev) => prev.filter((_, i) => i !== index))
  }

  // ==========================
  // Salvar Pedido
  // ==========================
  const handleSalvar = async () => {
    if (!cliente.trim()) {
      toast.error("Informe o nome do cliente.")
      return
    }

    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item.")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createOrder({
        customer_name: cliente,
        status: "confirmed",
        origin: origem,
        payment_method: pagamento,
        notes: obs,
        items: itens.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success("Pedido criado com sucesso!")
      router.push("/admin/pedidos")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar o pedido.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ===================== */}
      {/* Dados do Cliente */}
      {/* ===================== */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome do Cliente</Label>
            <Input
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ex: Maria do WhatsApp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Origem</Label>
              <Select value={origem} onValueChange={setOrigem}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="balcao">Balcão</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Pagamento</Label>
              <Select value={pagamento} onValueChange={setPagamento}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="money">Dinheiro</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Ex: entregar às 14h"
            />
          </div>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* Itens do Pedido */}
      {/* ===================== */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label>Produto</Label>
              <Select
                value={produtoSelecionado}
                onValueChange={setProdutoSelecionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name} • {formatCurrency(p.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-20">
              <Label>Qtd</Label>
              <Input
                type="number"
                min={1}
                value={qtd}
                onChange={(e) => setQtd(Number(e.target.value))}
              />
            </div>

            <Button onClick={handleAddItem}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    Nenhum item adicionado
                  </TableCell>
                </TableRow>
              )}

              {itens.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(idx)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between pt-4 border-t">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPedido)}
            </span>
          </div>

          <Button
            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
            onClick={handleSalvar}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Confirmar Pedido
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
