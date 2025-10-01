import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  ClipboardList, 
  Truck, 
  Users, 
  UserCheck, 
  Package, 
  Download, 
  Building, 
  Wrench, 
  BarChart3,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Shield,
  Bell,
  FileText,
  MapPin
} from "lucide-react"

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Configurações do Sistema
          </h1>
          <p className="text-muted-foreground">
            Gerencie todas as configurações e parâmetros do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Configuração
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Configurações Ativas
            </CardTitle>
            <Settings className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>156</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +12 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Checklists
            </CardTitle>
            <ClipboardList className="h-4 w-4" style={{ color: 'var(--success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>24</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              8 em uso ativo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Clientes/Fornecedores
            </CardTitle>
            <Users className="h-4 w-4" style={{ color: 'var(--warning)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>1,247</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +45 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Filiais
            </CardTitle>
            <Building className="h-4 w-4" style={{ color: 'var(--info)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--info)' }}>12</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Todas operacionais
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
              Checklists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Gerencie checklists para diferentes tipos de serviço
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
              Clientes e Fornecedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Cadastro e gestão de clientes e fornecedores
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
              <UserCheck className="h-5 w-5" />
              Equipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Gestão de equipes e responsabilidades
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
              <Download className="h-5 w-5" />
              Exportador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Configurações de exportação de dados
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>12</span>
              <Button variant="ghost" size="sm">
                Ver todos →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Building className="h-5 w-5" />
              Filiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Gestão de filiais e unidades
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
              <Wrench className="h-5 w-5" />
              Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Configurações de manutenção preventiva
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>32</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Settings className="h-5 w-5" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Configurações gerais do sistema
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>28</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status do Sistema */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Sistema Operacional</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Todos os serviços funcionando
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Database className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Banco de Dados</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Conexão estável
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">Conectado</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Último Backup</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Há 2 horas
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-yellow-600">Pendente</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Alertas e Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                    Backup Pendente
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Último backup realizado há mais de 24h
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                    Atualização Disponível
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Nova versão do sistema disponível
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                    Segurança Atualizada
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Todas as configurações de segurança OK
                  </p>
                </div>
              </div>
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
              <Database className="h-6 w-6" />
              <span>Backup Manual</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Shield className="h-6 w-6" />
              <span>Verificar Segurança</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Gerar Relatório</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Settings className="h-6 w-6" />
              <span>Configurações Avançadas</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
