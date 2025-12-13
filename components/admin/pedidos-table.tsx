"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle2, XCircle, Clock, Truck } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { updateOrderStatus, deleteOrder } from "@/app/_actions/orders"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface Pedido {
  id: number
  customer_name: string
  total_amount: string | number
  status: "pending" | "confirmed" | "delivered" | "canceled"
  created_at: string
  items: any[]
}

interface PedidosTableProps {
  pedidos: Pedido[]
}

export function PedidosTable({ pedidos }: PedidosTableProps) {
  const [isUpdating, setIsUpdating] = useState<number | null>(null)

  const handleStatusChange = async (id: number, newStatus: string) => {
    setIsUpdating(id)
    try {
      const result = await updateOrderStatus(id, newStatus)
      if (!result.success) {
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
      if (!result.success) {
        alert("Erro ao deletar pedido")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao deletar pedido")
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" /> Pendente
          </Badge>
        )
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmado
          </Badge>
        )
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Truck className="w-3 h-3 mr-1" /> Entregue
          </Badge>
        )
      case "canceled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" /> Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Itens (Resumo)</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">#{pedido.id}</TableCell>
              <TableCell>{pedido.customer_name}</TableCell>
              <TableCell>
                {new Date(pedido.created_at).toLocaleDateString("pt-BR")}
                <span className="text-xs text-muted-foreground block">
                  {new Date(pedido.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                {pedido.items && pedido.items.length > 0
                  ? pedido.items.map((i) => `${i.quantity}x ${i.product_name || "Item"}`).join(", ")
                  : "Sem detalhes"}
              </TableCell>
              <TableCell className="font-bold">{formatCurrency(Number(pedido.total_amount))}</TableCell>
              <TableCell>{getStatusBadge(pedido.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating === pedido.id}>
                      <span className="sr-only">Menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleStatusChange(pedido.id, "confirmed")}>
                      ✅ Confirmar Pedido
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(pedido.id, "delivered")}>
                      🚚 Marcar Entregue
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(pedido.id, "canceled")}
                      className="text-red-600"
                    >
                      🚫 Cancelar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(pedido.id)} className="text-red-600">
                      <Trash2 className="w-3 h-3 mr-2" /> Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
