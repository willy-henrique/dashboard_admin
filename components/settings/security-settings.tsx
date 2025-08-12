"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Key, Clock, Database, AlertTriangle, Download } from "lucide-react"

const auditLogs = [
  {
    id: "1",
    action: "Login",
    user: "admin@appservico.com",
    timestamp: "2024-03-11 14:30:25",
    ip: "192.168.1.100",
    status: "success",
  },
  {
    id: "2",
    action: "User Block",
    user: "admin@appservico.com",
    timestamp: "2024-03-11 13:45:12",
    ip: "192.168.1.100",
    status: "success",
  },
  {
    id: "3",
    action: "Failed Login",
    user: "unknown@email.com",
    timestamp: "2024-03-11 12:15:33",
    ip: "203.0.113.45",
    status: "failed",
  },
  {
    id: "4",
    action: "Settings Update",
    user: "admin@appservico.com",
    timestamp: "2024-03-11 11:20:18",
    ip: "192.168.1.100",
    status: "success",
  },
  {
    id: "5",
    action: "Report Export",
    user: "admin@appservico.com",
    timestamp: "2024-03-11 10:05:42",
    ip: "192.168.1.100",
    status: "success",
  },
]

export function SecuritySettings() {
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: 90,
  })

  const [sessionConfig, setSessionConfig] = useState({
    sessionTimeout: 30,
    maxConcurrentSessions: 3,
    requireReauth: true,
    rememberMeDuration: 30,
  })

  const [securityFeatures, setSecurityFeatures] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    autoLockout: true,
    ipWhitelist: false,
  })

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: 30,
    lastBackup: "2024-03-11 02:00:00",
  })

  const handleSavePasswordPolicy = () => {
    alert("Política de senhas salva com sucesso!")
  }

  const handleSaveSessionConfig = () => {
    alert("Configurações de sessão salvas com sucesso!")
  }

  const handleSaveSecurityFeatures = () => {
    alert("Configurações de segurança salvas com sucesso!")
  }

  const handleSaveBackupSettings = () => {
    alert("Configurações de backup salvas com sucesso!")
  }

  const handleRunBackup = () => {
    alert("Backup iniciado com sucesso!")
  }

  const getStatusBadge = (status: string) => {
    return status === "success" ? (
      <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Falha</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Política de Senhas
          </CardTitle>
          <CardDescription>Configure os requisitos de segurança para senhas de usuários</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-length">Comprimento Mínimo</Label>
              <Input
                id="min-length"
                type="number"
                value={passwordPolicy.minLength}
                onChange={(e) =>
                  setPasswordPolicy({ ...passwordPolicy, minLength: Number.parseInt(e.target.value) || 8 })
                }
              />
            </div>
            <div>
              <Label htmlFor="password-expiry">Expiração (dias)</Label>
              <Input
                id="password-expiry"
                type="number"
                value={passwordPolicy.passwordExpiry}
                onChange={(e) =>
                  setPasswordPolicy({ ...passwordPolicy, passwordExpiry: Number.parseInt(e.target.value) || 90 })
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-uppercase">Exigir letras maiúsculas</Label>
              <Switch
                id="require-uppercase"
                checked={passwordPolicy.requireUppercase}
                onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireUppercase: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="require-lowercase">Exigir letras minúsculas</Label>
              <Switch
                id="require-lowercase"
                checked={passwordPolicy.requireLowercase}
                onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireLowercase: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="require-numbers">Exigir números</Label>
              <Switch
                id="require-numbers"
                checked={passwordPolicy.requireNumbers}
                onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireNumbers: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="require-special">Exigir caracteres especiais</Label>
              <Switch
                id="require-special"
                checked={passwordPolicy.requireSpecialChars}
                onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireSpecialChars: checked })}
              />
            </div>
          </div>

          <Button onClick={handleSavePasswordPolicy}>Salvar Política</Button>
        </CardContent>
      </Card>

      {/* Session Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurações de Sessão
          </CardTitle>
          <CardDescription>Configure o comportamento das sessões de usuário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="session-timeout">Timeout da Sessão (minutos)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={sessionConfig.sessionTimeout}
                onChange={(e) =>
                  setSessionConfig({ ...sessionConfig, sessionTimeout: Number.parseInt(e.target.value) || 30 })
                }
              />
            </div>
            <div>
              <Label htmlFor="max-sessions">Máximo de Sessões Simultâneas</Label>
              <Input
                id="max-sessions"
                type="number"
                value={sessionConfig.maxConcurrentSessions}
                onChange={(e) =>
                  setSessionConfig({ ...sessionConfig, maxConcurrentSessions: Number.parseInt(e.target.value) || 3 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="remember-duration">Duração "Lembrar de mim" (dias)</Label>
              <Input
                id="remember-duration"
                type="number"
                value={sessionConfig.rememberMeDuration}
                onChange={(e) =>
                  setSessionConfig({ ...sessionConfig, rememberMeDuration: Number.parseInt(e.target.value) || 30 })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-reauth">Exigir reautenticação para ações sensíveis</Label>
              <p className="text-sm text-gray-600">Solicitar senha novamente para operações críticas</p>
            </div>
            <Switch
              id="require-reauth"
              checked={sessionConfig.requireReauth}
              onCheckedChange={(checked) => setSessionConfig({ ...sessionConfig, requireReauth: checked })}
            />
          </div>

          <Button onClick={handleSaveSessionConfig}>Salvar Configurações</Button>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recursos de Segurança
          </CardTitle>
          <CardDescription>Configure recursos avançados de segurança</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Autenticação de Dois Fatores</Label>
                <p className="text-sm text-gray-600">Exigir código adicional no login</p>
              </div>
              <Switch
                id="two-factor"
                checked={securityFeatures.twoFactorAuth}
                onCheckedChange={(checked) => setSecurityFeatures({ ...securityFeatures, twoFactorAuth: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="login-notifications">Notificações de Login</Label>
                <p className="text-sm text-gray-600">Alertar sobre novos logins</p>
              </div>
              <Switch
                id="login-notifications"
                checked={securityFeatures.loginNotifications}
                onCheckedChange={(checked) => setSecurityFeatures({ ...securityFeatures, loginNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="suspicious-alerts">Alertas de Atividade Suspeita</Label>
                <p className="text-sm text-gray-600">Detectar comportamentos anômalos</p>
              </div>
              <Switch
                id="suspicious-alerts"
                checked={securityFeatures.suspiciousActivityAlerts}
                onCheckedChange={(checked) =>
                  setSecurityFeatures({ ...securityFeatures, suspiciousActivityAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-lockout">Bloqueio Automático</Label>
                <p className="text-sm text-gray-600">Bloquear após tentativas de login falhadas</p>
              </div>
              <Switch
                id="auto-lockout"
                checked={securityFeatures.autoLockout}
                onCheckedChange={(checked) => setSecurityFeatures({ ...securityFeatures, autoLockout: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ip-whitelist">Lista Branca de IPs</Label>
                <p className="text-sm text-gray-600">Restringir acesso a IPs específicos</p>
              </div>
              <Switch
                id="ip-whitelist"
                checked={securityFeatures.ipWhitelist}
                onCheckedChange={(checked) => setSecurityFeatures({ ...securityFeatures, ipWhitelist: checked })}
              />
            </div>
          </div>

          <Button onClick={handleSaveSecurityFeatures}>Salvar Configurações</Button>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configurações de Backup
          </CardTitle>
          <CardDescription>Configure backups automáticos do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-backup">Backup Automático</Label>
              <p className="text-sm text-gray-600">Executar backups automaticamente</p>
            </div>
            <Switch
              id="auto-backup"
              checked={backupSettings.autoBackup}
              onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, autoBackup: checked })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backup-frequency">Frequência</Label>
              <select
                id="backup-frequency"
                className="w-full p-2 border rounded-md"
                value={backupSettings.backupFrequency}
                onChange={(e) => setBackupSettings({ ...backupSettings, backupFrequency: e.target.value })}
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            <div>
              <Label htmlFor="retention-days">Retenção (dias)</Label>
              <Input
                id="retention-days"
                type="number"
                value={backupSettings.retentionDays}
                onChange={(e) =>
                  setBackupSettings({ ...backupSettings, retentionDays: Number.parseInt(e.target.value) || 30 })
                }
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Último backup:</strong> {backupSettings.lastBackup}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveBackupSettings}>Salvar Configurações</Button>
            <Button variant="outline" onClick={handleRunBackup} className="bg-transparent">
              Executar Backup Agora
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Logs de Auditoria
          </CardTitle>
          <CardDescription>Histórico de ações administrativas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">Últimas 5 atividades</p>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Exportar Logs
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
