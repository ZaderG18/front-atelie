"use client"

import { Menu, ShoppingBag, Flower2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  cartItemsCount: number
  onCartClick: () => void
  onMenuClick: () => void
}

export function Header({ cartItemsCount, onCartClick, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground md:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Início
          </a>
          <a
            href="#cardapio"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Cardápio
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Flower2 className="h-6 w-6 text-primary" />
          <span className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-foreground">
            Ateliê Aflorar
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#sobre" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Sobre
          </a>
          <a href="#contato" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Contato
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="relative text-foreground"
            onClick={onCartClick}
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
