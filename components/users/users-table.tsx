"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck,
  UserX,
  Clock,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Phone,
  MapPin
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UsersTableProps {
  users: any[]
  loading: boolean
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleStatus?: (id: string, isActive: boolean) => void
  onBlock?: (id: string) => void
  onUnblock?: (id: string) => void
  onVerify?: (id: string) => void
  showVerification?: boolean
}

export function UsersTable({ 
  users, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onBlock, 
  onUnblock,
  onVerify,
  showVerification = false
}: UsersTableProps) {

  const getStatusBadge = (user: any) => {
    if (user.isActive === false) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 px-2 py-1">
          <UserX className="h-3 w-3" />
          Inativo
        </Badge>
      )
    }
    
    return (
      <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1">
        <UserCheck className="h-3 w-3" />
        Ativo
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: "bg-red-100 text-red-800 hover:bg-red-200",
      manager: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      prestador: "bg-green-100 text-green-800 hover:bg-green-200",
      cliente: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      user: "bg-purple-100 text-purple-800 hover:bg-purple-200"
    }
    
    return (
      <Badge className={`px-2 py-1 ${roleColors[role] || "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}>
        {role === 'prestador' ? 'Prestador' : role === 'cliente' ? 'Cliente' : role || 'user'}
      </Badge>
    )
  }

  const getVerificationBadge = (user: any) => {
    if (user.verificado) {
      return (
        <Badge className="flex items-center gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200 px-2 py-1">
          <CheckCircle className="h-3 w-3" />
          Verificado
        </Badge>
      )
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
        <AlertCircle className="h-3 w-3" />
        Pendente
      </Badge>
    )
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    return formatDistanceToNow(timestamp.toDate(), { 
      addSuffix: true, 
      locale: ptBR 
    })
  }

  if (loading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UsersIcon className="h-5 w-5" />
          Usuários ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <UserX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou criar um novo usuário.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableHead className="font-semibold text-gray-900 dark:text-white">Usuário</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">Contato</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">Tipo</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                    {showVerification && (
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Verificação</TableHead>
                    )}
                    <TableHead className="font-semibold text-gray-900 dark:text-white">Último Login</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">Criado</TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-sm">
                              {(user.name || user.nome || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {user.name || user.nome || 'Nome não informado'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {user.email || 'Email não informado'}
                            </span>
                          </div>
                          {user.telefone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {user.telefone}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role || 'user')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user)}
                      </TableCell>
                      {showVerification && (
                        <TableCell>
                          {getVerificationBadge(user)}
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="text-sm">
                          {user.lastLoginAt ? (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              {formatDate(user.lastLoginAt)}
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Nunca</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {onView && (
                              <DropdownMenuItem onClick={() => onView(user.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(user.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            )}
                            {showVerification && onVerify && !user.verificado && (
                              <DropdownMenuItem onClick={() => onVerify(user.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Verificar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {user.isActive ? (
                              onBlock && (
                                <DropdownMenuItem 
                                  onClick={() => onBlock(user.id)}
                                  className="text-red-600"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Bloquear
                                </DropdownMenuItem>
                              )
                            ) : (
                              onUnblock && (
                                <DropdownMenuItem 
                                  onClick={() => onUnblock(user.id)}
                                  className="text-green-600"
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Desbloquear
                                </DropdownMenuItem>
                              )
                            )}
                            {onDelete && (
                              <DropdownMenuItem 
                                onClick={() => onDelete(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="p-4 bg-white dark:bg-slate-800 border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {(user.name || user.nome || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-900 dark:text-white">
                          {user.name || user.nome || 'Nome não informado'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email || 'Email não informado'}
                        </div>
                        {user.telefone && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {user.telefone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(user)}
                      {getRoleBadge(user.role || 'user')}
                      {showVerification && getVerificationBadge(user)}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Último Login:</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user.lastLoginAt ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(user.lastLoginAt)}
                            </div>
                          ) : (
                            <span className="text-gray-500">Nunca</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Criado:</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {onView && (
                      <Button variant="ghost" size="sm" className="flex-1" onClick={() => onView(user.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    )}
                    {onEdit && (
                      <Button variant="ghost" size="sm" className="flex-1" onClick={() => onEdit(user.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    {showVerification && onVerify && !user.verificado && (
                      <Button variant="ghost" size="sm" className="flex-1 text-purple-600" onClick={() => onVerify(user.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verificar
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="sm" className="flex-1 text-red-600" onClick={() => onDelete(user.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}