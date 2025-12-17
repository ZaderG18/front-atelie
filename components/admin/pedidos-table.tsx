"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PrintOrderButton } from "@/components/admin/orders/print-button" // <--- 1. Já estava aqui
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle2, XCircle, Clock, Truck, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { deleteOrder } from "@/app/_actions/orders"
import { useState } from "react"

// Interface dos dados como chegam na tabela
interface Pedido {
  id: number
  customer_name: string
  total_amount: string | number
  status: string 
  created_at: string
  origin: string // <--- Adicionei pois é usado na impressão
  items: any[]
  // Adicionei campos opcionais que podem vir do banco para facilitar o mapeamento
  customerName?: string
  totalAmount?: number | string
  createdAt?: Date | string
  deliveryAddress?: string | null
  deliveryFee?: number | string | null
  paymentMethod?: string
  notes?: string | null
}

interface PedidosTableProps {
  pedidos: Pedido[]
  onStatusChange: (id: number, status: string) => Promise<any>
  settings: any // <--- 2. Recebe as configurações da loja
}

export function PedidosTable({ pedidos, onStatusChange, settings }: PedidosTableProps) {
  const [isUpdating, setIsUpdating] = useState<number | null>(null)

  const handleStatusChange = async (id: number, newStatus: string) => {
    setIsUpdating(id)
    try {
      const result = await onStatusChange(id, newStatus)
      if (result && result.success === false) {
        alert("Erro ao atualizar status")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao atualizar status")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este pedido?")) return
    setIsUpdating(id)
    try {
      const result = await deleteOrder(id)
      if (!result.success) alert("Erro ao deletar pedido")
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao deletar pedido")
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": // Ajustado para maiúsculo (padrão Prisma)
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>
      case "CONFIRMED":
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Confirmado</Badge>
      case "DELIVERED":
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0"><Truck className="w-3 h-3 mr-1" /> Entregue</Badge>
      case "CANCELED":
      case "canceled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0"><XCircle className="w-3 h-3 mr-1" /> Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Itens (Resumo)</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => {
            // 3. TRUQUE DE MAPEAMENTO PARA O BOTÃO
            // Recriamos o objeto no formato que o componente de impressão espera (camelCase)
            const orderForPrint: any = {
                ...pedido,
                customerName: pedido.customer_name || pedido.customerName,
                totalAmount: pedido.total_amount || pedido.totalAmount,
                createdAt: pedido.created_at || pedido.createdAt,
                // Mapeia itens garantindo nomes corretos
                items: pedido.items.map((i: any) => ({
                    ...i,
                    productName: i.product_name || i.productName,
                    unitPrice: i.price || i.unitPrice,
                    totalPrice: (i.price || i.unitPrice) * i.quantity
                }))
            }

            return (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">#{pedido.id}</TableCell>
              <TableCell className="font-medium">{pedido.customer_name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                    <span className="text-sm">{new Date(pedido.created_at).toLocaleDateString("pt-BR")}</span>
                    <span className="text-xs text-muted-foreground">{new Date(pedido.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] text-sm text-muted-foreground">
                <span className="truncate block" title={pedido.items && pedido.items.length > 0 ? pedido.items.map((i: any) => `${i.quantity}x ${i.product_name}`).join(", ") : ""}>
                    {pedido.items && pedido.items.length > 0
                    ? pedido.items.map((i: any) => `${i.quantity}x ${i.product_name || "Item"}`).join(", ")
                    : "Sem detalhes"}
                </span>
              </TableCell>
              <TableCell className="font-bold">{formatCurrency(Number(pedido.total_amount))}</TableCell>
              <TableCell>{getStatusBadge(pedido.status)}</TableCell>
              
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    
                    {/* ✅ BOTÃO DE IMPRIMIR AQUI */}
                    <PrintOrderButton order={orderForPrint} settings={settings} />

                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating === pedido.id}>
                        <span className="sr-only">Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(pedido.id, "CONFIRMED")}>
                        <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> Confirmar Pedido
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(pedido.id, "DELIVERED")}>
                        <Truck className="w-4 h-4 mr-2 text-green-500" /> Marcar Entregue
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(pedido.id, "CANCELED")} className="text-red-600 focus:text-red-600">
                        <XCircle className="w-4 h-4 mr-2" /> Cancelar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(pedido.id)} className="text-red-600 focus:text-red-600 border-t mt-1">
                        <Trash2 className="w-4 h-4 mr-2" /> Deletar Pedido
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  )
}