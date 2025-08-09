"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type UserRole = "STREAMER" | "CREATOR" | "ADMIN"

type User = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
  points?: number
  balance?: number
}

export function useAuth(requiredRole?: UserRole, redirectTo?: string) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as User | undefined
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  
  // Check if user has the required role
  const hasRole = requiredRole 
    ? user?.role === requiredRole || user?.role === "ADMIN"
    : true

  // Handle redirects based on auth state and role
  useEffect(() => {
    if (isLoading) return
    
    // If not authenticated and a role is required, redirect to signin
    if (!isAuthenticated && requiredRole) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    
    // If authenticated but doesn't have the required role, redirect to dashboard
    if (isAuthenticated && requiredRole && !hasRole) {
      router.push(redirectTo || "/dashboard")
    }
  }, [isLoading, isAuthenticated, hasRole, requiredRole, router, redirectTo])

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    role: user?.role as UserRole | undefined,
    isAdmin: user?.role === "ADMIN",
    isStreamer: user?.role === "STREAMER",
    isCreator: user?.role === "CREATOR",
  }
}

// Hook to check if the current user is the owner of a resource
export function useIsOwner(ownerId: string) {
  const { user } = useAuth()
  return user?.id === ownerId
}

// Hook to protect a page based on user role
export function useProtectedRoute(requiredRole?: UserRole, redirectTo?: string) {
  const auth = useAuth(requiredRole, redirectTo)
  return auth
}

// Hook to get the current user's role
export function useUserRole() {
  const { user } = useAuth()
  return user?.role
}

// Hook to check if the current user is an admin
export function useIsAdmin() {
  const { user } = useAuth()
  return user?.role === "ADMIN"
}

// Hook to check if the current user is a streamer
export function useIsStreamer() {
  const { user } = useAuth()
  return user?.role === "STREAMER"
}

// Hook to check if the current user is a creator
export function useIsCreator() {
  const { user } = useAuth()
  return user?.role === "CREATOR"
}
