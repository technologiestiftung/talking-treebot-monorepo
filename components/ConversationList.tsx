"use client"

import { useState, useEffect } from "react"
import { ConversationCard } from "./ConversationCard"
import { LoadingSpinner } from "./LoadingSpinner"

interface Conversation {
  id: number
  datetime: string
  language: string
  topic: string | null
  questions: any
  answers: any
}

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConversations() {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      try {
        const response = await fetch("/api/sensor-data?limit=20", {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)
        const result = await response.json()
        setConversations(result.data)
      } catch (err: any) {
        setError(err.name === "AbortError" ? "Request timed out" : err.message)
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }
    fetchConversations()
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
        <h3 className="text-sm font-medium text-destructive">Error</h3>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-muted border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No conversations found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </div>
  )
}
