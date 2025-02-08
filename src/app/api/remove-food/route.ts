import { type NextRequest, NextResponse } from "next/server"
import mockDb from "@/lib/mockDb"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    await mockDb.removeFoodItem(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing food item:", error)
    return NextResponse.json({ error: "Failed to remove food item" }, { status: 500 })
  }
}

