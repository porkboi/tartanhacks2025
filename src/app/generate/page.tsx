"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { FoodItem } from "@/lib/mockDb"

export default function GeneratePage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [recipe, setRecipe] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendedItems, setRecommendedItems] = useState<FoodItem[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/get-food-items")
      if (response.ok) {
        const data = await response.json()
        setFoodItems(
          data.sort((a: FoodItem, b: FoodItem) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()),
        )
        updateRecommendedItems(data)
      } else {
        console.error("Failed to fetch food items")
      }
    } catch (error) {
      console.error("Error fetching food items:", error)
    }
  }

  const updateRecommendedItems = (items: FoodItem[]) => {
    const twoDaysFromNow = new Date()
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2)

    const expiringSoon = items.filter((item) => new Date(item.expiryDate) <= twoDaysFromNow)
    const recommended = []

    const categories = ["Grain", "Vegetable", "Protein"]
    for (const category of categories) {
      const item = expiringSoon.find((item) => item.category === category)
      if (item) recommended.push(item)
    }

    // Add other expiring items if we don't have all categories
    for (const item of expiringSoon) {
      if (!recommended.includes(item)) {
        recommended.push(item)
      }
      if (recommended.length >= 3) break
    }

    setRecommendedItems(recommended)
  }

  const handleItemSelect = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleGenerate = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one ingredient")
      return
    }

    setIsLoading(true)
    try {
      const selectedIngredients = foodItems.filter((item) => selectedItems.includes(item.id)).map((item) => item.name)

      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      })
      const data = await response.json()
      setRecipe(data.recipe)
    } catch (error) {
      console.error("Error generating recipe:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    try {
      const response = await fetch("/api/update-food-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedItems }),
      })
      if (response.ok) {
        setRecipe("")
        setSelectedItems([])
        fetchFoodItems()
        router.refresh()
      } else {
        console.error("Failed to update food items")
      }
    } catch (error) {
      console.error("Error updating food items:", error)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Generate Recipe</h1>
      {recommendedItems.length > 0 && (
        <Alert className="mb-4">
          <AlertTitle>Recommended Items</AlertTitle>
          <AlertDescription>
            Consider using these items that are expiring soon:
            <ul className="list-disc list-inside">
              {recommendedItems.map((item) => (
                <li key={item.id}>
                  {item.name} (Expires: {item.expiryDate})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Expiry Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foodItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => handleItemSelect(item.id)} />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.expiryDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleGenerate} disabled={isLoading} className="mt-4 mb-4">
        {isLoading ? "Generating..." : "Generate Recipe"}
      </Button>
      {recipe && (
        <div className="space-y-4">
          <Textarea value={recipe} readOnly className="h-64" />
          <Button onClick={handleAccept}>Accept Recipe</Button>
        </div>
      )}
    </Layout>
  )
}

