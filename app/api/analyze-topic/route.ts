import { NextResponse } from "next/server"
import { prisma } from "../../../lib/db"
import { extractTopic, categorizeTopic } from "../../../lib/topic-analyzer"

// POST endpoint to analyze topic for a specific conversation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    // Fetch the conversation
    const conversation = await prisma.conversations.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Extract topic from questions and answers
    const topic = extractTopic({
      questions: conversation.questions as string[],
      answers: conversation.answers as string[],
      language: conversation.language,
    })

    const categorizedTopic = categorizeTopic(topic)

    // Update the conversation with the extracted topic
    const updated = await prisma.conversations.update({
      where: { id: Number.parseInt(id) },
      data: { topic: categorizedTopic },
    })

    return NextResponse.json({
      success: true,
      topic: categorizedTopic,
      conversation: updated,
    })
  } catch (error) {
    console.error("[v0] Error analyzing topic:", error)
    return NextResponse.json({ error: "Failed to analyze topic" }, { status: 500 })
  }
}

// GET endpoint to analyze all conversations without topics
export async function GET() {
  try {
    // Find all conversations without a topic
    const conversations = await prisma.conversations.findMany({
      where: {
        OR: [{ topic: null }, { topic: "" }],
      },
    })

    const results = []

    // Analyze each conversation
    for (const conversation of conversations) {
      const topic = extractTopic({
        questions: conversation.questions as string[],
        answers: conversation.answers as string[],
        language: conversation.language,
      })

      const categorizedTopic = categorizeTopic(topic)

      await prisma.conversations.update({
        where: { id: conversation.id },
        data: { topic: categorizedTopic },
      })

      results.push({ id: conversation.id, topic: categorizedTopic })
    }

    return NextResponse.json({
      success: true,
      analyzed: results.length,
      results,
    })
  } catch (error) {
    console.error("[v0] Error analyzing topics:", error)
    return NextResponse.json({ error: "Failed to analyze topics" }, { status: 500 })
  }
}
