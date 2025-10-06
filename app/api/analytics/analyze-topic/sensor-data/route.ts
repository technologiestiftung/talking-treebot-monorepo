import { NextResponse } from "next/server"
import { prisma } from "../../../../../lib/db"
import { extractTopic, categorizeTopic } from "../../../../../lib/topic-analyzer"

// GET all sensor data with optional pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const data = await prisma.conversations.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        datetime: "desc",
      },
    })

    const total = await prisma.conversations.count()

    return NextResponse.json({
      data,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching sensor data:", error)
    return NextResponse.json({ error: "Failed to fetch sensor data" }, { status: 500 })
  }
}

// POST new sensor data
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { answers, questions, datetime, language } = body

    if (!answers || !questions) {
      return NextResponse.json({ error: "answers and questions are required" }, { status: 400 })
    }

    const topic = extractTopic({
      questions: Array.isArray(questions) ? questions : [questions],
      answers: Array.isArray(answers) ? answers : [answers],
      language: language || "en",
    })
    const categorizedTopic = categorizeTopic(topic)

    const data = await prisma.conversations.create({
      data: {
        answers,
        questions,
        language: language || "en",
        datetime: datetime ? new Date(datetime) : new Date(),
        topic: categorizedTopic,
      },
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating sensor data:", error)
    return NextResponse.json({ error: "Failed to create sensor data" }, { status: 500 })
  }
}
