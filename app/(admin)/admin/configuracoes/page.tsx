"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Store,
  Clock,
  CreditCard,
  Truck,
  Upload,
  Phone,
  MessageCircle,
  Save,
  Plus,
  Trash2,
  ChefHat,
  QrCode,
  Banknote,
  Wallet,
  MapPin,
  ImageIcon,
} from "lucide-react"

// Estado inicial das configurações
const INITIAL_CONFIG = {
  geral: {
    logo: "/bakery-logo.png",
    nomeConfeitaria: "Ateliê Aflorar",
    telefone: "(11) 99999-8888",
    whatsapp: "(11) 99999-8888",
    descricao: "Confeitaria artesanal especializada em bolos decorados e doces finos para eventos especiais.",
    endereco: "Rua das Flores, 123 - Centro",
  },
  cardapio: {
    aberto: true,
    horaAbertura: "08:00",
    horaFechamento: "18:00",
    diasFuncionamento: ["seg", "ter", "qua", "qui", "sex", "sab"],
    tempoPreparo: "2-3 dias",
    aceitaEncomendas: true,
  },
  pagamentos: {
    pix: true,
    chavePix: "confeitaria@email.com",
    tipoChavePix: "email",
    cartao: true,
    dinheiro: true,
    parcelamento: false,
    maxParcelas: 3,
  },
  entregas: {
    tipoTaxa: "bairro" as "fixa" | "bairro",
    taxaFixa: 10.0,
    bairros: [
      { id: 1, nome: "Centro", taxa: 8.0 },
      { id: 2, nome: "Jardim América", taxa: 12.0 },
      { id: 3, nome: "Vila Nova", taxa: 15.0 },
      { id: 4, nome: "Zona Sul", taxa: 20.0 },
    ],
    retiradaLocal: true,
    freteGratis: 150.0,
  },
}

