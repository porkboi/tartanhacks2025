import { type NextRequest, NextResponse } from "next/server"
import mockDb from "@/lib/mockDb"

export async function POST(request: NextRequest) {
  try {
    const { id, quantity } = await request.json()
    await mockDb.updateFoodItemQuantity(id, quantity)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating food item quantity:", error)
    return NextResponse.json({ error: "Failed to update food item quantity" }, { status: 500 })
  }
}

