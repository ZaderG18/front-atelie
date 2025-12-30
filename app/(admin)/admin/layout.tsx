import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getPendingOrdersCount } from "@/app/_actions/orders" // <--- Importamos a conta

export const dynamic = 'force-dynamic' // Garante que o número esteja sempre fresco

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  // Busca a contagem de pedidos pendentes
  const pendingCount = await getPendingOrdersCount()

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Passamos o número para a Sidebar */}
      <AdminSidebar activeItem="dashboard" pendingOrdersCount={pendingCount} />
      
      <main className="flex-1 overflow-hidden h-full">
        {children}
      </main>
    </div>
  )
}