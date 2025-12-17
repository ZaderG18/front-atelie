"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { OrderReceipt } from "./order-receipt"
import { Order, OrderItem } from "@prisma/client"

interface OrderWithItems extends Order {
  items: OrderItem[]
}

interface PrintOrderButtonProps {
  order: OrderWithItems
  settings: any
}

export function PrintOrderButton({ order, settings }: PrintOrderButtonProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    // CORREÇÃO AQUI: Mudou de 'content' para 'contentRef'
    contentRef: componentRef,
    documentTitle: `Pedido-${order.id}-${order.customerName}`,
  })

  if (!order) return null

  return (
    <>
      {/* Componente oculto que serve de molde para impressão */}
      <div style={{ display: "none" }}>
        <OrderReceipt ref={componentRef} order={order} settings={settings} />
      </div>

      {/* Botão visível na interface */}
      <Button
        variant="ghost"
        size="icon"
        // O handlePrint agora pode ser chamado diretamente
        onClick={() => handlePrint()}
        title="Imprimir comanda"
        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
      >
        <Printer className="h-4 w-4" />
      </Button>
    </>
  )
} 