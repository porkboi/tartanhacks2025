"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle } from "lucide-react"
import type { FoodItem } from "@/lib/mockDb"

export default function AddPage() {
  const [name, setName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [category, setCategory] = useState<FoodItem["category"]>("Other")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/add-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, expiryDate, category }),
      })
      if (response.ok) {
        setName("")
        setExpiryDate("")
        setCategory("Other")
        router.refresh()
      } else {
        console.error("Failed to add food item")
      }
    } catch (error) {
      console.error("Error adding food item:", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    setUploadResult(null)
    const formData = new FormData()
    formData.append("receipt", file)

    try {
      const response = await fetch("/api/process-receipt", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadResult({
          success: true,
          message: `Successfully added ${data.addedItems.length} items from the receipt.`,
        })
        router.refresh()
      } else {
        setUploadResult({
          success: false,
          message: "Failed to process receipt. Please try again or add items manually.",
        })
      }
    } catch (error) {
      console.error("Error processing receipt:", error)
      setUploadResult({
        success: false,
        message: "An error occurred while processing the receipt. Please try again later.",
      })
    } finally {
      setIsUploading(false)
      setFile(null)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Add Food Items</h1>
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="receipt">Receipt Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Add Food Item Manually</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Food Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value: FoodItem["category"]) => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fruit">Fruit</SelectItem>
                      <SelectItem value="Vegetable">Vegetable</SelectItem>
                      <SelectItem value="Grain">Grain</SelectItem>
                      <SelectItem value="Protein">Protein</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Add Item</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="receipt">
          <Card>
            <CardHeader>
              <CardTitle>Upload Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReceiptUpload} className="space-y-4">
                <div>
                  <Label htmlFor="receipt">Upload Receipt Image</Label>
                  <Input id="receipt" type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Processing..." : "Upload Receipt"}
                </Button>
              </form>
              {uploadResult && (
                <Alert className={`mt-4 ${uploadResult.success ? "bg-green-100" : "bg-red-100"}`}>
                  {uploadResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{uploadResult.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>{uploadResult.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

