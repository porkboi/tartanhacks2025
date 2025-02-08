import { NextResponse } from "next/server"
import mockDb from "@/lib/mockDb"

export async function GET() {
  try {
    const foodItems = await mockDb.getAllFoodItems()
    return NextResponse.json(foodItems)
  } catch (error) {
    console.error("Error fetching food items:", error)
    return NextResponse.json({ error: "Failed to fetch food items" }, { status: 500 })
  }
}

