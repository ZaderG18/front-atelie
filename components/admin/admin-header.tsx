"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
// Importamos o botão de trocar tema
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function AdminHeader({ title, actionLabel, onAction }: AdminHeaderProps) {
  return (
    // Adicionamos dark:bg-slate-900 e dark:border-slate-800
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        
        {/* Título adaptável (Preto no claro, Branco no escuro) */}
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h1>

        <div className="flex items-center gap-4">
          {/* O botão de tema agora mora aqui, fixo para todo o Admin */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-1">
             <ThemeToggle />
          </div>

          {actionLabel && onAction && (
            <Button 
              onClick={onAction} 
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm"
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