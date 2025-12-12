"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Receipt,
  PieChart,
  BarChart3,
  Wallet,
} from "lucide-react"
import type { JSX } from "react"

// Dados mock para demonstração
const MOCK_RESUMO = {
  faturamentoBruto: 28750.0,
  faturamentoVariacao: 12.5,
  despesasTotais: 9840.0,
  despesasVariacao: 8.2,
  lucroLiquido: 18910.0,
  lucroVariacao: 15.3,
}

const MOCK_CHART_DATA = [
  { mes: "Jul", faturamento: 22000, despesas: 8500 },
  { mes: "Ago", faturamento: 24500, despesas: 9200 },
  { mes: "Set", faturamento: 21000, despesas: 8800 },
  { mes: "Out", faturamento: 26800, despesas: 9100 },
  { mes: "Nov", faturamento: 25500, despesas: 9400 },
  { mes: "Dez", faturamento: 28750, despesas: 9840 },
]

const MOCK_DESPESAS_CATEGORIA = [
  { categoria: "Insumos", valor: 5200, cor: "bg-rose-500", porcentagem: 53 },
  { categoria: "Embalagens", valor: 1800, cor: "bg-amber-500", porcentagem: 18 },
  { categoria: "Energia", valor: 950, cor: "bg-blue-500", porcentagem: 10 },
  { categoria: "Entregas", valor: 1200, cor: "bg-emerald-500", porcentagem: 12 },
  { categoria: "Outros", valor: 690, cor: "bg-violet-500", porcentagem: 7 },
]

const MOCK_LANCAMENTOS = [
  {
    id: 1,
    data: "2024-12-10",
    descricao: "Venda - Bolo de Aniversário",
    categoria: "Vendas",
    valor: 280.0,
    tipo: "entrada",
  },
  {
    id: 2,
    data: "2024-12-10",
    descricao: "Compra - Leite Condensado (10un)",
    categoria: "Insumos",
    valor: 89.9,
    tipo: "saida",
  },
  {
    id: 3,
    data: "2024-12-09",
    descricao: "Venda - Kit Brigadeiros (100un)",
    categoria: "Vendas",
    valor: 150.0,
    tipo: "entrada",
  },
  { id: 4, data: "2024-12-09", descricao: "Conta de Luz", categoria: "Energia", valor: 320.0, tipo: "saida" },
  { id: 5, data: "2024-12-08", descricao: "Venda - Torta de Limão", categoria: "Vendas", valor: 95.0, tipo: "entrada" },
  {
    id: 6,
    data: "2024-12-08",
    descricao: "Embalagens Descartáveis",
    categoria: "Embalagens",
    valor: 145.0,
    tipo: "saida",
  },
  {
    id: 7,
    data: "2024-12-07",
    descricao: "Venda - Cupcakes (12un)",
    categoria: "Vendas",
    valor: 84.0,
    tipo: "entrada",
  },
  { id: 8, data: "2024-12-07", descricao: "Combustível Entregas", categoria: "Entregas", valor: 200.0, tipo: "saida" },
]

const CATEGORIAS_ENTRADA = ["Vendas", "Outros Recebimentos"]
const CATEGORIAS_SAIDA = ["Insumos", "Embalagens", "Energia", "Entregas", "Manutenção", "Outros"]

