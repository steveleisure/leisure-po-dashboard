import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./ui/status-badge"

interface PurchaseOrder {
  status: "pending" | "processing" | "shipped" | "cancelled"
}

interface StatusSummaryProps {
  orders: PurchaseOrder[]
}

export function StatusSummary({ orders }: StatusSummaryProps) {
  // Calculate status counts from the orders array
  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusData = [
    { status: "pending", count: statusCounts["pending"] || 0 },
    { status: "processing", count: statusCounts["processing"] || 0 },
    { status: "shipped", count: statusCounts["shipped"] || 0 },
    { status: "cancelled", count: statusCounts["cancelled"] || 0 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusData.map((item) => (
            <div key={item.status} className="flex justify-between items-center">
              <StatusBadge
                status={item.status}
                variant={item.status as "pending" | "processing" | "shipped" | "cancelled"}
              />
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

