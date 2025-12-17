import React from "react"
import { Order, OrderItem } from "@prisma/client"
import { formatCurrency } from "@/lib/utils"

// Tipagem estendida para garantir que os itens venham junto
interface OrderWithItems extends Order {
  items: OrderItem[]
}

// Tipagem flexível para configurações (pode vir incompleta)
interface StoreSettingsPrint {
  geral?: {
    nomeConfeitaria?: string
    endereco?: string
    telefone?: string
  }
}

interface OrderReceiptProps {
  order: OrderWithItems
  settings: StoreSettingsPrint
}

// Tradução bonita dos enums
const ORIGIN_LABELS: Record<string, string> = {
  BALCAO: "RETIRADA NO BALCÃO",
  DELIVERY: "DELIVERY",
  ENCOMENDA: "ENCOMENDA",
  WHATSAPP: "PEDIDO VIA WHATSAPP",
  SITE: "PEDIDO PELO SITE",
  IFOOD: "IFOOD",
}

const PAYMENT_LABELS: Record<string, string> = {
  PIX: "PIX",
  CREDIT_CARD: "CARTÃO DE CRÉDITO",
  DEBIT_CARD: "CARTÃO DE DÉBITO",
  CASH: "DINHEIRO",
}

export const OrderReceipt = React.forwardRef<HTMLDivElement, OrderReceiptProps>(
  ({ order, settings }, ref) => {
    return (
      <div
        ref={ref}
        className="hidden print:block bg-white text-black font-mono text-sm p-8 max-w-[800px] mx-auto"
      >
        {/* --- CABEÇALHO --- */}
        <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider">
              {settings?.geral?.nomeConfeitaria || "Confeitaria"}
            </h1>
            <p className="text-xs mt-1">{settings?.geral?.endereco}</p>
            <p className="text-xs">Tel: {settings?.geral?.telefone}</p>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg">PEDIDO #{order.id}</p>
            <p className="text-xs text-gray-600">
              {new Date(order.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        {/* --- DADOS DO CLIENTE / ENTREGA --- */}
        <div className="grid grid-cols-2 gap-8 border-b border-dashed border-black pb-4 mb-4">
          <div>
            <p className="font-bold border-b border-black inline-block mb-1">CLIENTE</p>
            <p className="uppercase">{order.customerName}</p>
            {order.notes && (
                <div className="mt-2 text-xs italic bg-gray-50 p-1">
                    <span className="font-bold">Nota:</span> {order.notes}
                </div>
            )}
          </div>

          <div>
            <p className="font-bold border-b border-black inline-block mb-1">TIPO DE ENTREGA</p>
            <p className="font-bold uppercase text-base">
              {ORIGIN_LABELS[order.origin] ?? order.origin}
            </p>

            {order.deliveryAddress && (
              <div className="mt-2 border border-black p-2 bg-gray-50">
                <p className="font-bold text-xs">ENDEREÇO:</p>
                <p className="text-sm">{order.deliveryAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* --- ITENS --- */}
        <table className="w-full mb-6 text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 w-12 text-center">QTD</th>
              <th className="py-2">ITEM</th>
              <th className="py-2 text-right w-24">UNIT</th>
              <th className="py-2 text-right w-24">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-dotted border-gray-300">
                <td className="py-2 text-center font-bold align-top">{item.quantity}</td>
                <td className="py-2 align-top">
                  <p className="font-bold">{item.productName}</p>
                  {/* Detalhes opcionais (sabor, observação) */}
                  {(item.observation || item.doughId || item.fillingId) && (
                    <div className="text-xs text-gray-500 mt-0.5 ml-1">
                       {item.observation && <span>• Obs: {item.observation}</span>}
                    </div>
                  )}
                </td>
                <td className="py-2 text-right align-top text-gray-600">
                  {formatCurrency(Number(item.unitPrice))}
                </td>
                <td className="py-2 text-right font-bold align-top">
                  {formatCurrency(Number(item.totalPrice))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- TOTAIS --- */}
        <div className="flex justify-end mb-8">
          <div className="w-1/2 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>
                {formatCurrency(
                  Number(order.totalAmount) - Number(order.deliveryFee)
                )}
              </span>
            </div>

            {Number(order.deliveryFee) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Taxa de Entrega</span>
                <span>{formatCurrency(Number(order.deliveryFee))}</span>
              </div>
            )}

            <div className="flex justify-between font-bold border-t-2 border-black pt-2 text-lg">
              <span>TOTAL</span>
              <span>{formatCurrency(Number(order.totalAmount))}</span>
            </div>

            <div className="flex justify-between text-sm pt-2 items-center bg-gray-100 p-1">
              <span>Forma de Pagamento:</span>
              <span className="uppercase font-bold">
                {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* --- RODAPÉ --- */}
        <div className="text-center text-xs border-t border-black pt-4">
          <p className="font-bold mb-1">Obrigado pela preferência!</p>
          <p>{settings?.geral?.nomeConfeitaria}</p>
          <p className="text-[10px] text-gray-400 mt-2">
            Documento sem valor fiscal • Impresso em {new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
    )
  }
)

OrderReceipt.displayName = "OrderReceipt"