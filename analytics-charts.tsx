"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { analyticsData } from "@/lib/data"

const COLORS = ["hsl(220, 70%, 50%)", "hsl(200, 70%, 50%)", "hsl(260, 70%, 50%)", "hsl(170, 70%, 50%)"]

export function NeedsByAreaChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Needs by Area</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.needsByArea} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="area" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="hsl(220, 70%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function NeedsBySeverityChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Needs by Severity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.needsBySeverity}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
                nameKey="severity"
                label={({ severity, percent }) => `${severity} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {analyticsData.needsBySeverity.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function MonthlyTrendsChart() {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.monthlyTrends} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="needs"
                stroke="hsl(220, 70%, 50%)"
                strokeWidth={2}
                dot={{ fill: "hsl(220, 70%, 50%)" }}
                name="Total Needs"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="hsl(145, 70%, 45%)"
                strokeWidth={2}
                dot={{ fill: "hsl(145, 70%, 45%)" }}
                name="Resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function VolunteerActivityChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Volunteer Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.volunteerActivity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="hours" fill="hsl(200, 70%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
