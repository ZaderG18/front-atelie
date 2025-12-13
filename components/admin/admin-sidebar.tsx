"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  LogOut,
  ChefHat,
  Store,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminSidebarProps {
  activeItem: "dashboard" | "insumos" | "produtos" | "pedidos" | "financeiro" | "configuracoes"
}

export function AdminSidebar({ activeItem }: AdminSidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin", badge: null },
    { id: "pedidos", label: "Pedidos", icon: ShoppingCart, href: "/admin/pedidos", badge: "3" }, // Idealmente isso viria do banco
    { id: "produtos", label: "Cardápio", icon: ChefHat, href: "/admin/produtos", badge: null },
    { id: "insumos", label: "Estoque", icon: Package, href: "/admin/insumos", badge: "2" },
    { id: "financeiro", label: "Financeiro", icon: DollarSign, href: "/admin/financeiro", badge: null },
    { id: "configuracoes", label: "Configurações", icon: Settings, href: "/admin/configuracoes", badge: null },
  ]

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col h-screen border-r border-slate-800 hidden md:flex">
      {/* Logo Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Ateliê Aflorar</h1>
            <p className="text-xs text-slate-500">Painel Administrativo</p>
          </div>
        </div>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>

        {menuItems.slice(0, 4).map((item) => {
          const isActive = activeItem === item.id
          const Icon = item.icon

          return (
            <Link key={item.id} href={item.href}>
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge
                    className={cn(
                      "text-xs px-2 py-0.5 border-0",
                      isActive ? "bg-white/20 text-white" : "bg-rose-500/10 text-rose-400"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          )
        })}

        <div className="pt-6">
          <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sistema</p>
          {menuItems.slice(4).map((item) => {
            const isActive = activeItem === item.id
            const Icon = item.icon

            return (
              <Link key={item.id} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                      : "hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-4">
        <Link href="/" target="_blank" className="block">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600"
          >
            <Store className="w-4 h-4" />
            Ver Loja Online
          </Button>
        </Link>

        {/* User Profile Mini Card */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <Avatar className="h-9 w-9 border border-slate-600">
            <AvatarImage src="/avatar-placeholder.png" />
            <AvatarFallback className="bg-rose-600 text-white font-bold text-xs">AD</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@atelie.com</p>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-950/30">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}