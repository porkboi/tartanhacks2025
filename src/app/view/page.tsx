import mockDb from "@/lib/mockDb"
import Layout from "../components/layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FoodItem {
  id: number
  name: string
  expiryDate: string
}

export default async function ViewPage() {
  const foodItems: FoodItem[] = await mockDb.getAllFoodItems()

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">View Food Items</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Expiry Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foodItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.expiryDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  )
}

