"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, BarChart3, Users, DollarSign, Star, MapPin, Clock, CalendarIcon, Mail } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const reportTypes = [
  {
    id: "performance",
    name: "Performance de Prestadores",
    description: "Análise detalhada do desempenho dos prestadores",
    icon: Users,
  },
  {
    id: "satisfaction",
    name: "Satisfação do Cliente",
    description: "Relatório de avaliações e feedback dos clientes",
    icon: Star,
  },
  {
    id: "financial",
    name: "Análise Financeira",
    description: "Receitas, comissões e análise de pagamentos",
    icon: DollarSign,
  },
  {
    id: "geographic",
    name: "Análise Geográfica",
    description: "Distribuição de serviços por região",
    icon: MapPin,
  },
  {
    id: "operational",
    name: "Eficiência Operacional",
    description: "Tempo de atendimento e produtividade",
    icon: Clock,
  },
  {
    id: "growth",
    name: "Crescimento de Usuários",
    description: "Análise de crescimento e retenção",
    icon: BarChart3,
  },
]

const exportFormats = [
  { id: "pdf", name: "PDF", description: "Relatório formatado para impressão" },
  { id: "excel", name: "Excel", description: "Planilha com dados e gráficos" },
  { id: "csv", name: "CSV", description: "Dados brutos para análise" },
]

const scheduledReports = [
  {
    id: "1",
    name: "Relatório Mensal de Performance",
    type: "performance",
    frequency: "Mensal",
    nextRun: "2024-04-01",
    recipients: ["admin@appservico.com", "gerencia@appservico.com"],
    format: "pdf",
  },
  {
    id: "2",
    name: "Análise Semanal de Satisfação",
    type: "satisfaction",
    frequency: "Semanal",
    nextRun: "2024-03-18",
    recipients: ["qualidade@appservico.com"],
    format: "excel",
  },
  {
    id: "3",
    name: "Relatório Financeiro Quinzenal",
    type: "financial",
    frequency: "Quinzenal",
    nextRun: "2024-03-25",
    recipients: ["financeiro@appservico.com"],
    format: "pdf",
  },
]

export function ReportGenerator() {
  const [selectedReportType, setSelectedReportType] = useState<string>("")
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    // Here you would typically trigger the actual report generation
    alert("Relatório gerado com sucesso!")
  }

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      Semanal: "bg-blue-100 text-blue-800",
      Quinzenal: "bg-green-100 text-green-800",
      Mensal: "bg-purple-100 text-purple-800",
    }
    return <Badge className={colors[frequency as keyof typeof colors]}>{frequency}</Badge>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Report Generator */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Gerador de Relatórios</CardTitle>
          <CardDescription>Crie relatórios personalizados com base nos seus critérios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <Label className="text-base font-medium">Tipo de Relatório</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {reportTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReportType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedReportType(type.id)}
                >
                  <div className="flex items-start gap-3">
                    <type.icon className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{type.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-2 bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-2 bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Export Format */}
          <div>
            <Label className="text-base font-medium">Formato de Exportação</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {exportFormats.map((format) => (
                <div
                  key={format.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFormat === format.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <p className="font-medium text-sm">{format.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{format.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Options */}
          <div>
            <Label className="text-base font-medium">Opções do Relatório</Label>
            <div className="space-y-3 mt-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                <Label htmlFor="charts" className="text-sm">
                  Incluir gráficos e visualizações
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="rawdata" checked={includeRawData} onCheckedChange={setIncludeRawData} />
                <Label htmlFor="rawdata" className="text-sm">
                  Incluir dados brutos em anexo
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Recipients */}
          <div>
            <Label htmlFor="recipients">Destinatários (opcional)</Label>
            <Input
              id="recipients"
              placeholder="email1@exemplo.com, email2@exemplo.com"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-600 mt-1">Separe múltiplos emails com vírgula</p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateReport}
            disabled={!selectedReportType || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gerando Relatório...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Agendados</CardTitle>
          <CardDescription>Relatórios automáticos configurados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{report.name}</h4>
                  {getFrequencyBadge(report.frequency)}
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <span>Formato: {report.format.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" />
                    <span>Próxima execução: {new Date(report.nextRun).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>{report.recipients.length} destinatário(s)</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Executar Agora
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Agendar Novo Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
