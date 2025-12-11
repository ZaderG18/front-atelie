"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  // 1. Estado para saber se já estamos no navegador
  const [mounted, setMounted] = React.useState(false)

  // 2. Assim que carregar, avisa que está montado
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 3. Se ainda não carregou (está no servidor), mostra um botão vazio ou placeholder
  // Isso evita o erro de Hidratação
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="text-foreground">
        {/* Renderiza um espaço vazio do mesmo tamanho para não pular a tela */}
        <span className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-foreground"
      aria-label={resolvedTheme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}
