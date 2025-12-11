import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | Ateliê Aflorar Doces",
  description: "Painel administrativo",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-slate-100 dark:bg-slate-950">{children}</div>
}
