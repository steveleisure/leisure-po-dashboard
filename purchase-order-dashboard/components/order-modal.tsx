"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "./ui/status-badge"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Set the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PurchaseOrder {
  distributor: string
  poNumber: string
  orderDate: string
  deliveryDate: string
  totalCases: number
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "cancelled"
  items?: {
    sku: string
    description: string
    qty: number
    unitCost: number
    totalCost: number
  }[]
  shippingInfo?: {
    address: string
    terms: string
    contact: string
    email: string
  }
  pdfUrl: string // Add this field
}

interface OrderModalProps {
  order: PurchaseOrder
  onClose: () => void
  onStatusChange: (newStatus: PurchaseOrder["status"]) => void
}

export function OrderModal({ order, onClose, onStatusChange }: OrderModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.poNumber}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold">Order Information</h3>
            <p>Distributor: {order.distributor}</p>
            <p>Order Date: {order.orderDate}</p>
            <p>Delivery Date: {order.deliveryDate}</p>
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <Select defaultValue={order.status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <StatusBadge status="Pending" variant="pending" />
                  </SelectItem>
                  <SelectItem value="processing">
                    <StatusBadge status="Processing" variant="processing" />
                  </SelectItem>
                  <SelectItem value="shipped">
                    <StatusBadge status="Shipped" variant="shipped" />
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <StatusBadge status="Cancelled" variant="cancelled" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Shipping Information</h3>
            <p>Address: {order.shippingInfo?.address || "N/A"}</p>
            <p>Terms: {order.shippingInfo?.terms || "N/A"}</p>
            <p>Contact: {order.shippingInfo?.contact || "N/A"}</p>
            <p>Email: {order.shippingInfo?.email || "N/A"}</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Cost</TableHead>
              <TableHead>Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                <TableCell>${item.totalCost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-right">
          <p className="font-semibold">Total Cases: {order.totalCases}</p>
          <p className="font-semibold">Total Amount: ${order.totalAmount.toFixed(2)}</p>
        </div>
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Purchase Order PDF</h3>
          <div className="flex justify-center">
            <Document
              file={order.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="border border-gray-300 rounded-lg overflow-hidden"
            >
              <Page pageNumber={pageNumber} width={600} />
            </Document>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={pageNumber <= 1}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <p>
              Page {pageNumber} of {numPages}
            </p>
            <Button
              onClick={() => setPageNumber((page) => Math.min(numPages || page, page + 1))}
              disabled={pageNumber >= (numPages || 1)}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

