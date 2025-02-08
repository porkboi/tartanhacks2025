"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Plus, Minus } from "lucide-react"
import type { FoodItem } from "@/lib/mockDb"
import axios from "axios";

export default function WhatsInMyFridgePage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [name, setName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [category, setCategory] = useState<FoodItem["category"]>("Other")
  const [quantity, setQuantity] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)
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

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/add-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, expiryDate, category, quantity }),
      })
      if (response.ok) {
        setName("")
        setExpiryDate("")
        setCategory("Other")
        setQuantity(1)
        fetchFoodItems()
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
    e.preventDefault();
    if (!file) return;
  
    setIsUploading(true);
    setUploadResult(null);
    const formData = new FormData();
    formData.append("file", file); // Ensure the field name matches the backend
  
    try {
      const response = await axios.post("http://localhost:8000/api/process-receipt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        const data = response.data;
        setUploadResult({
          success: true,
          message: `Successfully added ${data.addedItems.length} items from the receipt.`,
        });
        fetchFoodItems();
      } else {
        throw new Error("Failed to process receipt");
      }
    } catch (error) {
      console.error("Error processing receipt:", error);
      setUploadResult({
        success: false,
        message: "An error occurred while processing the receipt. Please try again later.",
      });
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

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
        fetchFoodItems()
      } else {
        console.error("Failed to remove food item")
      }
    } catch (error) {
      console.error("Error removing food item:", error)
    }
  }

  const handleQuantityChange = async (id: number, change: number) => {
    const item = foodItems.find((item) => item.id === id);
    if (!item) return;
  
    const newQuantity = Math.max(0, item.quantity + change);
  
    try {
      const response = await fetch("/api/update-food-quantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQuantity }),
      });
  
      if (!response.ok) {
        console.error("Failed to update food item quantity");
        return;
      }
  
      // Check API response
      const data = await response.json();
      console.log("API Response:", data);
  
      // Update UI immediately
      setFoodItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
  
      // Optional: Re-fetch data
      fetchFoodItems();
    } catch (error) {
      console.error("Error updating food item quantity:", error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-green-700">What's in My Fridge?</h1>
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view">View Items</TabsTrigger>
          <TabsTrigger value="add">Add Manually</TabsTrigger>
          <TabsTrigger value="receipt">Upload Receipt</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Food Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foodItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, -1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleRemove(item.id)}>
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
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
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                    min={1}
                    required
                  />
                </div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Add Item
                </Button>
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
                <Button type="submit" disabled={isUploading} className="bg-green-600 hover:bg-green-700">
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

