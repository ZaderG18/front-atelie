"use client"

import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Printer, Palette, FileText } from "lucide-react"
import { OrderReceipt } from "./order-receipt"
import { Order, OrderItem } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Interfaces para garantir a tipagem correta
interface OrderWithItems extends Order {
  items: OrderItem[]
}

interface PrintOrderButtonProps {
  order: OrderWithItems
  settings: any
}

export function PrintOrderButton({ order, settings }: PrintOrderButtonProps) {
  const [open, setOpen] = useState(false)
  
  // Criamos DUAS referências. Uma para cada tipo de nota.
  const colorRef = useRef<HTMLDivElement>(null)
  const bwRef = useRef<HTMLDivElement>(null)

  // Função para imprimir Colorido
  const printColor = useReactToPrint({
    contentRef: colorRef,
    documentTitle: `Pedido-${order.id}-Color`,
    onAfterPrint: () => setOpen(false)
  })

  // Função para imprimir P&B
  const printBW = useReactToPrint({
    contentRef: bwRef,
    documentTitle: `Pedido-${order.id}-PB`,
    onAfterPrint: () => setOpen(false)
  })

  if (!order) return null

  return (
    <>
      {/* 1. Recibo Colorido (Escondido) - Passando mode="color" */}
      <div style={{ display: "none" }}>
        <OrderReceipt 
            ref={colorRef} 
            order={order} 
            settings={settings} 
            mode="color" // <--- O ERRO ESTAVA AQUI (Faltava essa prop)
        />
      </div>

      {/* 2. Recibo Preto e Branco (Escondido) - Passando mode="bw" */}
      <div style={{ display: "none" }}>
        <OrderReceipt 
            ref={bwRef} 
            order={order} 
            settings={settings} 
            mode="bw" // <--- E AQUI TAMBÉM
        />
      </div>

      {/* 3. O Botão e o Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Imprimir comanda"
            className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Printer className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Imprimir Pedido #{order.id}</DialogTitle>
            <DialogDescription>
              Escolha o formato de impressão:
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Opção P&B */}
            <button
              onClick={() => printBW()}
              className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all group"
            >
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200">
                <FileText className="h-6 w-6 text-slate-700" />
              </div>
              <span className="font-bold text-slate-900">Toner (P&B)</span>
              <span className="text-xs text-slate-500 mt-1">Economia de tinta</span>
            </button>

            {/* Opção Colorida */}
            <button
              onClick={() => printColor()}
              className="flex flex-col items-center justify-center p-4 border-2 border-pink-100 rounded-xl hover:bg-pink-50 hover:border-pink-300 transition-all group"
            >
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-3 group-hover:bg-pink-200">
                <Palette className="h-6 w-6 text-pink-600" />
              </div>
              <span className="font-bold text-pink-900">Jato de Tinta</span>
              <span className="text-xs text-pink-500 mt-1">Colorido e Visual</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}