import type React from "react"
import Image from "next/image"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Leisure%20Hydration%20Lockup%20Blue-Vth99Wuw3CRUbQ5aQJUdf97Ijco2fb.png"
            alt="Leisure Hydration"
            width={200}
            height={80}
            className="h-12 w-auto"
            priority
          />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

