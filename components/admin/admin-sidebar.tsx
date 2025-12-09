"use client"

import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, ClipboardList, DollarSign, Settings, ChefHat } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  activeItem: string
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "insumos", label: "Insumos", icon: Package, href: "/admin/insumos" },
  { id: "produtos", label: "Produtos", icon: ShoppingBag, href: "/admin/produtos" },
  { id: "pedidos", label: "Pedidos", icon: ClipboardList, href: "/admin/pedidos" },
  { id: "financeiro", label: "Financeiro", icon: DollarSign, href: "/admin/financeiro" },
  { id: "configuracoes", label: "Configurações", icon: Settings, href: "/admin/configuracoes" },
]

export function AdminSidebar({ activeItem }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">Aflorar</h1>
            <p className="text-xs text-slate-400">Painel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Voltar para loja
        </Link>
      </div>
    </aside>
  )
}
