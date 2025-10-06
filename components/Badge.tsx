import type React from "react"
interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary"
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const variantClasses = variant === "default" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"

  return <span className={`${baseClasses} ${variantClasses}`}>{children}</span>
}