export default function FinanceiroPage() {
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "saida">("todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [novoLancamento, setNovoLancamento] = useState({
    data: new Date().toISOString().split("T")[0],
    descricao: "",
    categoria: "",
    valor: "",
    tipo: "entrada" as "entrada" | "saida",
  })

  const lancamentosFiltrados = MOCK_LANCAMENTOS.filter((l) => filtroTipo === "todos" || l.tipo === filtroTipo)

  const maxFaturamento = Math.max(...MOCK_CHART_DATA.map((d) => d.faturamento))

  const handleSalvarLancamento = () => {
    console.log("Novo lançamento:", novoLancamento)
    setModalOpen(false)
    setNovoLancamento({
      data: new Date().toISOString().split("T")[0],
      descricao: "",
      categoria: "",
      valor: "",
      tipo: "entrada",
    })
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      <AdminSidebar activeItem="financeiro" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Financeiro" subtitle="Controle de faturamento, despesas e fluxo de caixa" />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cards de Resumo */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Faturamento Bruto */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-100">Faturamento Bruto</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(MOCK_RESUMO.faturamentoBruto)}</div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+{MOCK_RESUMO.faturamentoVariacao}%</span>
                  </div>
                  <span className="text-xs text-emerald-100">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            {/* Despesas Totais */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 border-0 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-rose-100">Despesas Totais</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingDown className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(MOCK_RESUMO.despesasTotais)}</div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+{MOCK_RESUMO.despesasVariacao}%</span>
                  </div>
                  <span className="text-xs text-rose-100">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            {/* Lucro Líquido */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-600 border-0 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-violet-100">Lucro Líquido</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(MOCK_RESUMO.lucroLiquido)}</div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+{MOCK_RESUMO.lucroVariacao}%</span>
                  </div>
                  <span className="text-xs text-violet-100">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Gráfico de Barras - Faturamento x Despesas */}
            <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      Faturamento x Despesas
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">Últimos 6 meses</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-slate-600 dark:text-slate-400">Faturamento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="text-slate-600 dark:text-slate-400">Despesas</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4 h-64">
                  {MOCK_CHART_DATA.map((item) => (
                    <div key={item.mes} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex gap-1 items-end h-48">
                        <div
                          className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-md transition-all hover:from-emerald-600 hover:to-emerald-500"
                          style={{ height: `${(item.faturamento / maxFaturamento) * 100}%` }}
                          title={`Faturamento: ${formatCurrency(item.faturamento)}`}
                        />
                        <div
                          className="flex-1 bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-md transition-all hover:from-rose-600 hover:to-rose-500"
                          style={{ height: `${(item.despesas / maxFaturamento) * 100}%` }}
                          title={`Despesas: ${formatCurrency(item.despesas)}`}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.mes}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Rosca - Despesas por Categoria */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-violet-500" />
                  Despesas por Categoria
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Distribuição do mês</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Donut Chart Visual */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {
                      MOCK_DESPESAS_CATEGORIA.reduce(
                        (acc, item, index) => {
                          const offset = acc.offset
                          const strokeDasharray = `${item.porcentagem} ${100 - item.porcentagem}`
                          const colors = ["#f43f5e", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"]
                          acc.elements.push(
                            <circle
                              key={item.categoria}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke={colors[index]}
                              strokeWidth="20"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={-offset}
                              className="transition-all duration-500"
                            />,
                          )
                          acc.offset += item.porcentagem
                          return acc
                        },
                        { elements: [] as JSX.Element[], offset: 0 },
                      ).elements
                    }
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">
                      {formatCurrency(MOCK_RESUMO.despesasTotais)}
                    </span>
                    <span className="text-xs text-slate-500">Total</span>
                  </div>
                </div>

                {/* Legenda */}
                <div className="space-y-2">
                  {MOCK_DESPESAS_CATEGORIA.map((item) => (
                    <div key={item.categoria} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.cor}`} />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.categoria}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800 dark:text-white">
                          {formatCurrency(item.valor)}
                        </span>
                        <span className="text-xs text-slate-400">({item.porcentagem}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Lançamentos */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-amber-500" />
                    Lançamentos
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">Histórico de entradas e saídas</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  {/* Filtro */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <Button
                      variant={filtroTipo === "todos" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFiltroTipo("todos")}
                      className={filtroTipo === "todos" ? "bg-white dark:bg-slate-700 shadow-sm" : ""}
                    >
                      Todos
                    </Button>
                    <Button
                      variant={filtroTipo === "entrada" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFiltroTipo("entrada")}
                      className={
                        filtroTipo === "entrada"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "text-emerald-600 dark:text-emerald-400"
                      }
                    >
                      Entradas
                    </Button>
                    <Button
                      variant={filtroTipo === "saida" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFiltroTipo("saida")}
                      className={
                        filtroTipo === "saida"
                          ? "bg-rose-500 text-white hover:bg-rose-600"
                          : "text-rose-600 dark:text-rose-400"
                      }
                    >
                      Saídas
                    </Button>
                  </div>

                  {/* Botão Novo Lançamento */}
                  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Novo Lançamento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Novo Lançamento</DialogTitle>
                        <DialogDescription>Registre uma nova entrada ou saída financeira</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {/* Tipo */}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={novoLancamento.tipo === "entrada" ? "default" : "outline"}
                            className={`flex-1 ${novoLancamento.tipo === "entrada" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                            onClick={() => setNovoLancamento({ ...novoLancamento, tipo: "entrada", categoria: "" })}
                          >
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            Entrada
                          </Button>
                          <Button
                            type="button"
                            variant={novoLancamento.tipo === "saida" ? "default" : "outline"}
                            className={`flex-1 ${novoLancamento.tipo === "saida" ? "bg-rose-500 hover:bg-rose-600" : ""}`}
                            onClick={() => setNovoLancamento({ ...novoLancamento, tipo: "saida", categoria: "" })}
                          >
                            <ArrowDownRight className="w-4 h-4 mr-2" />
                            Saída
                          </Button>
                        </div>

                        {/* Data */}
                        <div className="space-y-2">
                          <Label>Data</Label>
                          <Input
                            type="date"
                            value={novoLancamento.data}
                            onChange={(e) => setNovoLancamento({ ...novoLancamento, data: e.target.value })}
                          />
                        </div>

                        {/* Descrição */}
                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Input
                            placeholder="Ex: Venda de bolo de aniversário"
                            value={novoLancamento.descricao}
                            onChange={(e) => setNovoLancamento({ ...novoLancamento, descricao: e.target.value })}
                          />
                        </div>

                        {/* Categoria */}
                        <div className="space-y-2">
                          <Label>Categoria</Label>
                          <Select
                            value={novoLancamento.categoria}
                            onValueChange={(value) => setNovoLancamento({ ...novoLancamento, categoria: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {(novoLancamento.tipo === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA).map(
                                (cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Valor */}
                        <div className="space-y-2">
                          <Label>Valor (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={novoLancamento.valor}
                            onChange={(e) => setNovoLancamento({ ...novoLancamento, valor: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSalvarLancamento}
                          className={
                            novoLancamento.tipo === "entrada"
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : "bg-rose-500 hover:bg-rose-600"
                          }
                        >
                          Salvar Lançamento
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead className="font-semibold">Data</TableHead>
                      <TableHead className="font-semibold">Descrição</TableHead>
                      <TableHead className="font-semibold">Categoria</TableHead>
                      <TableHead className="font-semibold text-right">Valor</TableHead>
                      <TableHead className="font-semibold text-center">Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lancamentosFiltrados.map((lancamento) => (
                      <TableRow key={lancamento.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {new Date(lancamento.data).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="font-medium text-slate-800 dark:text-white">
                          {lancamento.descricao}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {lancamento.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${lancamento.tipo === "entrada" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                        >
                          {lancamento.tipo === "entrada" ? "+" : "-"} {formatCurrency(lancamento.valor)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              lancamento.tipo === "entrada"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-0"
                            }
                          >
                            {lancamento.tipo === "entrada" ? "Entrada" : "Saída"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
