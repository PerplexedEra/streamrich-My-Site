import { Hero } from "@/components/landing/hero"
import { RoleSelector } from "@/components/auth/role-selector"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <section id="how-it-works" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of users who are already earning and growing with StreamRich
            </p>
          </div>
        </div>
      </section>
      <RoleSelector />
    </main>
  )
}
