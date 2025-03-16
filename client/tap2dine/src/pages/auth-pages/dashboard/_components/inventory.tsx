"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "../../../../components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/ui/card"
import { ChartContainer } from "../../../../components/ui/chart"
import { TIngredientResponseType } from "../../../../types/response.types"


interface Ingredient {
  id: string
  name: string
  quantity_available: number
  displayName?: string
  unit?: string
}

export default function IngredientStock({data}:{data:TIngredientResponseType[]}) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [lowStockItems, setLowStockItems] = useState<Ingredient[]>([])

  useEffect(() => {

    const processedData = data?.map((item) => {
      const nameParts = item.name.split("-")
      const displayName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
      const unit = nameParts.length > 1 ? nameParts[1] : "unit"

      return {
        ...item,
        displayName,
        unit,
      }
    })

    setIngredients(processedData)
    setLowStockItems(processedData.filter((item) => item.quantity_available < 100))
  }, [data])

  return (
    <div className="space-y-4">
      {lowStockItems.length > 0 && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm">Low Stock Alert:</AlertTitle>
          <AlertDescription className="text-sm">
            {lowStockItems.map((item) => ` ${item.displayName}`).join(", ")}
          </AlertDescription>
        </Alert>
      )}
    <div className="flex gap-4">
      <Card className="w-1/2 h-fit">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Ingredient Stock Levels</CardTitle>
          <CardDescription className="text-xs">Current inventory quantities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[150px]">
            <ChartContainer
              config={{
                stock: {
                  label: "Stock Level",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ingredients} >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayName" textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, _name, props) => {
                      const ingredient = ingredients.find((i) => i.displayName === props.payload.displayName)
                      return [`${value} ${ingredient?.unit || "units"}`, "Quantity"]
                    }}
                    labelFormatter={(value) => `${value}`}
                  />
                  <Bar
                    dataKey="quantity_available"
                    name="stock"
                    fill="hsl(var(--primary))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Inventory Summary</CardTitle>
          <CardDescription className="text-xs">Stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-sm">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className={`p-2 rounded-lg border ${
                  ingredient.quantity_available < 100 ? "border-destructive bg-destructive/10" : "border-border"
                }`}
              >
                <div className="font-medium">{ingredient.displayName}</div>
                <div className="text-xs text-muted-foreground">
                  {ingredient.quantity_available} {ingredient.unit}
                </div>
                {ingredient.quantity_available < 100 && (
                  <div className="text-xs font-medium text-destructive">Low!</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}

