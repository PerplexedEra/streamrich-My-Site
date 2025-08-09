import Link from "next/link"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-8 w-8" />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
                StreamRich
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The platform where creators and streamers connect, create, and earn together.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/yourusername/streamrich"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="sr-only">GitHub</span>
                <Icons.github className="h-5 w-5" />
              </a>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">For Streamers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/streamer/how-it-works"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/streamer/earnings"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Earnings & Rewards
                </Link>
              </li>
              <li>
                <Link
                  href="/streamer/faq"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">For Creators</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/creator/upload"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Upload Content
                </Link>
              </li>
              <li>
                <Link
                  href="/creator/pricing"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/creator/analytics"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} StreamRich. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
