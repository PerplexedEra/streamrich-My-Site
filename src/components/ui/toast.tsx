"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toaster"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export function useToaster() {
  const { toast } = useToast()

  const showToast = React.useCallback(
    (
      title: string,
      description?: string,
      variant: "default" | "destructive" | "success" = "default"
    ) => {
      toast({
        title,
        description,
        variant,
        duration: 3000,
      })
    },
    [toast]
  )

  const showSuccess = React.useCallback(
    (title: string, description?: string) => {
      showToast(title, description, "success")
    },
    [showToast]
  )

  const showError = React.useCallback(
    (title: string, description?: string) => {
      showToast(title, description, "destructive")
    },
    [showToast]
  )

  return {
    showToast,
    showSuccess,
    showError,
  }
}

export function SuccessToast({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 pt-0.5">
        <Check className="h-5 w-5 text-green-500" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
    </div>
  )
}

export function ErrorToast({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 pt-0.5">
        <X className="h-5 w-5 text-red-500" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
    </div>
  )
}
