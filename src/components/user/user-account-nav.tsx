"use client"

import * as React from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"

export interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    name?: string | null
    image?: string | null
    email?: string | null
    role?: string
    points?: number
    balance?: number
  }
}

export function UserAccountNav({ user, className, ...props }: UserAccountNavProps) {
  const { toast } = useToast()
  
  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: `${window.location.origin}/`,
      })
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("relative h-8 w-8 rounded-full", className)}
          {...props}
        >
          <Avatar className="h-8 w-8">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name || ""} />
            ) : (
              <AvatarFallback>
                {user?.name ? (
                  getInitials(user.name)
                ) : user?.email ? (
                  user.email[0].toUpperCase()
                ) : (
                  <Icons.user className="h-4 w-4" />
                )}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            {user.name && (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            )}
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
            {user.role && (
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {(user.points !== undefined || user.balance !== undefined) && (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {user.points !== undefined && (
                <div className="flex items-center justify-between">
                  <span>Points</span>
                  <span className="font-medium text-foreground">{user.points.toLocaleString()}</span>
                </div>
              )}
              {user.balance !== undefined && (
                <div className="mt-1 flex items-center justify-between">
                  <span>Balance</span>
                  <span className="font-medium text-foreground">
                    ${user.balance.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/account">
              <Icons.user className="mr-2 h-4 w-4" />
              <span>Account</span>
              <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Icons.settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          {user.role === 'CREATOR' && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/creator/content">
                <Icons.video className="mr-2 h-4 w-4" />
                <span>My Content</span>
              </Link>
            </DropdownMenuItem>
          )}
          {user.role === 'STREAMER' && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/streamer/rewards">
                <Icons.star className="mr-2 h-4 w-4" />
                <span>My Rewards</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <Icons.logOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
