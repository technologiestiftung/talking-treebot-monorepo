"use client"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingSpinner"
import { InteractionsChart } from "./InteractionsChart"

interface AnalyticsData {
  interactionsOverTime: Array<{ date: string; count: number }>
  topTopics: Array<{ topic: string; count: number }>
  totalConversations: number
  conversationsByLanguage: Array<{ language: string; count: number }>
}

const LANGUAGE_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
]

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    fetch("/api/analytics?days=30", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch analytics: ${res.status} ${res.statusText}`)
        }
        return res.json()
      })
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          setError("Request timed out. Please try again.")
        } else {
          setError(err.message || "Failed to load analytics")
        }
        setLoading(false)
      })
      .finally(() => {
        clearTimeout(timeoutId)
      })

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-destructive/10 backdrop-blur-sm border border-destructive/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-destructive">Failed to load analytics</h3>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-destructive hover:text-destructive/80 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const generateLast30Days = () => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // Find matching data from API
      const apiData = data?.interactionsOverTime.find((item) => {
        const itemDate = new Date(item.date).toISOString().split("T")[0]
        return itemDate === dateStr
      })

      days.push({
        date: dateStr,
        count: apiData ? apiData.count : 0,
      })
    }

    return days
  }

  const last30Days = generateLast30Days()
  const maxCount = Math.max(...last30Days.map((d) => d.count), 1)
  const totalLanguageCount = data?.conversationsByLanguage.reduce((sum, lang) => sum + lang.count, 0) || 0

  const createDotMatrix = () => {
    const dots: Array<{ color: string; language: string }> = []
    data.conversationsByLanguage.forEach((lang, langIndex) => {
      const color = LANGUAGE_COLORS[langIndex % LANGUAGE_COLORS.length]
      // Each dot represents 1 conversation
      for (let i = 0; i < lang.count; i++) {
        dots.push({ color, language: lang.language })
      }
    })
    return dots
  }

  const dotMatrix = createDotMatrix()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card/70 backdrop-blur-md rounded-xl border border-accent/20 p-3 shadow-lg">
          <div className="text-sm text-muted-foreground mb-1">Total Conversations</div>
          <div className="text-3xl font-bold text-accent-foreground">{data.totalConversations}</div>
        </div>
        <div className="bg-card/70 backdrop-blur-md rounded-xl border border-accent/20 p-3 shadow-lg">
          <div className="text-sm text-muted-foreground mb-1">Languages</div>
          <div className="text-3xl font-bold text-accent-foreground">{data.conversationsByLanguage.length}</div>
        </div>
      </div>

      {/* Top Topics */}
      <div className="bg-card/70 backdrop-blur-md rounded-xl border border-accent/20 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Topics</h3>
        <div className="space-y-3">
          {data.topTopics.slice(0, 5).map((topic, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-card-foreground">{topic.topic}</span>
                  <span className="text-sm text-muted-foreground">{topic.count} conversations</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 from-accent to-accent/80 rounded-full transition-all duration-500"
                    style={{
                      width: `${(topic.count / data.topTopics[0].count) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card/70 backdrop-blur-md rounded-xl border border-accent/20 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-6">Language Distribution</h3>

        {/* Dot Matrix */}
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {dotMatrix.map((dot, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full shadow-sm transition-transform hover:scale-150"
                style={{ backgroundColor: dot.color }}
                title={dot.language}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {data.conversationsByLanguage.map((lang, index) => {
            const percentage = ((lang.count / totalLanguageCount) * 100).toFixed(1)
            const color = LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-md" style={{ backgroundColor: color }} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground uppercase">{lang.language}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{lang.count} conversations</span>
                    <span className="text-xs font-semibold text-accent-foreground min-w-[3rem] text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Interactions Over Time (Last 30 Days) */}
        <InteractionsChart data={last30Days} />
    </div>
  )
}
