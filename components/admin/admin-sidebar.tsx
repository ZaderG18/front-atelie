"use client"

import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, ShoppingCart, DollarSign, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  activeItem: "dashboard" | "insumos" | "produtos" | "pedidos" | "financeiro" | "configuracoes"
}

export function AdminSidebar({ activeItem }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard, href: "/admin" },
    { id: "insumos", label: "Insumos (Estoque)", icon: Package, href: "/admin/insumos" },
    { id: "produtos", label: "Produtos (Vitrine)", icon: ShoppingBag, href: "/admin/produtos" },
    // Estes abaixo faremos no futuro, mas já deixamos o link pronto ou desativado
    { id: "pedidos", label: "Pedidos", icon: ShoppingCart, href: "/admin/pedidos" },
    { id: "financeiro", label: "Financeiro", icon: DollarSign, href: "/admin/financeiro" },
    { id: "configuracoes", label: "Configurações", icon: Settings, href: "/admin/configuracoes" },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 hidden md:flex">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">🧑‍🍳</span>
          Ateliê Admin
        </h1>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id
          const Icon = item.icon
          
          return (
            <Link key={item.id} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Rodapé do Menu */}
      <div className="p-4 border-t border-slate-800">
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-2">
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </Button>
      </div>
    </aside>
  )
}