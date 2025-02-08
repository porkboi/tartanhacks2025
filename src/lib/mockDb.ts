export interface FoodItem {
  id: number
  name: string
  expiryDate: string
  category: "Fruit" | "Vegetable" | "Grain" | "Protein" | "Other"
  quantity: number
}

class MockDatabase {
  private foodItems: FoodItem[] = [
    { id: 1, name: "Milk", expiryDate: "2023-06-30", category: "Protein", quantity: 1 },
    { id: 2, name: "Eggs", expiryDate: "2023-07-15", category: "Protein", quantity: 12 },
    { id: 3, name: "Bread", expiryDate: "2023-06-25", category: "Grain", quantity: 1 },
    { id: 4, name: "Cheese", expiryDate: "2023-07-05", category: "Protein", quantity: 1 },
    { id: 5, name: "Tomatoes", expiryDate: "2023-06-28", category: "Vegetable", quantity: 5 },
  ]

  private nextId = 6

  async getAllFoodItems(): Promise<FoodItem[]> {
    return [...this.foodItems]
  }

  async addFoodItem(name: string, expiryDate: string, category: FoodItem["category"], quantity: number): Promise<void> {
    const newItem: FoodItem = { id: this.nextId++, name, expiryDate, category, quantity }
    this.foodItems.push(newItem)
    console.log(`Added new item: ${JSON.stringify(newItem)}`)
  }

  async removeFoodItem(id: number): Promise<void> {
    this.foodItems = this.foodItems.filter((item) => item.id !== id)
  }

  async updateFoodItems(ids: number[]): Promise<void> {
    this.foodItems = this.foodItems.filter((item) => !ids.includes(item.id))
  }

  async updateFoodItemQuantity(id: number, quantity: number): Promise<void> {
    const item = this.foodItems.find((item) => item.id === id)
    if (item) {
      item.quantity = quantity
    }
  }
}

const mockDb = new MockDatabase()
export default mockDb

