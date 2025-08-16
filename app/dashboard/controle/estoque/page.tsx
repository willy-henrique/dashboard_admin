import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  ClipboardList,
  Truck,
  Warehouse,
  Activity
} from "lucide-react"

export default function EstoquePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Controle de Estoque
          </h1>
          <p className="text-muted-foreground">
            Gerencie produtos, controle de entrada/saída e acompanhe movimentações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>1,247</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Produtos em Baixa
            </CardTitle>
            <AlertTriangle className="h-4 w-4" style={{ color: 'var(--destructive)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>23</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              -5% em relação à semana anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Entradas (Mês)
            </CardTitle>
            <TrendingUp className="h-4 w-4" style={{ color: 'var(--success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>156</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Saídas (Mês)
            </CardTitle>
            <TrendingDown className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>89</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              -3% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Navegação */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <ClipboardList className="h-5 w-5" />
              Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Visualize e gerencie todos os produtos em estoque
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>1,247</span>
              <Button variant="ghost" size="sm">
                Ver todos →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Truck className="h-5 w-5" />
              Movimentações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Acompanhe entradas, saídas e transferências
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>245</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Warehouse className="h-5 w-5" />
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Organize produtos por categorias e famílias
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>18</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <BarChart3 className="h-5 w-5" />
              Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Relatórios de estoque, giro e valorização
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>R$ 45.2k</span>
              <Button variant="ghost" size="sm">
                Gerar →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Activity className="h-5 w-5" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Configure alertas de estoque mínimo e máximo
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>23</span>
              <Button variant="ghost" size="sm">
                Configurar →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Upload className="h-5 w-5" />
              Importar/Exportar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Importe e exporte dados de estoque
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Importar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: 'var(--foreground)' }}>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Adicionar Produto</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Truck className="h-6 w-6" />
              <span>Nova Entrada</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <TrendingDown className="h-6 w-6" />
              <span>Nova Saída</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Relatório</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
