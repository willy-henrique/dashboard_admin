import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  FileText,
  PieChart,
  Activity,
  Filter,
  Search,
  Eye,
  Printer,
  Share2
} from "lucide-react"

const reports = [
  {
    id: "1",
    nome: "Relatório de Receitas e Despesas",
    tipo: "mensal",
    periodo: "Janeiro 2025",
    status: "disponivel",
    formato: "PDF",
    tamanho: "2.3 MB",
    ultimaGeracao: "2025-01-15",
  },
  {
    id: "2",
    nome: "Análise de Fluxo de Caixa",
    tipo: "trimestral",
    periodo: "Q4 2024",
    status: "disponivel",
    formato: "Excel",
    tamanho: "1.8 MB",
    ultimaGeracao: "2025-01-10",
  },
  {
    id: "3",
    nome: "Relatório de Faturamento",
    tipo: "mensal",
    periodo: "Dezembro 2024",
    status: "processando",
    formato: "PDF",
    tamanho: "3.1 MB",
    ultimaGeracao: "2025-01-05",
  },
  {
    id: "4",
    nome: "Análise de Inadimplência",
    tipo: "semanal",
    periodo: "Semana 02/2025",
    status: "disponivel",
    formato: "Excel",
    tamanho: "0.9 MB",
    ultimaGeracao: "2025-01-12",
  },
  {
    id: "5",
    nome: "Relatório de Comissões",
    tipo: "mensal",
    periodo: "Janeiro 2025",
    status: "disponivel",
    formato: "PDF",
    tamanho: "1.5 MB",
    ultimaGeracao: "2025-01-14",
  },
  {
    id: "6",
    nome: "Balanço Patrimonial",
    tipo: "trimestral",
    periodo: "Q4 2024",
    status: "pendente",
    formato: "PDF",
    tamanho: "4.2 MB",
    ultimaGeracao: "2025-01-08",
  },
]

const reportTypes = [
  { id: "receitas-despesas", nome: "Receitas e Despesas", icon: TrendingUp },
  { id: "fluxo-caixa", nome: "Fluxo de Caixa", icon: Activity },
  { id: "faturamento", nome: "Faturamento", icon: DollarSign },
  { id: "inadimplencia", nome: "Inadimplência", icon: FileText },
  { id: "comissoes", nome: "Comissões", icon: TrendingUp },
  { id: "balanco", nome: "Balanço Patrimonial", icon: BarChart3 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "disponivel":
      return "bg-green-100 text-green-800"
    case "processando":
      return "bg-yellow-100 text-yellow-800"
    case "pendente":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "mensal":
      return "bg-blue-100 text-blue-800"
    case "trimestral":
      return "bg-purple-100 text-purple-800"
    case "semanal":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Relatórios Financeiros
          </h1>
          <p className="text-muted-foreground">
            Gere e visualize relatórios financeiros detalhados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Total de Relatórios
            </CardTitle>
            <BarChart3 className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>24</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +3 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Disponíveis
            </CardTitle>
            <FileText className="h-4 w-4" style={{ color: 'var(--success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>18</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              75% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Em Processamento
            </CardTitle>
            <Activity className="h-4 w-4" style={{ color: 'var(--warning)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>3</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              12.5% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Downloads (Mês)
            </CardTitle>
            <Download className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>156</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +23% este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tipos de Relatório */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: 'var(--foreground)' }}>Tipos de Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <Card key={type.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>
                          {type.nome}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Relatório detalhado
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relatórios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--foreground)' }}>Relatórios Disponíveis</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                <Input
                  placeholder="Buscar relatórios..."
                  className="pl-20 w-64"
                  aria-label="Buscar relatórios"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {report.nome}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTipoColor(report.tipo)}>
                        {report.tipo}
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {report.periodo}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Formato: {report.formato}</span>
                      <span>Tamanho: {report.tamanho}</span>
                      <span>Última geração: {report.ultimaGeracao}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-1" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relatórios em Destaque */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Relatórios Mais Baixados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      Relatório de Receitas e Despesas
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Janeiro 2025
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  45 downloads
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      Análise de Fluxo de Caixa
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Q4 2024
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  32 downloads
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      Relatório de Faturamento
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Dezembro 2024
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  28 downloads
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      Relatório Mensal
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Geração automática
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Amanhã
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      Balanço Trimestral
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Geração automática
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Próxima semana
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      Análise de Inadimplência
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Geração semanal
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-800">
                  Segunda-feira
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
