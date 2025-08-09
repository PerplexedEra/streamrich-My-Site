"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type UserRole = "STREAMER" | "CREATOR"

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = async () => {
    if (!selectedRole) return
    
    try {
      setIsLoading(true)
      // In a real app, you might save this to a cookie or session
      // and then redirect to the signup page with the role as a query param
      router.push(`/auth/signup?role=${selectedRole.toLowerCase()}`)
    } catch (error) {
      console.error("Error selecting role:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Choose Your Role</CardTitle>
          <CardDescription>
            Select how you want to use StreamRich
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleRoleSelect("STREAMER")}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 p-6 transition-all hover:border-primary hover:bg-accent/50 ${
                selectedRole === "STREAMER"
                  ? "border-primary bg-accent/30"
                  : "border-muted-foreground/20"
              }`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                >
                  <path d="M12 2v20" />
                  <path d="M2 12h20" />
                  <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">I'm a Streamer</h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                I want to watch/listen to content and earn rewards
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("CREATOR")}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 p-6 transition-all hover:border-primary hover:bg-accent/50 ${
                selectedRole === "CREATOR"
                  ? "border-primary bg-accent/30"
                  : "border-muted-foreground/20"
              }`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                >
                  <path d="M12 2v20" />
                  <path d="M2 12h20" />
                  <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">I'm a Creator</h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                I want to upload and promote my content
              </p>
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            className="w-full"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Continuing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
