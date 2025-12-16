import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { getDashboardStats } from "@/app/_actions/dashboard" // Usando a função que atualizamos
import { DashboardOverview } from "@/components/admin/dashboard-overview"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const data = await getDashboardStats()

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      <AdminSidebar activeItem="dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Visão Geral" subtitle="Bem-vindo ao Ateliê Aflorar" />

        <main className="flex-1 overflow-y-auto p-6">
          <DashboardOverview data={data} />
        </main>
      </div>
    </div>
  )
}