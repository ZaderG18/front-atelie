import React from "react"
import { Order, OrderItem } from "@prisma/client"
import { formatCurrency } from "@/lib/utils"
// Importando as fontes do Google via Next.js
import { Dancing_Script, Nunito } from 'next/font/google'

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] })

interface OrderWithItems extends Order {
  items: OrderItem[]
}

interface StoreSettingsPrint {
  geral?: {
    nomeConfeitaria?: string
    endereco?: string
    telefone?: string
    logoUrl?: string // Vamos tentar usar a logo das configs
  }
}

interface OrderReceiptProps {
  order: OrderWithItems
  settings: StoreSettingsPrint
  mode: "color" | "bw"
}

const ORIGIN_LABELS: Record<string, string> = {
  BALCAO: "RETIRADA",
  DELIVERY: "DELIVERY",
  ENCOMENDA: "ENCOMENDA",
  WHATSAPP: "WHATSAPP",
  SITE: "SITE",
}

export const OrderReceipt = React.forwardRef<HTMLDivElement, OrderReceiptProps>(
  ({ order, settings, mode }, ref) => {
    
    const isColor = mode === "color"

    // --- PALETA DE CORES (Baseada na sua arte) ---
    // Rosa Forte: #E44D68 (Texto destaque, bordas)
    // Rosa Claro: #FFE4E1 (Fundos)
    // Marrom: #4A3B32 (Texto comum)
    
    const colors = {
      title: isColor ? "text-[#E44D68]" : "text-black",
      text: isColor ? "text-[#4A3B32]" : "text-black",
      border: isColor ? "border-[#E44D68]" : "border-black",
      bgHeader: isColor ? "bg-[#FFE4E1]" : "bg-gray-100", // Fundo dos títulos de seção
      bgInfo: isColor ? "bg-[#FAFAFA]" : "bg-white border border-gray-300", // Fundo do endereço
      price: isColor ? "text-[#E44D68]" : "text-black",
      tagText: isColor ? "text-[#E44D68]" : "text-black",
      tagBorder: isColor ? "border-[#E44D68]" : "border-black",
    }

    return (
      <div
        ref={ref}
        className={`hidden print:block bg-white p-8 mx-auto ${nunito.className}`}
        style={{ width: "100mm", maxWidth: "100%" }} // Largura estilo cupom largo / A4 centralizado
      >
        {/* --- CABEÇALHO --- */}
        <div className={`text-center border-b-2 border-dashed ${colors.border} pb-4 mb-4`}>
          {/* LOGO - Se tiver URL nas configs usa, senão tenta um placeholder ou nada */}
          {settings?.geral?.logoUrl && (
             <img 
               src={settings.geral.logoUrl} 
               alt="Logo" 
               className="w-24 h-24 mx-auto mb-2 object-contain"
             />
          )}

          <h1 className={`${dancingScript.className} text-3xl mb-2 ${colors.title}`}>
            {settings?.geral?.nomeConfeitaria || "Ateliê Aflorar Doces"}
          </h1>
          
          <div className={`text-xs leading-relaxed ${colors.text}`}>
            <p>{settings?.geral?.telefone || "(11) 9.4887-6030"}</p>
            <p>@atelieflorardoces</p>
            {/* Se quiser o email pode por aqui */}
          </div>
        </div>

        {/* --- DADOS DO CLIENTE --- */}
        <div className={`py-1 px-2 mb-2 rounded font-bold text-sm uppercase text-center ${colors.bgHeader} ${isColor ? "text-[#4A3B32]" : "text-black"}`}>
          Dados do Cliente
        </div>

        <div className={`mb-4 text-sm ${colors.text}`}>
          <div className="flex justify-between mb-1">
            <span className="font-bold">Cliente:</span>
            <span>{order.customerName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-bold">Pedido N°:</span>
            <span>#{order.id}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">Tipo:</span>
            <span className={`text-xs font-bold px-2 py-1 rounded border ${colors.tagBorder} ${colors.tagText}`}>
               {ORIGIN_LABELS[order.origin] ?? order.origin}
            </span>
          </div>
        </div>

        {/* Endereço (Só aparece se tiver) */}
        {order.deliveryAddress && (
          <div className={`p-3 rounded mb-4 text-sm ${colors.bgInfo} ${colors.text}`}>
            <div className="font-bold mb-1">Endereço de Entrega:</div>
            <div className="leading-tight">{order.deliveryAddress}</div>
          </div>
        )}

        {/* --- ITENS DO PEDIDO --- */}
        <div className={`py-1 px-2 mb-2 rounded font-bold text-sm uppercase text-center ${colors.bgHeader} ${isColor ? "text-[#4A3B32]" : "text-black"}`}>
          Itens do Pedido
        </div>

        <table className="w-full text-sm mb-4 border-collapse">
          <thead>
            <tr>
              <th className={`text-left py-1 w-10 border-b ${colors.border} ${colors.title}`}>Qtd</th>
              <th className={`text-left py-1 border-b ${colors.border} ${colors.title}`}>Produto</th>
              <th className={`text-right py-1 w-20 border-b ${colors.border} ${colors.title}`}>Valor</th>
            </tr>
          </thead>
          <tbody className={colors.text}>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2 text-center align-top font-bold">{item.quantity}</td>
                <td className="py-2 align-top">
                  <div className="font-bold">{item.productName}</div>
                  {/* Detalhes (Sabor, Obs) */}
                  {(item.observation || item.doughId || item.fillingId) && (
                    <div className="text-xs italic text-gray-500 mt-0.5">
                       {item.observation && <span>{item.observation}</span>}
                    </div>
                  )}
                </td>
                <td className="py-2 text-right align-top font-bold">
                  {formatCurrency(Number(item.totalPrice))}
                </td>
              </tr>
            ))}
            {/* Linha da Taxa de Entrega como se fosse um item */}
            {Number(order.deliveryFee) > 0 && (
                <tr className="border-b border-gray-100">
                    <td className="py-2 text-center align-top font-bold">1</td>
                    <td className="py-2 align-top">Taxa de Entrega</td>
                    <td className="py-2 text-right align-top font-bold">{formatCurrency(Number(order.deliveryFee))}</td>
                </tr>
            )}
          </tbody>
        </table>

        {/* --- TOTAIS --- */}
        <div className={`border-t-2 border-dashed pt-4 mt-2 ${colors.border} ${colors.text}`}>
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>{formatCurrency(Number(order.totalAmount) - Number(order.deliveryFee || 0))}</span>
          </div>
          {Number(order.deliveryFee) > 0 && (
            <div className="flex justify-between text-sm mb-1">
                <span>Taxa Entrega:</span>
                <span>{formatCurrency(Number(order.deliveryFee))}</span>
            </div>
          )}
          
          <div className={`flex justify-between text-xl font-bold mt-2 ${colors.price}`}>
            <span>TOTAL:</span>
            <span>{formatCurrency(Number(order.totalAmount))}</span>
          </div>

          <div className="flex justify-between mt-4 text-sm">
             <span className="font-bold">Pagamento:</span>
             <span className="uppercase">{order.paymentMethod}</span>
          </div>
        </div>

        {/* --- RODAPÉ --- */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p className="mb-2">Obrigado pela preferência!</p>
          <p className={`${dancingScript.className} text-xl ${isColor ? "text-[#4A3B32]" : "text-black"}`}>
            Doces que nos trazem afagos.
          </p>
        </div>
      </div>
    )
  }
)

OrderReceipt.displayName = "OrderReceipt"