"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building, Mail, Percent, MapPin, Plus, X } from "lucide-react"

export function GeneralSettings() {
  const [companyInfo, setCompanyInfo] = useState({
    name: "AppServiço",
    description: "Plataforma de prestação de serviços",
    email: "contato@appservico.com",
    phone: "(11) 99999-0000",
    address: "São Paulo, SP, Brasil",
    website: "https://appservico.com",
  })

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@appservico.com",
    smtpPassword: "••••••••",
    fromName: "AppServiço",
    fromEmail: "noreply@appservico.com",
  })

  const [commissionRates, setCommissionRates] = useState({
    default: 10,
    limpeza: 8,
    manutencao: 12,
    jardinagem: 10,
    pintura: 15,
  })

  const [serviceCategories, setServiceCategories] = useState([
    "Limpeza",
    "Manutenção",
    "Jardinagem",
    "Pintura",
    "Elétrica",
    "Encanamento",
  ])

  const [serviceRegions, setServiceRegions] = useState([
    "São Paulo, SP",
    "Rio de Janeiro, RJ",
    "Belo Horizonte, MG",
    "Salvador, BA",
    "Brasília, DF",
  ])

  const [newCategory, setNewCategory] = useState("")
  const [newRegion, setNewRegion] = useState("")
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  })

  const handleSaveCompanyInfo = () => {
    // Save company information
    alert("Informações da empresa salvas com sucesso!")
  }

  const handleSaveEmailConfig = () => {
    // Save email configuration
    alert("Configurações de email salvas com sucesso!")
  }

  const handleSaveCommissions = () => {
    // Save commission rates
    alert("Taxas de comissão salvas com sucesso!")
  }

  const addCategory = () => {
    if (newCategory.trim() && !serviceCategories.includes(newCategory.trim())) {
      setServiceCategories([...serviceCategories, newCategory.trim()])
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    setServiceCategories(serviceCategories.filter((c) => c !== category))
  }

  const addRegion = () => {
    if (newRegion.trim() && !serviceRegions.includes(newRegion.trim())) {
      setServiceRegions([...serviceRegions, newRegion.trim()])
      setNewRegion("")
    }
  }

  const removeRegion = (region: string) => {
    setServiceRegions(serviceRegions.filter((r) => r !== region))
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
          <CardDescription>Configure as informações básicas da sua empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="company-email">Email Principal</Label>
              <Input
                id="company-email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company-description">Descrição</Label>
            <Textarea
              id="company-description"
              value={companyInfo.description}
              onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-phone">Telefone</Label>
              <Input
                id="company-phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={companyInfo.website}
                onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company-address">Endereço</Label>
            <Input
              id="company-address"
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
            />
          </div>

          <Button onClick={handleSaveCompanyInfo}>Salvar Informações</Button>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configurações de Email
          </CardTitle>
          <CardDescription>Configure o servidor SMTP para envio de emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-host">Servidor SMTP</Label>
              <Input
                id="smtp-host"
                value={emailConfig.smtpHost}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">Porta</Label>
              <Input
                id="smtp-port"
                value={emailConfig.smtpPort}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-user">Usuário SMTP</Label>
              <Input
                id="smtp-user"
                value={emailConfig.smtpUser}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="smtp-password">Senha SMTP</Label>
              <Input
                id="smtp-password"
                type="password"
                value={emailConfig.smtpPassword}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-name">Nome do Remetente</Label>
              <Input
                id="from-name"
                value={emailConfig.fromName}
                onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="from-email">Email do Remetente</Label>
              <Input
                id="from-email"
                type="email"
                value={emailConfig.fromEmail}
                onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSaveEmailConfig}>Salvar Configurações</Button>
        </CardContent>
      </Card>

      {/* Commission Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Taxas de Comissão
          </CardTitle>
          <CardDescription>Configure as taxas de comissão por categoria de serviço</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="default-commission">Taxa Padrão (%)</Label>
              <Input
                id="default-commission"
                type="number"
                value={commissionRates.default}
                onChange={(e) =>
                  setCommissionRates({ ...commissionRates, default: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label htmlFor="limpeza-commission">Limpeza (%)</Label>
              <Input
                id="limpeza-commission"
                type="number"
                value={commissionRates.limpeza}
                onChange={(e) =>
                  setCommissionRates({ ...commissionRates, limpeza: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label htmlFor="manutencao-commission">Manutenção (%)</Label>
              <Input
                id="manutencao-commission"
                type="number"
                value={commissionRates.manutencao}
                onChange={(e) =>
                  setCommissionRates({ ...commissionRates, manutencao: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label htmlFor="jardinagem-commission">Jardinagem (%)</Label>
              <Input
                id="jardinagem-commission"
                type="number"
                value={commissionRates.jardinagem}
                onChange={(e) =>
                  setCommissionRates({ ...commissionRates, jardinagem: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label htmlFor="pintura-commission">Pintura (%)</Label>
              <Input
                id="pintura-commission"
                type="number"
                value={commissionRates.pintura}
                onChange={(e) =>
                  setCommissionRates({ ...commissionRates, pintura: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveCommissions}>Salvar Taxas</Button>
        </CardContent>
      </Card>

      {/* Service Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias de Serviço</CardTitle>
          <CardDescription>Gerencie as categorias de serviços disponíveis na plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map((category) => (
              <Badge key={category} variant="outline" className="flex items-center gap-2">
                {category}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeCategory(category)} />
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Nova categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCategory()}
            />
            <Button onClick={addCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Regions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Regiões de Atendimento
          </CardTitle>
          <CardDescription>Configure as regiões onde os serviços estão disponíveis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {serviceRegions.map((region) => (
              <Badge key={region} variant="outline" className="flex items-center gap-2">
                {region}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeRegion(region)} />
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Nova região"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addRegion()}
            />
            <Button onClick={addRegion}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificação</CardTitle>
          <CardDescription>Configure como você deseja receber notificações do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Notificações por Email</Label>
              <p className="text-sm text-gray-600">Receba alertas importantes por email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications">Notificações por SMS</Label>
              <p className="text-sm text-gray-600">Receba alertas urgentes por SMS</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={notifications.smsNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className="text-sm text-gray-600">Receba notificações no navegador</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
