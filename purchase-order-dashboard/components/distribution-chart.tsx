import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "UNFI", cases: 1000, revenue: 50000 },
  { name: "KeHE", cases: 800, revenue: 40000 },
  { name: "Vistar", cases: 600, revenue: 30000 },
]

export function DistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution by Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="cases" fill="#8884d8" name="Cases" />
            <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

