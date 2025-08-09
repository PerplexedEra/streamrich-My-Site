import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    name?: string | null
    image?: string | null
    email?: string | null
  }
  size?: "sm" | "md" | "lg"
  showName?: boolean
  showEmail?: boolean
}

export function UserAvatar({
  user,
  size = "md",
  showName = false,
  showEmail = false,
  className,
  ...props
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
  }
  
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
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
    <div className={cn("flex items-center gap-3", className)} {...props}>
      {user.image ? (
        <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size])}>
          <Image
            src={user.image}
            alt={user.name || "User avatar"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
            sizeClasses[size]
          )}
        >
          {user?.name ? (
            getInitials(user.name)
          ) : user?.email ? (
            user.email[0].toUpperCase()
          ) : (
            <Icons.user className="h-4 w-4" />
          )}
        </div>
      )}
      
      {(showName || showEmail) && (
        <div className="flex flex-col">
          {showName && user?.name && (
            <span className={cn("font-medium text-foreground", textSizeClasses[size])}>
              {user.name}
            </span>
          )}
          {showEmail && user?.email && (
            <span className={cn("text-muted-foreground", textSizeClasses[size])}>
              {user.email}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
