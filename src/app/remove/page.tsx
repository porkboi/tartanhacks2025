"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FoodItem {
  id: number
  name: string
  expiryDate: string
}

export default function RemovePage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/get-food-items")
      if (response.ok) {
        const data = await response.json()
        setFoodItems(data)
      } else {
        console.error("Failed to fetch food items")
      }
    } catch (error) {
      console.error("Error fetching food items:", error)
    }
  }

  const handleRemove = async (id: number) => {
    try {
      const response = await fetch("/api/remove-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        setFoodItems(foodItems.filter((item) => item.id !== id))
        router.refresh()
      } else {
        console.error("Failed to remove food item")
      }
    } catch (error) {
      console.error("Error removing food item:", error)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Remove Food Items</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foodItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.expiryDate}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleRemove(item.id)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  )
}

