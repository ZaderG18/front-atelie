"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" 
import { AdminHeader } from "@/components/admin/admin-header"
import { createTransaction } from "@/app/_actions/financial" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet, PlusCircle, Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { toast } from "sonner"
import { NumericFormat } from "react-number-format" 

import { FinancialBarChart, FinancialDonutChart } from "@/components/admin/financial-charts"
import type { FinancialDashboardData, TransactionTypeClient } from "@/lib/financial-types"

const CATEGORIAS_ENTRADA = ["Vendas", "Outros Recebimentos"]
const CATEGORIAS_SAIDA = ["Insumos", "Embalagens", "Energia", "Entregas", "Manutenção", "Outros"]

interface Props {
  initialData: FinancialDashboardData 
}

export default function FinanceiroClient({ initialData }: Props) {
  const router = useRouter() 
  const { resumo, categorias, lancamentos, historico } = initialData

  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "saida">("todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado do formulário
  // Nota: valor começa como string vazia mas vai virar número depois
  const [novoLancamento, setNovoLancamento] = useState({
    data: new Date().toISOString().split("T")[0],
    descricao: "",
    categoria: "",
    valor: "" as string | number, 
    tipo: "entrada" as TransactionTypeClient,
  })

  const lancamentosFiltrados = lancamentos.filter(l => filtroTipo === "todos" || l.tipo === filtroTipo)

  const handleSalvarLancamento = async () => {
    if (!novoLancamento.descricao || !novoLancamento.valor || !novoLancamento.categoria) {
        toast.warning("Preencha todos os campos")
        return
    }

    setIsSubmitting(true)
    
    // --- CORREÇÃO 1 AQUI ---
    // Removemos a limpeza manual. Pegamos o valor direto.
    const payload = {
        ...novoLancamento,
        valor: Number(novoLancamento.valor)
    }

    const result = await createTransaction(payload)
    
    if (result.success) {
      toast.success("Lançamento salvo!")
      setModalOpen(false)
      setNovoLancamento({
        data: new Date().toISOString().split("T")[0],
        descricao: "",
        categoria: "",
        valor: "",
        tipo: "entrada",
      })
      
      router.refresh() 
    } else {
      toast.error("Erro ao salvar: " + result.error)
    }
    setIsSubmitting(false)
  }

  return (

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Financeiro" subtitle="Controle de faturamento, despesas e fluxo de caixa" />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ... CARDS DE RESUMO (IGUAL AO ANTERIOR) ... */}
          <div className="grid gap-4 sm:grid-cols-3">
             {/* (Conteúdo dos cards mantido igual para economizar espaço na resposta) */}
             <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white shadow-lg">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <CardTitle className="text-sm font-medium text-emerald-100">Faturamento Bruto</CardTitle>
                 <div className="p-2 bg-white/20 rounded-lg"><TrendingUp className="h-4 w-4" /></div>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold">{formatCurrency(resumo.faturamentoBruto)}</div>
                 <span className="text-xs text-emerald-100">Mês atual</span>
               </CardContent>
             </Card>
             <Card className="bg-gradient-to-br from-rose-500 to-rose-600 border-0 text-white shadow-lg">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <CardTitle className="text-sm font-medium text-rose-100">Despesas Totais</CardTitle>
                 <div className="p-2 bg-white/20 rounded-lg"><TrendingDown className="h-4 w-4" /></div>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold">{formatCurrency(resumo.despesasTotais)}</div>
                 <span className="text-xs text-rose-100">Mês atual</span>
               </CardContent>
             </Card>
             <Card className="bg-gradient-to-br from-violet-500 to-violet-600 border-0 text-white shadow-lg">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <CardTitle className="text-sm font-medium text-violet-100">Lucro Líquido</CardTitle>
                 <div className="p-2 bg-white/20 rounded-lg"><Wallet className="h-4 w-4" /></div>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold">{formatCurrency(resumo.lucroLiquido)}</div>
                 <span className="text-xs text-violet-100">Mês atual</span>
               </CardContent>
             </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
             <FinancialBarChart data={historico} />
             <FinancialDonutChart data={categorias} total={resumo.despesasTotais} />
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-amber-500" />
                    Lançamentos
                  </CardTitle>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <Button variant={filtroTipo === "todos" ? "default" : "ghost"} size="sm" onClick={() => setFiltroTipo("todos")} className={filtroTipo === "todos" ? "bg-white dark:bg-slate-700 shadow-sm" : ""}>Todos</Button>
                    <Button variant={filtroTipo === "entrada" ? "default" : "ghost"} size="sm" onClick={() => setFiltroTipo("entrada")} className={filtroTipo === "entrada" ? "bg-emerald-500 text-white" : "text-emerald-600"}>Entradas</Button>
                    <Button variant={filtroTipo === "saida" ? "default" : "ghost"} size="sm" onClick={() => setFiltroTipo("saida")} className={filtroTipo === "saida" ? "bg-rose-500 text-white" : "text-rose-600"}>Saídas</Button>
                  </div>

                  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <PlusCircle className="w-4 h-4" /> Novo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Lançamento</DialogTitle>
                            <DialogDescription>Registre uma nova movimentação.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex gap-2">
                                <Button type="button" variant={novoLancamento.tipo === "entrada" ? "default" : "outline"} className={`flex-1 ${novoLancamento.tipo === "entrada" ? "bg-emerald-500" : ""}`} onClick={() => setNovoLancamento({ ...novoLancamento, tipo: "entrada", categoria: "" })}><ArrowUpRight className="mr-2 h-4 w-4"/> Entrada</Button>
                                <Button type="button" variant={novoLancamento.tipo === "saida" ? "default" : "outline"} className={`flex-1 ${novoLancamento.tipo === "saida" ? "bg-rose-500" : ""}`} onClick={() => setNovoLancamento({ ...novoLancamento, tipo: "saida", categoria: "" })}><ArrowDownRight className="mr-2 h-4 w-4"/> Saída</Button>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Valor</Label>
                                {/* --- CORREÇÃO 2 AQUI --- */}
                                <NumericFormat
                                    value={novoLancamento.valor}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    decimalScale={2}
                                    fixedDecimalScale
                                    prefix="R$ "
                                    customInput={Input}
                                    placeholder="R$ 0,00"
                                    onValueChange={(values) => {
                                        // AQUI: Usamos floatValue para pegar o número puro (80) e não a string (8000)
                                        setNovoLancamento({ 
                                            ...novoLancamento, 
                                            valor: values.floatValue ?? 0 
                                        })
                                    }}
                                />
                            </div>

                            <div className="space-y-2"><Label>Data</Label><Input type="date" value={novoLancamento.data} onChange={(e) => setNovoLancamento({ ...novoLancamento, data: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Descrição</Label><Input value={novoLancamento.descricao} onChange={(e) => setNovoLancamento({ ...novoLancamento, descricao: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Categoria</Label>
                                <Select value={novoLancamento.categoria} onValueChange={(val) => setNovoLancamento({ ...novoLancamento, categoria: val })}>
                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>{(novoLancamento.tipo === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSalvarLancamento} disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : "Salvar Lançamento"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Descrição</TableHead><TableHead>Categoria</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="text-center">Tipo</TableHead></TableRow></TableHeader>
                <TableBody>
                    {lancamentosFiltrados.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-4">Sem dados</TableCell></TableRow> : lancamentosFiltrados.map((l) => (
                        <TableRow key={l.id}>
                            <TableCell>{new Date(l.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                            <TableCell>{l.descricao}</TableCell>
                            <TableCell><Badge variant="outline">{l.categoria}</Badge></TableCell>
                            <TableCell className={`text-right font-bold ${l.tipo === 'entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>{l.tipo === 'entrada' ? '+' : '-'} {formatCurrency(l.valor)}</TableCell>
                            <TableCell className="text-center"><Badge className={l.tipo === 'entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>{l.tipo === 'entrada' ? 'Entrada' : 'Saída'}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
               </Table>
            </CardContent>
          </Card>
        </main>
      </div>
  )
}