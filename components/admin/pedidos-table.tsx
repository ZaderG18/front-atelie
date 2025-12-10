"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

interface Pedido {
  id: number
  customer_name: string
  total_amount: string
  status: 'pending' | 'confirmed' | 'delivered' | 'canceled'
  created_at: string
  items: any[]
}

interface PedidosTableProps {
  pedidos: Pedido[]
  onStatusChange: (id: number, newStatus: string) => void
}

export function PedidosTable({ pedidos, onStatusChange }: PedidosTableProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1"/> Pendente</Badge>
      case "confirmed": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200"><CheckCircle2 className="w-3 h-3 mr-1"/> Confirmado</Badge>
      case "delivered": return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><Truck className="w-3 h-3 mr-1"/> Entregue</Badge>
      case "canceled": return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1"/> Cancelado</Badge>
      default: return <Badge variant="outline">{status}</Badge>
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
                {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                <span className="text-xs text-muted-foreground block">
                  {new Date(pedido.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                 {/* Mostra "2x Bolo, 1x Coxinha" ou "3 itens" */}
                 {pedido.items && pedido.items.length > 0 
                    ? pedido.items.map(i => `${i.quantity}x ${i.product_name || 'Item'}`).join(', ')
                    : "Sem detalhes"}
              </TableCell>
              <TableCell className="font-bold">
                {formatCurrency(Number(pedido.total_amount))}
              </TableCell>
              <TableCell>{getStatusBadge(pedido.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onStatusChange(pedido.id, 'confirmed')}>
                      ✅ Confirmar Pedido
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(pedido.id, 'delivered')}>
                      🚚 Marcar Entregue
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(pedido.id, 'canceled')} className="text-red-600">
                      🚫 Cancelar
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