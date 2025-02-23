"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { OrderModal } from "./order-modal"
import { StatusBadge } from "./ui/status-badge"
import { format } from "date-fns"

interface PurchaseOrder {
  distributor: string
  poNumber: string
  orderDate: string
  deliveryDate: string
  totalCases: number
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "cancelled"
}

interface OrderTableProps {
  orders: PurchaseOrder[]
  onStatusUpdate: (orders: PurchaseOrder[]) => void
}

export function OrderTable({ orders, onStatusUpdate }: OrderTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof PurchaseOrder>("orderDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [distributorFilter, setDistributorFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })
  const ordersPerPage = 10

  const filteredData = orders.filter((order) => {
    const matchesSearch =
      order.distributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.poNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDistributor = distributorFilter === "all" || order.distributor === distributorFilter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesDateRange =
      (!dateRange.from || new Date(order.orderDate) >= dateRange.from) &&
      (!dateRange.to || new Date(order.orderDate) <= dateRange.to)
    return matchesSearch && matchesDistributor && matchesStatus && matchesDateRange
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / ordersPerPage)
  const paginatedData = sortedData.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

  const handleSort = (column: keyof PurchaseOrder) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleStatusChange = (newStatus: PurchaseOrder["status"]) => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) =>
        order.poNumber === selectedOrder.poNumber ? { ...order, status: newStatus } : order,
      )
      onStatusUpdate(updatedOrders)
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const uniqueDistributors = Array.from(new Set(orders.map((order) => order.distributor)))

  useEffect(() => {
    setCurrentPage(1)
  }, [distributorFilter, statusFilter, dateRange, searchTerm])

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Select value={distributorFilter} onValueChange={setDistributorFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Distributor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Distributors</SelectItem>
              {uniqueDistributors.map((distributor) => (
                <SelectItem key={distributor} value={distributor}>
                  {distributor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            onClick={() => {
              setDistributorFilter("all")
              setStatusFilter("all")
              setDateRange({ from: null, to: null })
              setSearchTerm("")
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {["Distributor", "PO Number", "Order Date", "Delivery Date", "Total Cases", "Total Amount", "Status"].map(
              (header) => (
                <TableHead
                  key={header}
                  className="cursor-pointer"
                  onClick={() => handleSort(header.toLowerCase().replace(" ", "") as keyof PurchaseOrder)}
                >
                  <div className="flex items-center">
                    {header}
                    {sortColumn === header.toLowerCase().replace(" ", "") &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((order) => (
            <TableRow
              key={order.poNumber}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedOrder(order)}
            >
              <TableCell>{order.distributor}</TableCell>
              <TableCell>{order.poNumber}</TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>{order.deliveryDate}</TableCell>
              <TableCell>{order.totalCases}</TableCell>
              <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} variant={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <div>
          Showing {(currentPage - 1) * ordersPerPage + 1} to {Math.min(currentPage * ordersPerPage, sortedData.length)}{" "}
          of {sortedData.length} orders
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}

