import { type NextRequest, NextResponse } from "next/server"
import mockDb from "@/lib/mockDb"

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()
    await mockDb.updateFoodItems(ids)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating food items:", error)
    return NextResponse.json({ error: "Failed to update food items" }, { status: 500 })
  }
}

