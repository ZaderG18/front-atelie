"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Import necessário para o router
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header" // Import necessário para o Header
import { PedidosTable } from "@/components/admin/pedidos-table"
import { API_URL } from "@/lib/api-config"

export default function PedidosPage() {
  const router = useRouter() // Inicializa o router aqui dentro
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`)
      const data = await response.json()
      setPedidos(data)
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPedidos()
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchPedidos, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchPedidos()
      } else {
        alert("Erro ao atualizar status")
      }
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
      <AdminSidebar activeItem="pedidos" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Agora o AdminHeader vai funcionar pois está importado e o router existe */}
        <AdminHeader 
          title="Gerenciar Pedidos" 
          actionLabel="Novo Pedido (Manual)" 
          onAction={() => router.push("/admin/pedidos/novo")} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <p className="text-center py-10 text-gray-500 dark:text-slate-400">Carregando pedidos...</p>
          ) : (
            <div className="space-y-4">
               <div className="flex gap-4 mb-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border dark:border-slate-800">
                     <span className="text-sm text-muted-foreground">Pendentes</span>
                     <div className="text-2xl font-bold text-yellow-600">
                        {pedidos.filter((p: any) => p.status === 'pending').length}
                     </div>
                  </div>
               </div>

               <PedidosTable pedidos={pedidos} onStatusChange={handleStatusChange} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
