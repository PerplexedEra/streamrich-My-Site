"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useSession } from "next-auth/react"

export function MainNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8" />
            <span className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
              StreamRich
            </span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/#features"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/#features") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/#pricing") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/blog") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Blog
            </Link>
            {isAdmin && (
              <Link
                href="/admin/store"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  isActive("/admin/store") ? "text-foreground" : "text-foreground/60"
                )}
              >
                Admin Store
              </Link>
            )}
            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/about") ? "text-foreground" : "text-foreground/60"
              )}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
