"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { alerts } from "@/lib/data"
import { cn } from "@/lib/utils"

const alertIcons = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
}

const alertColors = {
  critical: "text-red-500 bg-red-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  info: "text-blue-500 bg-blue-500/10",
}

export function AlertsCard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Active Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alertIcons[alert.type as keyof typeof alertIcons]
          const colorClass = alertColors[alert.type as keyof typeof alertColors]
          
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className={cn("rounded-full p-1.5", colorClass)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-tight">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
