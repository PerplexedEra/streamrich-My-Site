import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/layout/main-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StreamRich - Get Paid to Stream & Share Content",
  description: "Monetize your content or earn rewards by engaging with others on StreamRich.",
  keywords: ["streaming", "content creation", "monetization", "music", "video"],
  authors: [{ name: "StreamRich Team" }],
  creator: "StreamRich",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://streamrich.app",
    title: "StreamRich - Get Paid to Stream & Share Content",
    description: "Monetize your content or earn rewards by engaging with others on StreamRich.",
    siteName: "StreamRich",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamRich - Get Paid to Stream & Share Content",
    description: "Monetize your content or earn rewards by engaging with others on StreamRich.",
    creator: "@streamrich",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
