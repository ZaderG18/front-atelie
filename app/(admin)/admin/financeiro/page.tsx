import { getFinancialDashboardData } from "@/app/_actions/financial"
import FinanceiroClient from "./financeiro-client"

export const dynamic = 'force-dynamic'

export default async function FinanceiroPage() {
  const data = await getFinancialDashboardData()
  
  return <FinanceiroClient initialData={data} />
}