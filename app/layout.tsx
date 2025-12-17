import type React from "react"
import type { Metadata } from "next"
// 1. Adicionamos as fontes novas (Dancing Script e Nunito) junto com as antigas
import { Playfair_Display, Lato, Dancing_Script, Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
// 2. Importamos o Toaster para os alertas funcionarem
import { Toaster } from "@/components/ui/sonner" 
import "./globals.css"

// Configuração das fontes
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-lato" })
// Fontes da Confeitaria (Identidade Visual)
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" })
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })

export const metadata: Metadata = {
  title: "Ateliê Aflorar Doces | Confeitaria Artesanal",
  description:
    "Doces artesanais feitos à mão com ingredientes selecionados. Bolos, docinhos e muito mais para abraçar seu dia.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        // 3. Injetamos as variáveis de todas as fontes no body
        className={`
          ${playfair.variable} 
          ${lato.variable} 
          ${dancingScript.variable} 
          ${nunito.variable} 
          font-sans antialiased
        `}
      >
        <ThemeProvider>
          {children}
          {/* 4. O Toaster precisa estar aqui para os popups funcionarem */}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}