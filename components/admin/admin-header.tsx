"use client"

import { Plus, Search, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
}

export function AdminHeader({ title, subtitle, actionLabel, onAction }: AdminHeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Título e Subtítulo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden text-slate-600 dark:text-slate-400">
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
        </div>

        {/* Barra de Busca - Escondida em mobile */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar pedidos, produtos, clientes..."
              className="pl-10 bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          {/* Notificações */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </Button>

          {/* Toggle Tema */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <ThemeToggle />
          </div>

          {/* Botão de Ação Principal */}
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20 ml-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
