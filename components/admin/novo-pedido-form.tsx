"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Save } from "lucide-react"
import { createOrder } from "@/app/_actions/orders" 
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner" 

// CORREÇÃO 1: Usamos 'price' aqui para bater com o componente pai
interface Product {
  id: number
  name: string
  price: number 
}

interface NovoPedidoFormProps {
  products: Product[]
}

export function NovoPedidoForm({ products }: NovoPedidoFormProps) {
  const router = useRouter()
  
  const [cliente, setCliente] = useState("")
  const [origem, setOrigem] = useState("whatsapp")
  const [pagamento, setPagamento] = useState("pix")
  const [obs, setObs] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [itens, setItens] = useState<any[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState("")
  const [qtd, setQtd] = useState(1)

  const handleAddItem = () => {
    if (!produtoSelecionado) return
    
    const produto = products.find(p => p.id.toString() === produtoSelecionado)
    if (!produto) return

    // CORREÇÃO 2: Usamos produto.price
    const novoItem = {
      product_id: produto.id,
      product_name: produto.name,
      price: Number(produto.price),
      quantity: qtd,
      total: Number(produto.price) * qtd
    }

    setItens([...itens, novoItem])
    setProdutoSelecionado("")
    setQtd(1)
  }

  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  const totalPedido = itens.reduce((acc, item) => acc + item.total, 0)

  const handleSalvar = async () => {
    if (!cliente || itens.length === 0) {
      toast.error("Preencha o cliente e adicione itens.")
      return
    }

    setIsSubmitting(true)

    const payload = {
      customer_name: cliente,
      total_amount: totalPedido,
      status: "confirmed", // A Action vai converter para CONFIRMED
      origin: origem,      // A Action vai converter para WHATSAPP...
      payment_method: pagamento,
      notes: obs,
      items: itens
    }

    try {
      const result = await createOrder(payload)

      if (result.success) {
        toast.success("Pedido criado com sucesso!")
        router.push("/admin/pedidos")
        router.refresh() // Força atualização dos dados
      } else {
        toast.error("Erro ao salvar: " + result.error)
      }
    } catch (error) {
      toast.error("Erro inesperado ao salvar.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Coluna da Esquerda: Dados do Cliente */}
      <div className="space-y-6">
        <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
          <CardHeader>
            <CardTitle>Dados do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome do Cliente</Label>
              <Input 
                placeholder="Ex: Maria do WhatsApp" 
                value={cliente} 
                onChange={e => setCliente(e.target.value)}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Origem</Label>
                <Select value={origem} onValueChange={setOrigem}>
                  <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
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
                  <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
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
                placeholder="Ex: Entregar às 14h, sem cebola..." 
                value={obs}
                onChange={e => setObs(e.target.value)}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coluna da Direita: Carrinho */}
      <div className="space-y-6">
        <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adicionar Produto */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Produto</Label>
                <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado}>
                  <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name} - {formatCurrency(p.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <Label>Qtd</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={qtd} 
                  onChange={e => setQtd(Number(e.target.value))}
                  className="dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Lista de Itens */}
            <div className="border rounded-md mt-4 dark:border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Nenhum item adicionado
                      </TableCell>
                    </TableRow>
                  )}
                  {itens.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(idx)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Total Final */}
            <div className="flex justify-between items-center pt-4 border-t dark:border-slate-800">
              <span className="text-lg font-bold">Total a Pagar</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(totalPedido)}
              </span>
            </div>

            <Button 
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
              onClick={handleSalvar}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : (
                <>
                  <Save className="w-5 h-5 mr-2" /> Confirmar Pedido
                </>
              )}
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}