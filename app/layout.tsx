import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })


export const metadata: Metadata = {
  title: "HireLoop",
  icons: {
    icon: "/logos/Icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        geist.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-screen bg-background text-foreground">
        
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>

      </body>
    </html>
  )
}