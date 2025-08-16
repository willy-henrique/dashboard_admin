import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Truck, 
  Car, 
  Motorcycle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  ClipboardList,
  MapPin,
  Fuel,
  Wrench,
  Activity,
  Users,
  Route,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

export default function FrotaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Gestão de Frota
          </h1>
          <p className="text-muted-foreground">
            Gerencie veículos, motoristas, manutenções e rotas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Veículo
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Total de Veículos
            </CardTitle>
            <Truck className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>24</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +2 veículos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Em Manutenção
            </CardTitle>
            <Wrench className="h-4 w-4" style={{ color: 'var(--destructive)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>3</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              12.5% da frota
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Motoristas Ativos
            </CardTitle>
            <Users className="h-4 w-4" style={{ color: 'var(--success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>18</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              75% da frota operacional
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Consumo Médio
            </CardTitle>
            <Fuel className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>8.5 km/L</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              -0.3 km/L este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Navegação */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Truck className="h-5 w-5" />
              Veículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Gerencie todos os veículos da frota
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>24</span>
              <Button variant="ghost" size="sm">
                Ver todos →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Users className="h-5 w-5" />
              Motoristas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Gerencie motoristas e suas permissões
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>18</span>
              <Button variant="ghost" size="sm">
                Ver todos →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Wrench className="h-5 w-5" />
              Manutenções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Controle de manutenções preventivas e corretivas
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>7</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Route className="h-5 w-5" />
              Rotas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Planeje e acompanhe rotas de entrega
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>12</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Fuel className="h-5 w-5" />
              Combustível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Controle de abastecimentos e consumo
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>R$ 15.2k</span>
              <Button variant="ghost" size="sm">
                Ver relatórios →
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
              Relatórios de performance e custos
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                Gerar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status da Frota */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Activity className="h-5 w-5" />
            Status da Frota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Operacional</span>
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  21 veículos
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Em Manutenção</span>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  3 veículos
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '12.5%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Alertas</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  2 veículos
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '8.3%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: 'var(--foreground)' }}>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Adicionar Veículo</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Novo Motorista</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Wrench className="h-6 w-6" />
              <span>Agendar Manutenção</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Route className="h-6 w-6" />
              <span>Nova Rota</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
