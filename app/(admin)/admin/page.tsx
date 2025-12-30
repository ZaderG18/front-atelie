import { AdminHeader } from "@/components/admin/admin-header"
import { getDashboardStats } from "@/app/_actions/dashboard"
import { DashboardOverview } from "@/components/admin/dashboard-overview"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const data = await getDashboardStats()

  return (
    <div className="flex flex-col h-full">
      {/* O Layout já traz a Sidebar, então focamos só no conteúdo */}
      <AdminHeader title="Visão Geral" subtitle="Bem-vindo ao Ateliê Aflorar" />

      <main className="flex-1 overflow-y-auto p-6">
        <DashboardOverview data={data} />
      </main>
    </div>
  )
}