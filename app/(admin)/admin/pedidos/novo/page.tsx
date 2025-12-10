"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Save } from "lucide-react"
import { API_URL } from "@/lib/api-config"

export default function NovoPedidoPage() {
  const router = useRouter()
  const [produtos, setProdutos] = useState<any[]>([])
  
  // Estado do Formulário
  const [cliente, setCliente] = useState("")
  const [origem, setOrigem] = useState("whatsapp")
  const [pagamento, setPagamento] = useState("pix")
  const [obs, setObs] = useState("")
  
  // Estado do Carrinho (Itens do Pedido)
  const [itens, setItens] = useState<any[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState("")
  const [qtd, setQtd] = useState(1)

  // 1. Carregar Produtos para o Select
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(err => console.error("Erro ao carregar produtos:", err))
  }, [])

  // 2. Adicionar Item na Lista
  const handleAddItem = () => {
    if (!produtoSelecionado) return
    const produto = produtos.find(p => p.id.toString() === produtoSelecionado)
    if (!produto) return

    const novoItem = {
      product_id: produto.id,
      product_name: produto.name,
      price: Number(produto.sale_price),
      quantity: qtd,
      total: Number(produto.sale_price) * qtd
    }

    setItens([...itens, novoItem])
    setProdutoSelecionado("") // Limpa seleção
    setQtd(1)
  }

  // 3. Remover Item
  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  // 4. Calcular Total
  const totalPedido = itens.reduce((acc, item) => acc + item.total, 0)

  // 5. Salvar Pedido
  const handleSalvar = async () => {
    if (!cliente || itens.length === 0) {
      alert("Preencha o cliente e adicione pelo menos um item.")
      return
    }

    const payload = {
      customer_name: cliente,
      total_amount: totalPedido,
      status: "confirmed", // Se ela está lançando, já está confirmado
      origin: origem,
      payment_method: pagamento,
      notes: obs,
      items: itens
    }

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert("Pedido salvo com sucesso!")
        router.push("/admin/pedidos") // Volta para a lista
      } else {
        const erro = await res.json()
        console.error(erro)
        alert("Erro ao salvar pedido.")
      }
    } catch (error) {
      console.error(error)
      alert("Erro de conexão.")
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="pedidos" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Novo Pedido (Manual)" />
        
        <main className="flex-1 overflow-y-auto p-6">
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
                          <SelectItem value="balcao">Balcão / Pessoalmente</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
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
                          {produtos.map(p => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name} - R$ {Number(p.sale_price).toFixed(2)}
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
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              R$ {item.total.toFixed(2).replace('.', ',')}
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
                      R$ {totalPedido.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <Button 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                    onClick={handleSalvar}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Confirmar Pedido
                  </Button>

                </CardContent>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}