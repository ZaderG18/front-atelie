"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function AdminHeader({ title, actionLabel, onAction }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </header>
  )
}
