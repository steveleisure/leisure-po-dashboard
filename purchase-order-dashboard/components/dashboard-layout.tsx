"use client"

import { useState } from "react"
import { SummaryCards } from "./summary-cards"
import { OrderTable } from "./order-table"
import { DistributionChart } from "./distribution-chart"
import { RevenueChart } from "./revenue-chart"
import { StatusSummary } from "./status-summary"

// Using the same mock data from OrderTable to ensure consistency
const initialOrders = [
  {
    distributor: "UNFI",
    poNumber: "PO-001",
    orderDate: "2023-05-01",
    deliveryDate: "2023-05-07",
    totalCases: 100,
    totalAmount: 5000,
    status: "pending",
  },
  // ... rest of the mock data
]

export function DashboardLayout() {
  const [orders, setOrders] = useState(initialOrders)

  const handleStatusUpdate = (updatedOrders: typeof initialOrders) => {
    setOrders(updatedOrders)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Purchase Order Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <SummaryCards />
      </div>
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <DistributionChart />
        <RevenueChart />
        <StatusSummary orders={orders} />
      </div>
      <OrderTable orders={orders} onStatusUpdate={handleStatusUpdate} />
    </div>
  )
}

