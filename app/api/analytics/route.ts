import { NextResponse } from "next/server"
import { prisma } from "../../../lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Get date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get interactions over time (grouped by day)
    const interactionsOverTime = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT 
        DATE(datetime) as date,
        COUNT(*) as count
      FROM conversations
      WHERE datetime >= ${startDate}
      GROUP BY DATE(datetime)
      ORDER BY date ASC
    `

    // Get top topics
    const topTopics = await prisma.$queryRaw<Array<{ topic: string; count: bigint }>>`
      SELECT 
        topic,
        COUNT(*) as count
      FROM conversations
      WHERE topic IS NOT NULL AND topic != ''
      GROUP BY topic
      ORDER BY count DESC
      LIMIT 10
    `

    // Get total conversations
    const totalConversations = await prisma.conversations.count()

    // Get conversations by language
    const conversationsByLanguage = await prisma.$queryRaw<Array<{ language: string; count: bigint }>>`
      SELECT 
        language,
        COUNT(*) as count
      FROM conversations
      GROUP BY language
      ORDER BY count DESC
    `

    return NextResponse.json({
      interactionsOverTime: interactionsOverTime.map((item) => ({
        date: item.date,
        count: Number(item.count),
      })),
      topTopics: topTopics.map((item) => ({
        topic: item.topic,
        count: Number(item.count),
      })),
      totalConversations,
      conversationsByLanguage: conversationsByLanguage.map((item) => ({
        language: item.language,
        count: Number(item.count),
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
