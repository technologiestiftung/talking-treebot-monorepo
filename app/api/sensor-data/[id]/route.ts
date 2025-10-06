import { NextResponse } from "next/server"
import { prisma } from "lib/db"

// GET single sensor data by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await prisma.conversations.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!data) {
      return NextResponse.json({ error: "Sensor data not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching sensor data:", error)
    return NextResponse.json({ error: "Failed to fetch sensor data" }, { status: 500 })
  }
}

// DELETE sensor data by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.conversations.delete({
      where: { id: Number.parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting sensor data:", error)
    return NextResponse.json({ error: "Failed to delete sensor data" }, { status: 500 })
  }
}
