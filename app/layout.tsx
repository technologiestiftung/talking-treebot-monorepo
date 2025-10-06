import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import "./globals.css"

export const metadata: Metadata = {
  title: "Treebot Tales",
  description: "Explore conversational insights about the recent treebot talks",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AnimatedBackground />
        {children}</body>
    </html>
  )
}
