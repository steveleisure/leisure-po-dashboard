import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, ShoppingCart, Truck } from "lucide-react"

interface SummaryCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
)

export function SummaryCards() {
  // In a real application, these values would come from your data
  return (
    <>
      <SummaryCard
        title="Total Orders"
        value="1,234"
        icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
      />
      <SummaryCard title="Total Cases" value="5,678" icon={<Package className="h-4 w-4 text-muted-foreground" />} />
      <SummaryCard
        title="Total Revenue"
        value="$123,456"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <SummaryCard title="Pending Deliveries" value="42" icon={<Truck className="h-4 w-4 text-muted-foreground" />} />
    </>
  )
}

