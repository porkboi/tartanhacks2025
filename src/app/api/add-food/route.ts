import { type NextRequest, NextResponse } from "next/server"
import mockDb from "@/lib/mockDb"

export async function POST(request: NextRequest) {
  try {
    const { name, expiryDate, category, quantity } = await request.json()
    await mockDb.addFoodItem(name, expiryDate, category, quantity)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding food item:", error)
    return NextResponse.json({ error: "Failed to add food item" }, { status: 500 })
  }
}

