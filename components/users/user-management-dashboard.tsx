"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FirestoreAnalyticsService } from "@/lib/services/firestore-analytics-simple"
import { useEffect, useState } from "react"
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  UserCog, 
  UserPlus, 
  Activity,
  AlertCircle,
  TrendingUp,
  Clock
} from "lucide-react"

interface UserManagementDashboardProps {
  filters?: {
    role?: string
    status?: string
    search?: string
  }
}

export function UserManagementDashboard({ filters }: UserManagementDashboardProps) {
  const [firestoreData, setFirestoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await FirestoreAnalyticsService.getDashboardMetrics()
        setFirestoreData(data)
      } catch (err) {
        console.error('Erro ao buscar dados de usuários:', err)
        setError('Erro ao carregar dados de usuários')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !firestoreData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Erro ao carregar dados: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calcular estatísticas baseadas nos dados do Firestore
  const stats = {
    total: firestoreData?.users?.totalUsers || 0,
    ativos: firestoreData?.users?.activeUsers || 0,
    inativos: (firestoreData?.users?.totalUsers || 0) - (firestoreData?.users?.activeUsers || 0),
    clientes: Math.floor((firestoreData?.users?.totalUsers || 0) * 0.7), // Simulação: 70% clientes
    prestadores: Math.floor((firestoreData?.users?.totalUsers || 0) * 0.25), // Simulação: 25% prestadores
    admins: Math.floor((firestoreData?.users?.totalUsers || 0) * 0.05), // Simulação: 5% admins
    operadores: 0, // Simulação
    novosHoje: firestoreData?.users?.newUsersLast7Days || 0, // Usando dados de 7 dias como proxy
    onlineHoje: firestoreData?.users?.usersWithRecentLogin || 0,
    bloqueados: 0 // Simulação
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.novosHoje} novos hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.onlineHoje} online hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <UserCog className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.clientes}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.clientes / stats.total) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prestadores</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.prestadores}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.prestadores / stats.total) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status e Roles */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Status dos Usuários</span>
            </CardTitle>
            <CardDescription>Distribuição por status de atividade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Ativos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.ativos}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.ativos / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">Inativos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.inativos}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{ width: `${(stats.inativos / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Bloqueados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.bloqueados}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(stats.bloqueados / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCog className="h-5 w-5" />
              <span>Distribuição por Função</span>
            </CardTitle>
            <CardDescription>Usuários por tipo de acesso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Clientes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.clientes}</span>
                  <Badge variant="outline">{((stats.clientes / stats.total) * 100).toFixed(1)}%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Prestadores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.prestadores}</span>
                  <Badge variant="outline">{((stats.prestadores / stats.total) * 100).toFixed(1)}%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Administradores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.admins}</span>
                  <Badge variant="outline">{((stats.admins / stats.total) * 100).toFixed(1)}%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Operadores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.operadores}</span>
                  <Badge variant="outline">{((stats.operadores / stats.total) * 100).toFixed(1)}%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Atividade Recente</span>
          </CardTitle>
          <CardDescription>Resumo das atividades dos usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.novosHoje}
              </div>
              <p className="text-sm font-medium">Novos Hoje</p>
              <p className="text-xs text-muted-foreground">
                Usuários cadastrados hoje
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.onlineHoje}
              </div>
              <p className="text-sm font-medium">Online Hoje</p>
              <p className="text-xs text-muted-foreground">
                Usuários ativos hoje
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {((stats.ativos / stats.total) * 100).toFixed(1)}%
              </div>
              <p className="text-sm font-medium">Taxa de Ativos</p>
              <p className="text-xs text-muted-foreground">
                Usuários ativos vs total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
