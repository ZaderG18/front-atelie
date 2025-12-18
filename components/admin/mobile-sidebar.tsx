"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  ChefHat,
  Store,
  Menu,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"

interface MobileSidebarProps {
  activeItem?: string 
}

export function MobileSidebar({ activeItem }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)
  
  // --- 1. Adicionar estado de montagem ---
  const [isMounted, setIsMounted] = useState(false)

  // --- 2. Adicionar efeito para marcar como montado ---
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin", badge: null },
    { id: "pedidos", label: "Pedidos", icon: ShoppingCart, href: "/admin/pedidos", badge: "3" },
    { id: "produtos", label: "Cardápio", icon: ChefHat, href: "/admin/produtos", badge: null },
    { id: "insumos", label: "Estoque", icon: Package, href: "/admin/insumos", badge: "2" },
    { id: "financeiro", label: "Financeiro", icon: DollarSign, href: "/admin/financeiro", badge: null },
    { id: "configuracoes", label: "Configurações", icon: Settings, href: "/admin/configuracoes", badge: null },
  ]

  // --- 3. Impedir renderização no servidor (Onde ocorre o erro de ID) ---
  if (!isMounted) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-slate-600 dark:text-slate-400"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      
      {/* Lado esquerdo (left) para parecer um menu lateral */}
      <SheetContent side="left" className="p-0 bg-slate-950 border-r-slate-800 text-slate-300 w-72">
        <SheetHeader className="p-6 text-left border-b border-slate-800">
           <SheetTitle className="text-white flex items-center gap-3">
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/20">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              Ateliê Aflorar
           </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
          <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>

          {menuItems.map((item) => {
            const isActive = activeItem === item.id
            const Icon = item.icon

            return (
              <Link key={item.id} href={item.href} onClick={() => setOpen(false)}>
                <div
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                      : "hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-rose-500 text-white border-0 text-xs px-2">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer Mobile */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800 bg-slate-900/50 space-y-4">
            <Link href="/" target="_blank" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-2 bg-slate-800 border-slate-700 text-slate-300">
                    <Store className="w-4 h-4" /> Ver Loja
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
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}