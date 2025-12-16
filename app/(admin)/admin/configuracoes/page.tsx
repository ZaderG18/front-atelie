import { getStoreSettings } from "@/app/_actions/settings"
import ConfiguracoesClient from "../../../../components/configuracoes-client"

export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const settings = await getStoreSettings()
  
  return <ConfiguracoesClient initialData={settings} />
}