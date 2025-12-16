"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { updateStoreSettings } from "@/app/_actions/settings"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { NumericFormat } from "react-number-format"
import {
  Store, Clock, CreditCard, Truck, Upload, Phone, MessageCircle,
  Save, Plus, Trash2, ChefHat, QrCode, Banknote, Wallet, MapPin, ImageIcon
} from "lucide-react"

// Dias fixos para o loop
const DIAS_SEMANA = [
  { id: "dom", label: "D", nome: "Domingo" },
  { id: "seg", label: "S", nome: "Segunda" },
  { id: "ter", label: "T", nome: "Terça" },
  { id: "qua", label: "Q", nome: "Quarta" },
  { id: "qui", label: "Q", nome: "Quinta" },
  { id: "sex", label: "S", nome: "Sexta" },
  { id: "sab", label: "S", nome: "Sábado" },
]

export default function ConfiguracoesClient({ initialData }: { initialData: any }) {
  // Mapeia os dados do banco para o formato do estado local
  const [config, setConfig] = useState({
    geral: {
      logo: initialData?.logoUrl || "",
      nomeConfeitaria: initialData?.nomeConfeitaria || "",
      telefone: initialData?.telefone || "",
      whatsapp: initialData?.whatsapp || "",
      descricao: initialData?.descricao || "",
      endereco: initialData?.endereco || "",
    },
    cardapio: {
      aberto: initialData?.lojaAberta ?? true,
      horaAbertura: initialData?.horaAbertura || "08:00",
      horaFechamento: initialData?.horaFechamento || "18:00",
      diasFuncionamento: initialData?.diasFuncionamento || [],
      tempoPreparo: initialData?.tempoPreparo || "2-3 dias",
      aceitaEncomendas: initialData?.aceitaEncomendas ?? true,
    },
    pagamentos: {
      pix: initialData?.aceitaPix ?? true,
      chavePix: initialData?.chavePix || "",
      tipoChavePix: initialData?.tipoChavePix || "email",
      cartao: initialData?.aceitaCartao ?? true,
      dinheiro: initialData?.aceitaDinheiro ?? true,
    },
    entregas: {
      tipoTaxa: initialData?.tipoTaxaEntrega || "fixa",
      taxaFixa: initialData?.taxaFixa || 0,
      bairros: initialData?.bairros || [],
      retiradaLocal: initialData?.retiradaLocal ?? true,
      freteGratis: initialData?.freteGratis || 0,
    },
  })

  const [activeTab, setActiveTab] = useState("geral")
  const [novoBairro, setNovoBairro] = useState({ nome: "", taxa: "" })
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    setSalvando(true)
    try {
        const result = await updateStoreSettings(config)
        if (result.success) {
            toast.success("Configurações salvas com sucesso!")
        } else {
            toast.error("Erro ao salvar.")
        }
    } catch (e) {
        toast.error("Erro inesperado.")
    } finally {
        setSalvando(false)
    }
  }

  const toggleDia = (dia: string) => {
    setConfig((prev) => {
        const currentDays = prev.cardapio.diasFuncionamento as string[]
        return {
            ...prev,
            cardapio: {
                ...prev.cardapio,
                diasFuncionamento: currentDays.includes(dia)
                ? currentDays.filter((d) => d !== dia)
                : [...currentDays, dia],
            },
        }
    })
  }

  const adicionarBairro = () => {
    if (novoBairro.nome && novoBairro.taxa) {
      setConfig((prev) => ({
        ...prev,
        entregas: {
          ...prev.entregas,
          bairros: [
            ...prev.entregas.bairros,
            // ID temporário negativo para não conflitar com o banco, o back vai recriar
            { id: -Date.now(), nome: novoBairro.nome, taxa: Number.parseFloat(novoBairro.taxa.replace(',', '.')) },
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
        bairros: prev.entregas.bairros.filter((b: any) => b.id !== id),
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
              <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <TabsTrigger value="geral" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"><Store className="w-4 h-4" /><span className="hidden sm:inline">Geral</span></TabsTrigger>
                <TabsTrigger value="cardapio" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"><Clock className="w-4 h-4" /><span className="hidden sm:inline">Cardápio</span></TabsTrigger>
                <TabsTrigger value="pagamentos" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"><CreditCard className="w-4 h-4" /><span className="hidden sm:inline">Pagamentos</span></TabsTrigger>
                <TabsTrigger value="entregas" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg"><Truck className="w-4 h-4" /><span className="hidden sm:inline">Entregas</span></TabsTrigger>
              </TabsList>

              {/* === TAB GERAL === */}
              <TabsContent value="geral" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2"><Store className="w-5 h-5 text-blue-500" />Informações da Loja</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-2xl bg-slate-100 border-2 border-dashed flex items-center justify-center overflow-hidden">
                          {config.geral.logo ? <img src={config.geral.logo} alt="Logo" className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-slate-400" />}
                        </div>
                        <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-500"><Upload className="w-4 h-4" /></Button>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label>Logo da Confeitaria</Label>
                        <p className="text-xs text-slate-500">Recomendado: 200x200px</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info("Funcionalidade de upload será implementada em breve!")}>Fazer Upload</Button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nome da Confeitaria</Label>
                        <Input value={config.geral.nomeConfeitaria} onChange={(e) => setConfig((prev) => ({ ...prev, geral: { ...prev.geral, nomeConfeitaria: e.target.value } }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Endereço</Label>
                        <Input value={config.geral.endereco} onChange={(e) => setConfig((prev) => ({ ...prev, geral: { ...prev.geral, endereco: e.target.value } }))} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Usando NumericFormat para telefones também pode ser útil, mas Input simples serve por enquanto */}
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input value={config.geral.telefone} onChange={(e) => setConfig((prev) => ({ ...prev, geral: { ...prev.geral, telefone: e.target.value } }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>WhatsApp</Label>
                        <Input value={config.geral.whatsapp} onChange={(e) => setConfig((prev) => ({ ...prev, geral: { ...prev.geral, whatsapp: e.target.value } }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea rows={3} value={config.geral.descricao} onChange={(e) => setConfig((prev) => ({ ...prev, geral: { ...prev.geral, descricao: e.target.value } }))} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* === TAB CARDÁPIO === */}
              <TabsContent value="cardapio" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg font-semibold flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Horário de Funcionamento</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${config.cardapio.aberto ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        <div><p className="font-medium">Status da Loja</p><p className="text-sm text-slate-500">{config.cardapio.aberto ? "Aceitando pedidos" : "Fechado"}</p></div>
                      </div>
                      <Switch checked={config.cardapio.aberto} onCheckedChange={(c) => setConfig(prev => ({...prev, cardapio: {...prev.cardapio, aberto: c}}))} />
                    </div>

                    <div className="space-y-3">
                      <Label>Dias de Funcionamento</Label>
                      <div className="flex gap-2 flex-wrap">
                        {DIAS_SEMANA.map((dia) => (
                          <Button key={dia.id} type="button" variant={(config.cardapio.diasFuncionamento as string[]).includes(dia.id) ? "default" : "outline"} size="sm" onClick={() => toggleDia(dia.id)} 
                            className={`w-10 h-10 rounded-full p-0 ${(config.cardapio.diasFuncionamento as string[]).includes(dia.id) ? "bg-blue-500 text-white" : ""}`}>
                            {dia.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2"><Label>Abre às</Label><Input type="time" value={config.cardapio.horaAbertura} onChange={(e) => setConfig(prev => ({...prev, cardapio: {...prev.cardapio, horaAbertura: e.target.value}}))} /></div>
                        <div className="space-y-2"><Label>Fecha às</Label><Input type="time" value={config.cardapio.horaFechamento} onChange={(e) => setConfig(prev => ({...prev, cardapio: {...prev.cardapio, horaFechamento: e.target.value}}))} /></div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div><p className="font-medium">Aceitar Encomendas</p><p className="text-sm text-slate-500">Agendamentos futuros</p></div>
                      <Switch checked={config.cardapio.aceitaEncomendas} onCheckedChange={(c) => setConfig(prev => ({...prev, cardapio: {...prev.cardapio, aceitaEncomendas: c}}))} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* === TAB PAGAMENTOS === */}
              <TabsContent value="pagamentos" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg font-semibold flex items-center gap-2"><CreditCard className="w-5 h-5 text-violet-500" /> Métodos de Pagamento</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><QrCode className="w-5 h-5 text-emerald-600" /></div>
                          <p className="font-medium">PIX</p>
                        </div>
                        <Switch checked={config.pagamentos.pix} onCheckedChange={(c) => setConfig(prev => ({...prev, pagamentos: {...prev.pagamentos, pix: c}}))} />
                      </div>
                      {config.pagamentos.pix && (
                        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t">
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select value={config.pagamentos.tipoChavePix} onValueChange={(v) => setConfig(prev => ({...prev, pagamentos: {...prev.pagamentos, tipoChavePix: v}}))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cpf">CPF</SelectItem>
                                    <SelectItem value="cnpj">CNPJ</SelectItem>
                                    <SelectItem value="email">E-mail</SelectItem>
                                    <SelectItem value="telefone">Telefone</SelectItem>
                                    <SelectItem value="aleatoria">Aleatória</SelectItem>
                                </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Chave PIX</Label>
                            <Input value={config.pagamentos.chavePix} onChange={(e) => setConfig(prev => ({...prev, pagamentos: {...prev.pagamentos, chavePix: e.target.value}}))} placeholder="Sua chave" />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Cartão e Dinheiro (Simplificados visualmente) */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><CreditCard className="w-5 h-5 text-blue-600" /></div><p className="font-medium">Cartão (Maquininha)</p></div>
                        <Switch checked={config.pagamentos.cartao} onCheckedChange={(c) => setConfig(prev => ({...prev, pagamentos: {...prev.pagamentos, cartao: c}}))} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Banknote className="w-5 h-5 text-amber-600" /></div><p className="font-medium">Dinheiro</p></div>
                        <Switch checked={config.pagamentos.dinheiro} onCheckedChange={(c) => setConfig(prev => ({...prev, pagamentos: {...prev.pagamentos, dinheiro: c}}))} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* === TAB ENTREGAS === */}
              <TabsContent value="entregas" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg font-semibold flex items-center gap-2"><Truck className="w-5 h-5 text-emerald-500" /> Entregas</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Store className="w-5 h-5 text-blue-600" /></div><p className="font-medium">Retirada no Local</p></div>
                        <Switch checked={config.entregas.retiradaLocal} onCheckedChange={(c) => setConfig(prev => ({...prev, entregas: {...prev.entregas, retiradaLocal: c}}))} />
                    </div>

                    <div className="space-y-3">
                        <Label>Tipo de Taxa</Label>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfig(prev => ({...prev, entregas: {...prev.entregas, tipoTaxa: "fixa"}}))} className={`p-4 rounded-xl border-2 text-left ${config.entregas.tipoTaxa === "fixa" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200"}`}>
                                <div className="flex items-center gap-2 mb-1"><Wallet className="w-4 h-4 text-blue-500" /><span className="font-medium">Taxa Fixa</span></div>
                                <p className="text-xs text-slate-500">Valor único para todos</p>
                            </button>
                            <button type="button" onClick={() => setConfig(prev => ({...prev, entregas: {...prev.entregas, tipoTaxa: "bairro"}}))} className={`p-4 rounded-xl border-2 text-left ${config.entregas.tipoTaxa === "bairro" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200"}`}>
                                <div className="flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-emerald-500" /><span className="font-medium">Por Bairro</span></div>
                                <p className="text-xs text-slate-500">Valor varia por região</p>
                            </button>
                        </div>
                    </div>

                    {config.entregas.tipoTaxa === "fixa" && (
                        <div className="space-y-2"><Label>Valor da Taxa Fixa</Label>
                            <NumericFormat value={config.entregas.taxaFixa} thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale prefix="R$ " customInput={Input} onValueChange={(v) => setConfig(prev => ({...prev, entregas: {...prev.entregas, taxaFixa: v.floatValue ?? 0}}))} />
                        </div>
                    )}

                    {config.entregas.tipoTaxa === "bairro" && (
                        <div className="space-y-4">
                            <Label>Bairros e Taxas</Label>
                            <div className="rounded-xl border overflow-hidden">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Bairro</TableHead><TableHead className="text-right">Taxa</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {config.entregas.bairros.map((b: any) => (
                                            <TableRow key={b.id}>
                                                <TableCell>{b.nome}</TableCell>
                                                <TableCell className="text-right">R$ {Number(b.taxa).toFixed(2)}</TableCell>
                                                <TableCell><Button variant="ghost" size="sm" onClick={() => removerBairro(b.id)}><Trash2 className="w-4 h-4 text-rose-500" /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex gap-2 items-end">
                                <div className="flex-1 space-y-2"><Label>Nome</Label><Input value={novoBairro.nome} onChange={e => setNovoBairro({...novoBairro, nome: e.target.value})} placeholder="Ex: Centro" /></div>
                                <div className="w-32 space-y-2"><Label>Taxa</Label><NumericFormat value={novoBairro.taxa} thousandSeparator="." decimalSeparator="," prefix="R$ " customInput={Input} onValueChange={(v) => setNovoBairro({...novoBairro, taxa: v.value})} /></div>
                                <Button onClick={adicionarBairro}><Plus className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2"><Label>Frete Grátis acima de</Label>
                        <NumericFormat value={config.entregas.freteGratis} thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale prefix="R$ " customInput={Input} onValueChange={(v) => setConfig(prev => ({...prev, entregas: {...prev.entregas, freteGratis: v.floatValue ?? 0}}))} />
                        <p className="text-xs text-slate-500">Deixe R$ 0,00 para desativar</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-6">
                <Button onClick={handleSalvar} disabled={salvando} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-12 text-lg shadow-lg shadow-blue-500/20">
                    {salvando ? "Salvando..." : <><Save className="w-5 h-5 mr-2" /> Salvar Configurações</>}
                </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}