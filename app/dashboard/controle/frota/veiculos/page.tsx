import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Truck, 
  Car,
  Bike,
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Wrench,
  MapPin,
  Calendar,
  User,
  Settings
} from "lucide-react"

// Mock data para veículos
const veiculos = [
  {
    id: "1",
    placa: "ABC-1234",
    modelo: "Fiat Ducato",
    marca: "Fiat",
    ano: 2022,
    tipo: "Van",
    motorista: "João Silva",
    status: "operacional",
    quilometragem: 45000,
    proximaManutencao: 50000,
    ultimaManutencao: "2024-01-10T00:00:00Z",
    consumoMedio: 8.5,
    combustivel: "Diesel",
    capacidade: "3.5 ton",
    localizacao: "Depósito Central",
    observacoes: "Veículo em excelente estado"
  },
  {
    id: "2",
    placa: "DEF-5678",
    modelo: "Mercedes-Benz Sprinter",
    marca: "Mercedes-Benz",
    ano: 2021,
    tipo: "Van",
    motorista: "Maria Santos",
    status: "manutencao",
    quilometragem: 78000,
    proximaManutencao: 80000,
    ultimaManutencao: "2024-01-05T00:00:00Z",
    consumoMedio: 9.2,
    combustivel: "Diesel",
    capacidade: "4.5 ton",
    localizacao: "Oficina",
    observacoes: "Em manutenção preventiva"
  },
  {
    id: "3",
    placa: "GHI-9012",
    modelo: "Ford Transit",
    marca: "Ford",
    ano: 2023,
    tipo: "Van",
    motorista: "Carlos Oliveira",
    status: "operacional",
    quilometragem: 12000,
    proximaManutencao: 15000,
    ultimaManutencao: "2024-01-15T00:00:00Z",
    consumoMedio: 7.8,
    combustivel: "Diesel",
    capacidade: "3.0 ton",
    localizacao: "Depósito Norte",
    observacoes: "Veículo novo"
  },
  {
    id: "4",
    placa: "JKL-3456",
    modelo: "Volkswagen Delivery",
    marca: "Volkswagen",
    ano: 2020,
    tipo: "Caminhão",
    motorista: "Ana Costa",
    status: "alerta",
    quilometragem: 95000,
    proximaManutencao: 100000,
    ultimaManutencao: "2023-12-20T00:00:00Z",
    consumoMedio: 6.5,
    combustivel: "Diesel",
    capacidade: "8.0 ton",
    localizacao: "Depósito Sul",
    observacoes: "Próximo da manutenção"
  },
  {
    id: "5",
    placa: "MNO-7890",
    modelo: "Iveco Daily",
    marca: "Iveco",
    ano: 2021,
    tipo: "Van",
    motorista: "Pedro Lima",
    status: "operacional",
    quilometragem: 35000,
    proximaManutencao: 40000,
    ultimaManutencao: "2024-01-08T00:00:00Z",
    consumoMedio: 8.0,
    combustivel: "Diesel",
    capacidade: "3.5 ton",
    localizacao: "Depósito Central",
    observacoes: "Veículo confiável"
  },
  {
    id: "6",
    placa: "PQR-1234",
    modelo: "Renault Master",
    marca: "Renault",
    ano: 2022,
    tipo: "Van",
    motorista: "Fernanda Rocha",
    status: "manutencao",
    quilometragem: 65000,
    proximaManutencao: 70000,
    ultimaManutencao: "2024-01-12T00:00:00Z",
    consumoMedio: 8.8,
    combustivel: "Diesel",
    capacidade: "4.0 ton",
    localizacao: "Oficina",
    observacoes: "Manutenção corretiva"
  },
  {
    id: "7",
    placa: "STU-5678",
    modelo: "Scania P270",
    marca: "Scania",
    ano: 2020,
    tipo: "Caminhão",
    motorista: "Roberto Alves",
    status: "operacional",
    quilometragem: 120000,
    proximaManutencao: 125000,
    ultimaManutencao: "2023-12-15T00:00:00Z",
    consumoMedio: 5.8,
    combustivel: "Diesel",
    capacidade: "12.0 ton",
    localizacao: "Depósito Central",
    observacoes: "Veículo robusto para cargas pesadas"
  },
  {
    id: "8",
    placa: "VWX-9012",
    modelo: "Honda CG 160",
    marca: "Honda",
    ano: 2023,
    tipo: "Moto",
    motorista: "Lucia Mendes",
    status: "operacional",
    quilometragem: 8000,
    proximaManutencao: 10000,
    ultimaManutencao: "2024-01-18T00:00:00Z",
    consumoMedio: 35.0,
    combustivel: "Gasolina",
    capacidade: "150kg",
    localizacao: "Depósito Central",
    observacoes: "Para entregas rápidas"
  }
]

