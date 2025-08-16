import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react"

// Mock data para produtos
const produtos = [
  {
    id: "1",
    codigo: "PROD001",
    nome: "Parafuso M6x20mm",
    categoria: "Ferramentas",
    quantidade: 1250,
    quantidadeMinima: 100,
    precoUnitario: 0.85,
    fornecedor: "Metalúrgica Silva",
    localizacao: "Prateleira A-12",
    status: "normal",
    ultimaMovimentacao: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    codigo: "PROD002",
    nome: "Porca M6",
    categoria: "Ferramentas",
    quantidade: 45,
    quantidadeMinima: 200,
    precoUnitario: 0.35,
    fornecedor: "Metalúrgica Silva",
    localizacao: "Prateleira A-13",
    status: "baixa",
    ultimaMovimentacao: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    codigo: "PROD003",
    nome: "Arruela M6",
    categoria: "Ferramentas",
    quantidade: 3200,
    quantidadeMinima: 500,
    precoUnitario: 0.15,
    fornecedor: "Metalúrgica Silva",
    localizacao: "Prateleira A-14",
    status: "normal",
    ultimaMovimentacao: "2024-01-16T09:15:00Z"
  },
  {
    id: "4",
    codigo: "PROD004",
    nome: "Fita Isolante 3M",
    categoria: "Elétrica",
    quantidade: 78,
    quantidadeMinima: 50,
    precoUnitario: 12.50,
    fornecedor: "Distribuidora Elétrica",
    localizacao: "Prateleira B-05",
    status: "baixa",
    ultimaMovimentacao: "2024-01-13T14:20:00Z"
  },
  {
    id: "5",
    codigo: "PROD005",
    nome: "Cabo Flexível 2.5mm",
    categoria: "Elétrica",
    quantidade: 450,
    quantidadeMinima: 100,
    precoUnitario: 8.75,
    fornecedor: "Distribuidora Elétrica",
    localizacao: "Prateleira B-08",
    status: "normal",
    ultimaMovimentacao: "2024-01-15T11:30:00Z"
  },
  {
    id: "6",
    codigo: "PROD006",
    nome: "Interruptor Simples",
    categoria: "Elétrica",
    quantidade: 89,
    quantidadeMinima: 30,
    precoUnitario: 15.90,
    fornecedor: "Distribuidora Elétrica",
    localizacao: "Prateleira B-12",
    status: "normal",
    ultimaMovimentacao: "2024-01-16T08:45:00Z"
  },
  {
    id: "7",
    codigo: "PROD007",
    nome: "Tinta Branca 18L",
    categoria: "Pintura",
    quantidade: 12,
    quantidadeMinima: 5,
    precoUnitario: 89.90,
    fornecedor: "Tintas Coloridas",
    localizacao: "Prateleira C-03",
    status: "normal",
    ultimaMovimentacao: "2024-01-12T16:30:00Z"
  },
  {
    id: "8",
    codigo: "PROD008",
    nome: "Rolo de Pintura",
    categoria: "Pintura",
    quantidade: 23,
    quantidadeMinima: 10,
    precoUnitario: 18.50,
    fornecedor: "Tintas Coloridas",
    localizacao: "Prateleira C-05",
    status: "normal",
    ultimaMovimentacao: "2024-01-14T13:15:00Z"
  }
]

export default function ProdutosPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "baixa":
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Baixa</Badge>
      case "normal":
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Normal</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Produtos em Estoque
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os produtos e controle de estoque
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                aria-label="Buscar produtos"
              />
            </div>
            <Input
              placeholder="Categoria"
              aria-label="Filtrar por categoria"
            />
            <Input
              placeholder="Fornecedor"
              aria-label="Filtrar por fornecedor"
            />
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between" style={{ color: 'var(--foreground)' }}>
            <span>Lista de Produtos ({produtos.length})</span>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span>Total em valor: {formatCurrency(produtos.reduce((acc, p) => acc + (p.quantidade * p.precoUnitario), 0))}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Código</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Produto</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Categoria</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Quantidade</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Preço Unit.</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Valor Total</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Status</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Localização</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Última Mov.</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id} className="border-b hover:bg-muted/50" style={{ borderColor: 'var(--border)' }}>
                    <td className="p-3 font-mono text-sm" style={{ color: 'var(--foreground)' }}>
                      {produto.codigo}
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium" style={{ color: 'var(--foreground)' }}>
                          {produto.nome}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {produto.fornecedor}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{produto.categoria}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                          {produto.quantidade.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          min: {produto.quantidadeMinima}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>
                      {formatCurrency(produto.precoUnitario)}
                    </td>
                    <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>
                      {formatCurrency(produto.quantidade * produto.precoUnitario)}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(produto.status)}
                    </td>
                    <td className="p-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {produto.localizacao}
                    </td>
                    <td className="p-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {formatDate(produto.ultimaMovimentacao)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Produtos em Baixa
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>
                  {produtos.filter(p => p.status === 'baixa').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8" style={{ color: 'var(--destructive)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Total de Produtos
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {produtos.length}
                </p>
              </div>
              <Package className="h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Valor Total
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {formatCurrency(produtos.reduce((acc, p) => acc + (p.quantidade * p.precoUnitario), 0))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8" style={{ color: 'var(--success)' }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
