import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 })
    }

    const ingredientsList = ingredients.join(", ")

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates recipes based on available ingredients.",
        },
        {
          role: "user",
          content: `Generate a recipe using the following ingredients: ${ingredientsList}. Please provide a title for the recipe, a list of ingredients with quantities, and step-by-step instructions.`,
        },
      ],
    })

    const recipe = completion.choices[0].message.content

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error("Error generating recipe:", error)
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 })
  }
}

