import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  RefreshCw,
  Upload,
  X,
  Eye
} from "lucide-react"

const checklists = [
  {
    id: "1",
    cliente: "TODOS",
    tipo: "CONSERTO MECANICO",
    descricao: "CONSERTO MECANICO MODELO",
    status: "ativo",
    criadoEm: "2025-01-15",
  },
  {
    id: "2",
    cliente: "TODOS",
    tipo: "REPARO RESIDENCIAL",
    descricao: "REPARO RESIDENCIAL MODELO",
    status: "ativo",
    criadoEm: "2025-01-14",
  },
  {
    id: "3",
    cliente: "ALLIANZ SEGUROS",
    tipo: "ASSISTENCIA VEICULAR",
    descricao: "CHECKLIST ASSISTENCIA VEICULAR",
    status: "ativo",
    criadoEm: "2025-01-13",
  },
  {
    id: "4",
    cliente: "PORTO SEGURO",
    tipo: "RESGATE",
    descricao: "CHECKLIST RESGATE VEICULAR",
    status: "inativo",
    criadoEm: "2025-01-12",
  },
  {
    id: "5",
    cliente: "MAPFRE",
    tipo: "MANUTENCAO",
    descricao: "CHECKLIST MANUTENCAO PREVENTIVA",
    status: "ativo",
    criadoEm: "2025-01-11",
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

export default function ChecklistsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Checklists
          </h1>
          <p className="text-muted-foreground">
            autem.com.br › configurações › checklist
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            CADASTRAR
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Total de Checklists
            </CardTitle>
            <ClipboardList className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{checklists.length}</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +3 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Ativos
            </CardTitle>
            <ClipboardList className="h-4 w-4" style={{ color: 'var(--success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
              {checklists.filter(c => c.status === 'ativo').length}
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Em uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Tipos Diferentes
            </CardTitle>
            <ClipboardList className="h-4 w-4" style={{ color: 'var(--warning)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
              {new Set(checklists.map(c => c.tipo)).size}
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Categorias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Clientes Únicos
            </CardTitle>
            <ClipboardList className="h-4 w-4" style={{ color: 'var(--info)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--info)' }}>
              {new Set(checklists.map(c => c.cliente)).size}
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Diferentes clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <X className="h-4 w-4" />
          </Button>
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
              placeholder="PROCURAR" 
              className="pl-14 w-64" 
              aria-label="Buscar checklists"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            MODELOS
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            CADASTRAR
          </Button>
        </div>
      </div>

      {/* Tabela de Checklists */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: 'var(--foreground)' }}>Checklists Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: 'var(--foreground)' }}>
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Cliente / Fornecedor</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Tipo</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Descrição</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Status</TableHead>
                <TableHead style={{ color: 'var(--foreground)' }}>Criado em</TableHead>
                <TableHead className="text-right" style={{ color: 'var(--foreground)' }}>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklists.map((checklist) => (
                <TableRow key={checklist.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell className="font-medium" style={{ color: 'var(--foreground)' }}>
                    {checklist.cliente}
                  </TableCell>
                  <TableCell style={{ color: 'var(--foreground)' }}>
                    {checklist.tipo}
                  </TableCell>
                  <TableCell style={{ color: 'var(--foreground)' }}>
                    {checklist.descricao}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(checklist.status)}>
                      {checklist.status}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ color: 'var(--foreground)' }}>
                    {checklist.criadoEm}
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
          Mostrando de 1 até {checklists.length} de {checklists.length} resultado(s)
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
            <CardTitle style={{ color: 'var(--foreground)' }}>Tipos de Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(new Set(checklists.map(c => c.tipo))).map((tipo) => (
                <div key={tipo} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span style={{ color: 'var(--foreground)' }}>{tipo}</span>
                  <Badge variant="secondary">
                    {checklists.filter(c => c.tipo === tipo).length}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Clientes Principais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(new Set(checklists.map(c => c.cliente))).map((cliente) => (
                <div key={cliente} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span style={{ color: 'var(--foreground)' }}>{cliente}</span>
                  <Badge variant="secondary">
                    {checklists.filter(c => c.cliente === cliente).length}
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
