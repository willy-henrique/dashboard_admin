import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  UserCheck, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  RefreshCw,
  Upload,
  Eye,
  Users,
  MapPin,
  Phone,
  Mail,
  Shield
} from "lucide-react"

const equipes = [
  {
    id: "1",
    nome: "Equipe Técnica SP",
    responsavel: "João Silva",
    membros: 8,
    especialidade: "Manutenção Elétrica",
    filial: "Matriz São Paulo",
    telefone: "(11) 3000-0000",
    email: "equipe.sp@autem.com.br",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Equipe Hidráulica RJ",
    responsavel: "Maria Santos",
    membros: 6,
    especialidade: "Manutenção Hidráulica",
    filial: "Filial Rio de Janeiro",
    telefone: "(21) 4000-0000",
    email: "equipe.rj@autem.com.br",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Equipe Emergência BH",
    responsavel: "Pedro Costa",
    membros: 10,
    especialidade: "Atendimento de Emergência",
    filial: "Filial Belo Horizonte",
    telefone: "(31) 5000-0000",
    email: "emergencia.bh@autem.com.br",
    status: "ativo",
  },
  {
    id: "4",
    nome: "Equipe Preventiva DF",
    responsavel: "Ana Oliveira",
    membros: 5,
    especialidade: "Manutenção Preventiva",
    filial: "Filial Brasília",
    telefone: "(61) 6000-0000",
    email: "preventiva.df@autem.com.br",
    status: "ativo",
  },
  {
    id: "5",
    nome: "Equipe Residencial BA",
    responsavel: "Carlos Lima",
    membros: 7,
    especialidade: "Serviços Residenciais",
    filial: "Filial Salvador",
    telefone: "(71) 7000-0000",
    email: "residencial.ba@autem.com.br",
    status: "ativo",
  },
  {
    id: "6",
    nome: "Equipe Comercial PE",
    responsavel: "Fernanda Rocha",
    membros: 4,
    especialidade: "Serviços Comerciais",
    filial: "Filial Recife",
    telefone: "(81) 8000-0000",
    email: "comercial.pe@autem.com.br",
    status: "ativo",
  },
  {
    id: "7",
    nome: "Equipe Industrial CE",
    responsavel: "Roberto Alves",
    membros: 12,
    especialidade: "Manutenção Industrial",
    filial: "Filial Fortaleza",
    telefone: "(85) 9000-0000",
    email: "industrial.ce@autem.com.br",
    status: "ativo",
  },
  {
    id: "8",
    nome: "Equipe Especializada PR",
    responsavel: "Lucia Ferreira",
    membros: 6,
    especialidade: "Serviços Especializados",
    filial: "Filial Curitiba",
    telefone: "(41) 1000-0000",
    email: "especializada.pr@autem.com.br",
    status: "ativo",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo":
      return "bg-green-100 text-green-800"
    case "inativo":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getEspecialidadeColor = (especialidade: string) => {
  switch (especialidade) {
    case "Manutenção Elétrica":
      return "bg-yellow-100 text-yellow-800"
    case "Manutenção Hidráulica":
      return "bg-blue-100 text-blue-800"
    case "Atendimento de Emergência":
      return "bg-red-100 text-red-800"
    case "Manutenção Preventiva":
      return "bg-green-100 text-green-800"
    case "Serviços Residenciais":
      return "bg-purple-100 text-purple-800"
    case "Serviços Comerciais":
      return "bg-orange-100 text-orange-800"
    case "Manutenção Industrial":
      return "bg-gray-100 text-gray-800"
    case "Serviços Especializados":
      return "bg-pink-100 text-pink-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function EquipesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Equipes
          </h1>
          <p className="text-muted-foreground">
            autem.com.br › configurações › equipes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Equipe
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Total de Equipes
            </CardTitle>
            <UserCheck className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{equipes.length}</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Equipes ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Total de Membros
            </CardTitle>
            <Users className="h-4 w-4" style={{ color: 'var(--success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
              {equipes.reduce((total, equipe) => total + equipe.membros, 0)}
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Profissionais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Especialidades
            </CardTitle>
            <Shield className="h-4 w-4" style={{ color: 'var(--warning)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
              {new Set(equipes.map(e => e.especialidade)).size}
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Diferentes especialidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Filiais
            </CardTitle>
            <MapPin className="h-4 w-4" style={{ color: 'var(--info)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--info)' }}>
              {new Set(equipes.map(e => e.filial)).size}
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Filiais atendidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
            <Input 
              placeholder="Buscar equipes..." 
              className="pl-12 w-64" 
              aria-label="Buscar equipes"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Equipe
          </Button>
        </div>
      </div>

      {/* Tabela de Equipes */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: 'var(--foreground)' }}>Equipes Cadastradas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: 'var(--foreground)' }}>
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Nome da Equipe</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Responsável</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Membros</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Especialidade</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Filial</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Contato</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Status</TableHead>
                <TableHead className="text-right" style={{ color: 'var(--foreground)' }}>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipes.map((equipe) => (
                <TableRow key={equipe.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell className="font-medium" style={{ color: 'var(--foreground)' }}>
                    {equipe.nome}
                  </TableCell>
                  <TableCell style={{ color: 'var(--foreground)' }}>
                    {equipe.responsavel}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {equipe.membros} membros
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEspecialidadeColor(equipe.especialidade)}>
                      {equipe.especialidade}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ color: 'var(--foreground)' }}>
                    {equipe.filial}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {equipe.telefone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {equipe.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(equipe.status)}>
                      {equipe.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Mostrando de 1 até {equipes.length} de {equipes.length} resultado(s)
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            ←
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            →
          </Button>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Distribuição por Especialidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(new Set(equipes.map(e => e.especialidade))).map((especialidade) => (
                <div key={especialidade} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span style={{ color: 'var(--foreground)' }}>{especialidade}</span>
                  <Badge variant="secondary">
                    {equipes.filter(e => e.especialidade === especialidade).length}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Maiores Equipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {equipes
                .sort((a, b) => b.membros - a.membros)
                .slice(0, 5)
                .map((equipe, index) => (
                  <div key={equipe.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                          {equipe.nome}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {equipe.filial}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {equipe.membros} membros
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
