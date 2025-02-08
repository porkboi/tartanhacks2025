import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-8 text-green-700">Fridge Recipes</h1>
      <div className="grid grid-cols-1 gap-4">
        <Link href="/whats-in-my-fridge">
          <Button className="w-64 bg-green-600 hover:bg-green-700">What's in My Fridge</Button>
        </Link>
        <Link href="/whats-for-my-next-meal">
          <Button className="w-64 bg-green-600 hover:bg-green-700">What's for My Next Meal</Button>
        </Link>
      </div>
    </div>
  )
}

