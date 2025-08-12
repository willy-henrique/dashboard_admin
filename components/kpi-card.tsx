"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Wrench, Check, Clock, Timer, User, Calendar, Map, Trophy, X, XCircle, UserX, DollarSign } from "lucide-react"

const iconMap = {
  wrench: Wrench,
  check: Check,
  clock: Clock,
  timer: Timer,
  user: User,
  calendar: Calendar,
  map: Map,
  trophy: Trophy,
  x: X,
  "x-circle": XCircle,
  "user-x": UserX,
  "dollar-sign": DollarSign,
}

const colorMap = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
}

interface KPICardProps {
  title: string
  subtitle: string
  value: string
  icon: keyof typeof iconMap
  color: keyof typeof colorMap
  className?: string
}

export function KPICard({ title, subtitle, value, icon, color, className }: KPICardProps) {
  const Icon = iconMap[icon]

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className={cn("p-6 text-white", colorMap[color])}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-3xl font-bold">{value}</div>
            <div className="space-y-1">
              <div className="text-sm font-medium">{title}</div>
              {subtitle && <div className="text-xs opacity-90">{subtitle}</div>}
            </div>
          </div>
          <Icon className="h-8 w-8 opacity-80" />
        </div>
        {/* Background decoration */}
        <div className="absolute -right-4 -bottom-4 opacity-20">
          <Icon className="h-24 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