const DIAS_SEMANA = [
  { id: "dom", label: "D", nome: "Domingo" },
  { id: "seg", label: "S", nome: "Segunda" },
  { id: "ter", label: "T", nome: "Terça" },
  { id: "qua", label: "Q", nome: "Quarta" },
  { id: "qui", label: "Q", nome: "Quinta" },
  { id: "sex", label: "S", nome: "Sexta" },
  { id: "sab", label: "S", nome: "Sábado" },
]

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState(INITIAL_CONFIG)
  const [activeTab, setActiveTab] = useState("geral")
  const [novoBairro, setNovoBairro] = useState({ nome: "", taxa: "" })
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    setSalvando(true)
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSalvando(false)
    console.log("Configurações salvas:", config)
  }

  const toggleDia = (dia: string) => {
    setConfig((prev) => ({
      ...prev,
      cardapio: {
        ...prev.cardapio,
        diasFuncionamento: prev.cardapio.diasFuncionamento.includes(dia)
          ? prev.cardapio.diasFuncionamento.filter((d) => d !== dia)
          : [...prev.cardapio.diasFuncionamento, dia],
      },
    }))
  }

  const adicionarBairro = () => {
    if (novoBairro.nome && novoBairro.taxa) {
      setConfig((prev) => ({
        ...prev,
        entregas: {
          ...prev.entregas,
          bairros: [
            ...prev.entregas.bairros,
            { id: Date.now(), nome: novoBairro.nome, taxa: Number.parseFloat(novoBairro.taxa) },
          ],
        },
      }))
      setNovoBairro({ nome: "", taxa: "" })
    }
  }

  const removerBairro = (id: number) => {
    setConfig((prev) => ({
      ...prev,
      entregas: {
        ...prev.entregas,
        bairros: prev.entregas.bairros.filter((b) => b.id !== id),
      },
    }))
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      <AdminSidebar activeItem="configuracoes" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Configurações" subtitle="Personalize sua loja e defina preferências" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Tabs de Navegação */}
              <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <TabsTrigger
                  value="geral"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">Geral</span>
                </TabsTrigger>
                <TabsTrigger
                  value="cardapio"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Cardápio</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pagamentos"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Pagamentos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="entregas"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"
                >
                  <Truck className="w-4 h-4" />
                  <span className="hidden sm:inline">Entregas</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab: Geral */}
              <TabsContent value="geral" className="space-y-6">
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <Store className="w-5 h-5 text-blue-500" />
                      Informações da Loja
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Dados básicos que aparecem no seu cardápio digital
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Upload de Logo */}
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                          {config.geral.logo ? (
                            <img
                              src={config.geral.logo || "/placeholder.svg"}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-10 h-10 text-slate-400" />
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-sm font-medium">Logo da Confeitaria</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Recomendado: 200x200px, PNG ou JPG</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          <Upload className="w-4 h-4 mr-2" />
                          Fazer Upload
                        </Button>
                      </div>
                    </div>

                    {/* Campos de texto */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome da Confeitaria</Label>
                        <Input
                          id="nome"
                          value={config.geral.nomeConfeitaria}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              geral: { ...prev.geral, nomeConfeitaria: e.target.value },
                            }))
                          }
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input
                          id="endereco"
                          value={config.geral.endereco}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              geral: { ...prev.geral, endereco: e.target.value },
                            }))
                          }
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="telefone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          Telefone
                        </Label>
                        <Input
                          id="telefone"
                          value={config.geral.telefone}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              geral: { ...prev.geral, telefone: e.target.value },
                            }))
                          }
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp" className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-500" />
                          WhatsApp
                        </Label>
                        <Input
                          id="whatsapp"
                          value={config.geral.whatsapp}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              geral: { ...prev.geral, whatsapp: e.target.value },
                            }))
                          }
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        rows={3}
                        value={config.geral.descricao}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            geral: { ...prev.geral, descricao: e.target.value },
                          }))
                        }
                        className="bg-slate-50 dark:bg-slate-800 resize-none"
                        placeholder="Uma breve descrição sobre sua confeitaria..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Cardápio Digital */}
              <TabsContent value="cardapio" className="space-y-6">
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" />
                      Horário de Funcionamento
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Configure quando sua loja está aberta para pedidos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status Aberto/Fechado */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${config.cardapio.aberto ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                        />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">Status da Loja</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {config.cardapio.aberto ? "Aceitando pedidos" : "Fechado para novos pedidos"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={config.cardapio.aberto}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            cardapio: { ...prev.cardapio, aberto: checked },
                          }))
                        }
                      />
                    </div>

                    {/* Dias de Funcionamento */}
                    <div className="space-y-3">
                      <Label>Dias de Funcionamento</Label>
                      <div className="flex gap-2">
                        {DIAS_SEMANA.map((dia) => (
                          <Button
                            key={dia.id}
                            type="button"
                            variant={config.cardapio.diasFuncionamento.includes(dia.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleDia(dia.id)}
                            className={`w-10 h-10 rounded-full p-0 ${
                              config.cardapio.diasFuncionamento.includes(dia.id)
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                            title={dia.nome}
                          >
                            {dia.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Horários */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Abre às</Label>
                        <Input
                          type="time"
                          value={config.cardapio.horaAbertura}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              cardapio: { ...prev.cardapio, horaAbertura: e.target.value },
                            }))
                          }
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha às</Label>
                        <Input
                          type="time"
                          value={config.cardapio.horaFechamento}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              cardapio: { ...prev.cardapio, horaFechamento: e.target.value },
                            }))
                          }
                          className="bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* Tempo de Preparo */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-rose-500" />
                        Tempo Médio de Preparo
                      </Label>
                      <Select
                        value={config.cardapio.tempoPreparo}
                        onValueChange={(value) =>
                          setConfig((prev) => ({
                            ...prev,
                            cardapio: { ...prev.cardapio, tempoPreparo: value },
                          }))
                        }
                      >
                        <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mesmo-dia">Mesmo dia</SelectItem>
                          <SelectItem value="1 dia">1 dia útil</SelectItem>
                          <SelectItem value="2-3 dias">2-3 dias úteis</SelectItem>
                          <SelectItem value="3-5 dias">3-5 dias úteis</SelectItem>
                          <SelectItem value="1 semana">1 semana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Aceita Encomendas */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Aceitar Encomendas</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Permitir pedidos agendados para datas futuras
                        </p>
                      </div>
                      <Switch
                        checked={config.cardapio.aceitaEncomendas}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            cardapio: { ...prev.cardapio, aceitaEncomendas: checked },
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Pagamentos */}
              <TabsContent value="pagamentos" className="space-y-6">
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-violet-500" />
                      Métodos de Pagamento
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Ative ou desative as formas de pagamento aceitas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* PIX */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-white">PIX</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Pagamento instantâneo</p>
                          </div>
                        </div>
                        <Switch
                          checked={config.pagamentos.pix}
                          onCheckedChange={(checked) =>
                            setConfig((prev) => ({
                              ...prev,
                              pagamentos: { ...prev.pagamentos, pix: checked },
                            }))
                          }
                        />
                      </div>
                      {config.pagamentos.pix && (
                        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="space-y-2">
                            <Label>Tipo de Chave</Label>
                            <Select
                              value={config.pagamentos.tipoChavePix}
                              onValueChange={(value) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  pagamentos: { ...prev.pagamentos, tipoChavePix: value },
                                }))
                              }
                            >
                              <SelectTrigger className="bg-white dark:bg-slate-900">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cpf">CPF</SelectItem>
                                <SelectItem value="cnpj">CNPJ</SelectItem>
                                <SelectItem value="email">E-mail</SelectItem>
                                <SelectItem value="telefone">Telefone</SelectItem>
                                <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Chave PIX</Label>
                            <Input
                              value={config.pagamentos.chavePix}
                              onChange={(e) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  pagamentos: { ...prev.pagamentos, chavePix: e.target.value },
                                }))
                              }
                              className="bg-white dark:bg-slate-900"
                              placeholder="Sua chave PIX"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cartão */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">Cartão na Entrega</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Débito e Crédito</p>
                        </div>
                      </div>
                      <Switch
                        checked={config.pagamentos.cartao}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            pagamentos: { ...prev.pagamentos, cartao: checked },
                          }))
                        }
                      />
                    </div>

                    {/* Dinheiro */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Banknote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">Dinheiro</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Pagamento em espécie</p>
                        </div>
                      </div>
                      <Switch
                        checked={config.pagamentos.dinheiro}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            pagamentos: { ...prev.pagamentos, dinheiro: checked },
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Entregas */}
              <TabsContent value="entregas" className="space-y-6">
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <Truck className="w-5 h-5 text-emerald-500" />
                      Configurações de Entrega
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">Defina taxas e opções de entrega</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Retirada no Local */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">Retirada no Local</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Cliente busca no endereço</p>
                        </div>
                      </div>
                      <Switch
                        checked={config.entregas.retiradaLocal}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            entregas: { ...prev.entregas, retiradaLocal: checked },
                          }))
                        }
                      />
                    </div>

                    {/* Tipo de Taxa */}
                    <div className="space-y-3">
                      <Label>Tipo de Taxa de Entrega</Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              entregas: { ...prev.entregas, tipoTaxa: "fixa" },
                            }))
                          }
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            config.entregas.tipoTaxa === "fixa"
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Wallet className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-slate-800 dark:text-white">Taxa Fixa</span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Mesmo valor para todos os bairros
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              entregas: { ...prev.entregas, tipoTaxa: "bairro" },
                            }))
                          }
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            config.entregas.tipoTaxa === "bairro"
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-emerald-500" />
                            <span className="font-medium text-slate-800 dark:text-white">Por Bairro</span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Taxa diferente por região</p>
                        </button>
                      </div>
                    </div>

                    {/* Taxa Fixa */}
                    {config.entregas.tipoTaxa === "fixa" && (
                      <div className="space-y-2">
                        <Label>Valor da Taxa Fixa (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={config.entregas.taxaFixa}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              entregas: { ...prev.entregas, taxaFixa: Number.parseFloat(e.target.value) || 0 },
                            }))
                          }
                          className="bg-slate-50 dark:bg-slate-800 max-w-xs"
                        />
                      </div>
                    )}

                    {/* Tabela de Bairros */}
                    {config.entregas.tipoTaxa === "bairro" && (
                      <div className="space-y-4">
                        <Label>Taxas por Bairro</Label>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                                <TableHead>Bairro</TableHead>
                                <TableHead className="text-right">Taxa</TableHead>
                                <TableHead className="w-16"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {config.entregas.bairros.map((bairro) => (
                                <TableRow key={bairro.id}>
                                  <TableCell className="font-medium">{bairro.nome}</TableCell>
                                  <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                    R$ {bairro.taxa.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removerBairro(bairro.id)}
                                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Adicionar Bairro */}
                        <div className="flex gap-3 items-end">
                          <div className="flex-1 space-y-2">
                            <Label>Novo Bairro</Label>
                            <Input
                              placeholder="Nome do bairro"
                              value={novoBairro.nome}
                              onChange={(e) => setNovoBairro({ ...novoBairro, nome: e.target.value })}
                              className="bg-slate-50 dark:bg-slate-800"
                            />
                          </div>
                          <div className="w-32 space-y-2">
                            <Label>Taxa (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0,00"
                              value={novoBairro.taxa}
                              onChange={(e) => setNovoBairro({ ...novoBairro, taxa: e.target.value })}
                              className="bg-slate-50 dark:bg-slate-800"
                            />
                          </div>
                          <Button onClick={adicionarBairro} className="bg-blue-500 hover:bg-blue-600">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Frete Grátis */}
                    <div className="space-y-2">
                      <Label>Frete Grátis a partir de (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={config.entregas.freteGratis}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            entregas: { ...prev.entregas, freteGratis: Number.parseFloat(e.target.value) || 0 },
                          }))
                        }
                        className="bg-slate-50 dark:bg-slate-800 max-w-xs"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">Deixe 0 para desativar frete grátis</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSalvar}
                disabled={salvando}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
              >
                {salvando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
