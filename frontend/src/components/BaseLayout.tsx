"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PropsWithChildren } from "react"

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/deal.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/"
                  ? "text-primary underline underline-offset-4"
                  : "text-foreground"
              }`}
            >
              Clients
            </Link>
            <Link
              href="/deals"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/deals"
                  ? "text-primary underline underline-offset-4"
                  : "text-foreground"
              }`}
            >
              Deals
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-8">{children}</div>
      </main>
    </div>
  )
}

export default BaseLayout
