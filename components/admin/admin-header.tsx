"use client"

import { Plus, Search, Bell, LogOut, User, Settings } from "lucide-react" // Menu removido
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileSidebar } from "./mobile-sidebar" // <--- IMPORT NOVO

interface AdminHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  onMenuClick?: () => void
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function AdminHeader({ 
  title, 
  subtitle, 
  actionLabel, 
  onAction,
  searchValue,
  onSearchChange
}: AdminHeaderProps) {
  
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        
        {/* Lado Esquerdo: Menu Mobile + Títulos */}
        <div className="flex items-center gap-4">
          
          {/* AQUI ESTÁ A MÁGICA: O componente que abre a gaveta */}
          <MobileSidebar />

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        {/* ... (Resto do código igual: Busca, Ações, User, etc) ... */}
        {/* Centro: Barra de Busca (Funcional) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all focus:bg-white dark:focus:bg-slate-950"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              disabled={!onSearchChange}
            />
          </div>
        </div>

        {/* Lado Direito: Ações e Perfil */}
        <div className="flex items-center gap-2">
          
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20 mr-2 hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" />
              {actionLabel}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-white dark:border-slate-900" />
          </Button>

          <div className="hidden sm:block">
             <ThemeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1">
                <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm">
                  <AvatarImage src="/avatar-placeholder.png" alt="User" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@atelieaflorar.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
      
      {onSearchChange && (
        <div className="mt-4 lg:hidden">
            <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-slate-100 dark:bg-slate-800 border-0"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </header>
  )
}