export default function VeiculosPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operacional":
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Operacional</Badge>
      case "manutencao":
        return <Badge variant="destructive" className="flex items-center gap-1"><Wrench className="h-3 w-3" /> Manutenção</Badge>
      case "alerta":
        return <Badge variant="secondary" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Alerta</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Van":
        return <Truck className="h-4 w-4" />
      case "Caminhão":
        return <Truck className="h-4 w-4" />
      case "Moto":
        return <Bike className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatQuilometragem = (km: number) => {
    return km.toLocaleString('pt-BR')
  }

  const getQuilometragemStatus = (atual: number, proxima: number) => {
    const percentual = (atual / proxima) * 100
    if (percentual >= 90) return "text-red-600"
    if (percentual >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getEstatisticas = () => {
    const operacional = veiculos.filter(v => v.status === 'operacional').length
    const manutencao = veiculos.filter(v => v.status === 'manutencao').length
    const alerta = veiculos.filter(v => v.status === 'alerta').length
    const totalQuilometragem = veiculos.reduce((acc, v) => acc + v.quilometragem, 0)
    
    return { operacional, manutencao, alerta, totalQuilometragem }
  }

  const estatisticas = getEstatisticas()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Veículos da Frota
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os veículos e suas informações
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Operacional
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                  {estatisticas.operacional}
                </p>
              </div>
              <CheckCircle className="h-8 w-8" style={{ color: 'var(--success)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Em Manutenção
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>
                  {estatisticas.manutencao}
                </p>
              </div>
              <Wrench className="h-8 w-8" style={{ color: 'var(--destructive)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Alertas
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {estatisticas.alerta}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Total KM
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {formatQuilometragem(estatisticas.totalQuilometragem)}
                </p>
              </div>
              <MapPin className="h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
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
                placeholder="Buscar veículos..."
                className="pl-10"
                aria-label="Buscar veículos"
              />
            </div>
            <Input
              placeholder="Tipo de veículo"
              aria-label="Filtrar por tipo"
            />
            <Input
              placeholder="Status"
              aria-label="Filtrar por status"
            />
            <Input
              placeholder="Motorista"
              aria-label="Filtrar por motorista"
            />
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Veículos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between" style={{ color: 'var(--foreground)' }}>
            <span>Lista de Veículos ({veiculos.length})</span>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Placa</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Veículo</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Tipo</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Motorista</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Status</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Quilometragem</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Consumo</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Última Manut.</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Localização</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--foreground)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((veiculo) => (
                  <tr key={veiculo.id} className="border-b hover:bg-muted/50" style={{ borderColor: 'var(--border)' }}>
                    <td className="p-3">
                      <div className="font-mono font-bold" style={{ color: 'var(--foreground)' }}>
                        {veiculo.placa}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium" style={{ color: 'var(--foreground)' }}>
                          {veiculo.marca} {veiculo.modelo}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {veiculo.ano} • {veiculo.capacidade}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(veiculo.tipo)}
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {veiculo.tipo}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {veiculo.motorista}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(veiculo.status)}
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium" style={{ color: 'var(--foreground)' }}>
                          {formatQuilometragem(veiculo.quilometragem)} km
                        </div>
                        <div className={`text-xs ${getQuilometragemStatus(veiculo.quilometragem, veiculo.proximaManutencao)}`}>
                          Próxima: {formatQuilometragem(veiculo.proximaManutencao)} km
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {veiculo.consumoMedio} km/L
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {formatDate(veiculo.ultimaManutencao)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {veiculo.localizacao}
                        </span>
                      </div>
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
    </div>
  )
}
