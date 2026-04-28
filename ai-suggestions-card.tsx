"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp } from "lucide-react"
import { aiSuggestions } from "@/lib/data"
import { Progress } from "@/components/ui/progress"

export function AISuggestionsCard() {
  return (
    <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiSuggestions.map((item) => (
          <div
            key={item.id}
            className="space-y-2 rounded-lg border bg-card p-3 transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 text-primary" />
              <p className="text-sm leading-tight">{item.suggestion}</p>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={item.confidence} className="h-1.5 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">
                {item.confidence}% confidence
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
