import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-green-600 p-4 text-white">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:text-green-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-grow flex justify-center">
            <Image src="/logo_small.png" alt="App Logo" width={200} height={100} className="h-12 w-auto" />
          </div>

          <div className="space-x-4">
            <Link href="/whats-in-my-fridge">
              <Button variant="ghost" size="sm" className="text-white hover:text-green-200">
                What's in My Fridge
              </Button>
            </Link>
            <Link href="/whats-for-my-next-meal">
              <Button variant="ghost" size="sm" className="text-white hover:text-green-200">
                What's for My Next Meal
              </Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}

