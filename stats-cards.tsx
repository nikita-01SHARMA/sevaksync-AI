"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, AlertTriangle, Users, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  className?: string
}

function StatCard({ title, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
            {trend && (
              <p className={cn(
                "mt-1 text-xs font-medium",
                trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {trendUp ? "↑" : "↓"} {trend}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-primary/10 p-3">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Needs"
        value={10}
        icon={<Heart className="h-6 w-6 text-primary" />}
        trend="12% from last month"
        trendUp={true}
      />
      <StatCard
        title="Urgent Cases"
        value={3}
        icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
        trend="2 new today"
        trendUp={false}
      />
      <StatCard
        title="Volunteers Active"
        value={7}
        icon={<Users className="h-6 w-6 text-primary" />}
        trend="3 joined this week"
        trendUp={true}
      />
      <StatCard
        title="Tasks Completed"
        value={165}
        icon={<CheckCircle className="h-6 w-6 text-green-600" />}
        trend="18% increase"
        trendUp={true}
      />
    </div>
  )
}
