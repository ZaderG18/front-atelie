"use client"

import { X, Flower2 } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm md:hidden">
      <div className="h-full w-64 bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Flower2 className="h-5 w-5 text-primary" />
            <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-foreground">
              Aflorar
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                onClick={onClose}
                className="block rounded-xl px-4 py-3 text-foreground transition-colors hover:bg-muted"
              >
                Início
              </a>
            </li>
            <li>
              <a
                href="#cardapio"
                onClick={onClose}
                className="block rounded-xl px-4 py-3 text-foreground transition-colors hover:bg-muted"
              >
                Cardápio
              </a>
            </li>
            <li>
              <a
                href="#sobre"
                onClick={onClose}
                className="block rounded-xl px-4 py-3 text-foreground transition-colors hover:bg-muted"
              >
                Sobre
              </a>
            </li>
            <li>
              <a
                href="#contato"
                onClick={onClose}
                className="block rounded-xl px-4 py-3 text-foreground transition-colors hover:bg-muted"
              >
                Contato
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
