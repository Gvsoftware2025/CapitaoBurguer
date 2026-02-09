import type React from "react"
import type { Metadata } from "next"
import { Bebas_Neue, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Capitão Burguer - Cardápio Digital",
  description: "O melhor hambúrguer na brasa!",
  generator: "v0.app",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
