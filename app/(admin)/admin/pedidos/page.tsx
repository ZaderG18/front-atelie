import { useRouter } from "next/navigation"

<AdminHeader 
  title="Gerenciar Pedidos" 
  actionLabel="Novo Pedido (Manual)" 
  onAction={() => router.push("/admin/pedidos/novo")} 
/>