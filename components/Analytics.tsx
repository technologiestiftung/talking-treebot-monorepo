"use client"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingSpinner"

interface AnalyticsData {
  interactionsOverTime: Array<{ date: string; count: number }>
  topTopics: Array<{ topic: string; count: number }>
  totalConversations: number
  conversationsByLanguage: Array<{ language: string; count: number }>
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-1 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentcolor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Failed to load analytics</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-grey p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total Conversations</div>
          <div className="text-3xl font-bold text-emerald-600">{data.totalConversations}</div>
        </div>
        <div className="bg-white rounded-lg border border-grey p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Spoken Languages</div>
          <div className="text-3xl font-bold text-emerald-600">{data.conversationsByLanguage.length}</div>
        </div>
      </div>

      {/* Top Topics */}
      <div className="bg-white rounded-lg border border-grey p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Topics</h3>
        <div className="space-y-3">
          {data.topTopics.slice(0, 5).map((topic, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{topic.topic}</span>
                  <span className="text-sm text-gray-500">{topic.count} conversations</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
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

      {/* Languages */}
      <div className="bg-white rounded-lg border border-grey p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.conversationsByLanguage.map((lang, index) => (
            <div key={index} className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{lang.count}</div>
              <div className="text-sm text-gray-600 uppercase">{lang.language}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactions Over Time */}
      <div className="bg-white rounded-lg border border-grey p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactions Over Time (Last 30 Days)</h3>
        <div className="space-y-2">
          {data.interactionsOverTime.slice(-10).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-xs text-gray-500 w-24">
                {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${(item.count / Math.max(...data.interactionsOverTime.map((d) => d.count))) * 100}%`,
                    }}
                  >
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
