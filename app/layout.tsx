import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Lato, Dancing_Script, Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner" 
import { SessionProvider } from "next-auth/react" // <--- 1. Importar o Provider
import { auth } from "@/auth" // <--- 2. Importar a função auth (do servidor)
import "./globals.css"

// Configuração das fontes
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-lato" })
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" })
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })

export const metadata: Metadata = {
  title: "Ateliê Aflorar Doces | Confeitaria Artesanal",
  description:
    "Doces artesanais feitos à mão com ingredientes selecionados. Bolos, docinhos e muito mais para abraçar seu dia.",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

// 3. Transforme o layout em async para buscar a sessão no servidor
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // 4. Busque a sessão no lado do servidor
  const session = await auth()

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        className={`
          ${playfair.variable} 
          ${lato.variable} 
          ${dancingScript.variable} 
          ${nunito.variable} 
          font-sans antialiased
        `}
      >
        {/* 5. Envolva tudo com o SessionProvider passando a sessão */}
        <SessionProvider session={session}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}