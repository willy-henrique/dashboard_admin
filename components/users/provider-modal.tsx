"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Calendar, ShoppingBag, DollarSign, Star, Shield, Briefcase } from "lucide-react"

interface Provider {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  address: string
  serviceCategories: string[]
  experience: string
  isVerified: boolean
  rating: number
  totalOrders: number
  totalEarnings: number
  status: "active" | "inactive" | "pending" | "blocked"
  createdAt: string
}

interface ProviderModalProps {
  provider: Provider | null
  isOpen: boolean
  onClose: () => void
}

export function ProviderModal({ provider, isOpen, onClose }: ProviderModalProps) {
  if (!provider) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              Perfil do Prestador
              {provider.isVerified && <Shield className="h-4 w-4 text-blue-600" />}
            </div>
            {getStatusBadge(provider.status)}
          </DialogTitle>
          <DialogDescription>Informações detalhadas do prestador de serviços</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                  <p className="text-sm">{provider.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CPF</label>
                  <p className="text-sm">{provider.cpf}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{provider.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{provider.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{provider.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Experiência</label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{provider.experience}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Avaliação</label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{provider.rating} de 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Categorias de Serviço</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {provider.serviceCategories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Status de Verificação</label>
                <div className="flex items-center gap-2 mt-1">
                  {provider.isVerified ? (
                    <>
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Verificado</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Não verificado</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance na Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Cadastrado em</p>
                      <p className="text-sm text-gray-600">
                        {new Date(provider.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Pedidos Concluídos</p>
                      <p className="text-sm text-gray-600">{provider.totalOrders} pedidos</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Total de Ganhos</p>
                      <p className="text-sm text-gray-600">R$ {provider.totalEarnings.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Avaliação Média</p>
                      <p className="text-sm text-gray-600">{provider.rating} estrelas</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
