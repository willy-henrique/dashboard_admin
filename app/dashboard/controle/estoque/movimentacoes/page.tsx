import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Package,
  User,
  Calendar,
  Clock
} from "lucide-react"

// Mock data para movimentações
const movimentacoes = [
  {
    id: "1",
    tipo: "entrada",
    produto: "Parafuso M6x20mm",
    codigo: "PROD001",
    quantidade: 500,
    quantidadeAnterior: 750,
    quantidadeNova: 1250,
    responsavel: "João Silva",
    fornecedor: "Metalúrgica Silva",
    notaFiscal: "NF-2024-001",
    data: "2024-01-15T10:30:00Z",
    observacoes: "Entrada de reposição de estoque"
  },
  {
    id: "2",
    tipo: "saida",
    produto: "Fita Isolante 3M",
    codigo: "PROD004",
    quantidade: 25,
    quantidadeAnterior: 103,
    quantidadeNova: 78,
    responsavel: "Maria Santos",
    cliente: "Cliente ABC",
    ordemServico: "OS-2024-045",
    data: "2024-01-14T15:45:00Z",
    observacoes: "Saída para serviço de manutenção"
  },
  {
    id: "3",
    tipo: "entrada",
    produto: "Cabo Flexível 2.5mm",
    codigo: "PROD005",
    quantidade: 200,
    quantidadeAnterior: 250,
    quantidadeNova: 450,
    responsavel: "Carlos Oliveira",
    fornecedor: "Distribuidora Elétrica",
    notaFiscal: "NF-2024-002",
    data: "2024-01-13T14:20:00Z",
    observacoes: "Compra programada"
  },
  {
    id: "4",
    tipo: "transferencia",
    produto: "Interruptor Simples",
    codigo: "PROD006",
    quantidade: 15,
    quantidadeAnterior: 104,
    quantidadeNova: 89,
    responsavel: "Ana Costa",
    origem: "Depósito Central",
    destino: "Depósito Norte",
    data: "2024-01-12T16:30:00Z",
    observacoes: "Transferência para atender demanda regional"
  },
  {
    id: "5",
    tipo: "saida",
    produto: "Tinta Branca 18L",
    codigo: "PROD007",
    quantidade: 3,
    quantidadeAnterior: 15,
    quantidadeNova: 12,
    responsavel: "Pedro Lima",
    cliente: "Cliente XYZ",
    ordemServico: "OS-2024-046",
    data: "2024-01-11T11:15:00Z",
    observacoes: "Saída para pintura de fachada"
  },
  {
    id: "6",
    tipo: "entrada",
    produto: "Rolo de Pintura",
    codigo: "PROD008",
    quantidade: 50,
    quantidadeAnterior: 0,
    quantidadeNova: 50,
    responsavel: "Fernanda Rocha",
    fornecedor: "Tintas Coloridas",
    notaFiscal: "NF-2024-003",
    data: "2024-01-10T09:45:00Z",
    observacoes: "Primeira entrada do produto"
  },
  {
    id: "7",
    tipo: "saida",
    produto: "Porca M6",
    codigo: "PROD002",
    quantidade: 155,
    quantidadeAnterior: 200,
    quantidadeNova: 45,
    responsavel: "Roberto Alves",
    cliente: "Cliente DEF",
    ordemServico: "OS-2024-047",
    data: "2024-01-09T13:20:00Z",
    observacoes: "Saída para montagem de equipamentos"
  },
  {
    id: "8",
    tipo: "transferencia",
    produto: "Arruela M6",
    codigo: "PROD003",
    quantidade: 300,
    quantidadeAnterior: 3500,
    quantidadeNova: 3200,
    responsavel: "Lucia Mendes",
    origem: "Depósito Central",
    destino: "Depósito Sul",
    data: "2024-01-08T10:10:00Z",
    observacoes: "Transferência para balanceamento de estoque"
  }
]

export default function MovimentacoesPage() {
  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "entrada":
        return <Badge variant="default" className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Entrada</Badge>
      case "saida":
        return <Badge variant="destructive" className="flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Saída</Badge>
      case "transferencia":
        return <Badge variant="secondary" className="flex items-center gap-1"><ArrowRight className="h-3 w-3" /> Transferência</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getResponsavelInfo = (movimentacao: any) => {
    if (movimentacao.tipo === 'entrada') {
      return {
        label: 'Fornecedor',
        value: movimentacao.fornecedor,
        document: movimentacao.notaFiscal
      }
    } else if (movimentacao.tipo === 'saida') {
      return {
        label: 'Cliente',
        value: movimentacao.cliente,
        document: movimentacao.ordemServico
      }
    } else {
      return {
        label: 'Destino',
        value: movimentacao.destino,
        document: `De: ${movimentacao.origem}`
      }
    }
  }

  const getEstatisticas = () => {
    const entradas = movimentacoes.filter(m => m.tipo === 'entrada').length
    const saidas = movimentacoes.filter(m => m.tipo === 'saida').length
    const transferencias = movimentacoes.filter(m => m.tipo === 'transferencia').length
    const totalQuantidade = movimentacoes.reduce((acc, m) => acc + m.quantidade, 0)
    
    return { entradas, saidas, transferencias, totalQuantidade }
  }

  const estatisticas = getEstatisticas()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Movimentações de Estoque
          </h1>
          <p className="text-muted-foreground">
            Acompanhe entradas, saídas e transferências de produtos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Movimentação
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Entradas
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                  {estatisticas.entradas}
                </p>
              </div>
              <TrendingUp className="h-8 w-8" style={{ color: 'var(--success)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Saídas
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>
                  {estatisticas.saidas}
                </p>
              </div>
              <TrendingDown className="h-8 w-8" style={{ color: 'var(--destructive)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Transferências
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {estatisticas.transferencias}
                </p>
              </div>
              <ArrowRight className="h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Total Movimentado
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {estatisticas.totalQuantidade.toLocaleString('pt-BR')}
                </p>
              </div>
              <Package className="h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                aria-label="Buscar produtos"
              />
            </div>
            <Input
              placeholder="Tipo de movimentação"
              aria-label="Filtrar por tipo"
            />
            <Input
              placeholder="Responsável"
              aria-label="Filtrar por responsável"
            />
            <Input
              type="date"
              aria-label="Filtrar por data"
            />
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between" style={{ color: 'var(--foreground)' }}>
            <span>Histórico de Movimentações ({movimentacoes.length})</span>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <Clock className="h-4 w-4" />
              <span>Últimos 30 dias</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Data/Hora</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Tipo</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Produto</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Quantidade</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Responsável</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Origem/Destino</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Documento</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((movimentacao) => {
                  const info = getResponsavelInfo(movimentacao)
                  return (
                    <tr key={movimentacao.id} className="border-b hover:bg-muted/50" style={{ borderColor: 'var(--border)' }}>
                      <td className="p-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {formatDate(movimentacao.data)}
                      </td>
                      <td className="p-3">
                        {getTipoBadge(movimentacao.tipo)}
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium" style={{ color: 'var(--foreground)' }}>
                            {movimentacao.produto}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                            {movimentacao.codigo}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                            {movimentacao.quantidade.toLocaleString('pt-BR')}
                          </span>
                          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            {movimentacao.quantidadeAnterior} → {movimentacao.quantidadeNova}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                          <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                            {movimentacao.responsavel}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                            {info.label}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                            {info.value}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {info.document}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
