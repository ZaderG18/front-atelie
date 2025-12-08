"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24 lg:py-32">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            A confeitaria artesanal que abraça seu dia
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground md:mx-0 text-pretty">
            Doces feitos à mão com ingredientes selecionados, carinho e dedicação em cada detalhe.
          </p>
          <Button
            size="lg"
            className="gap-2 rounded-xl bg-primary px-8 text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
            onClick={onCtaClick}
          >
            Ver Cardápio
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md md:mx-0">
          <div className="absolute inset-0 rounded-full bg-primary/10" />
          <img
            src="/beautiful-spatula-cake-with-fresh-strawberries-and.jpg"
            alt="Bolo espatulado com morangos frescos"
            className="relative z-10 h-full w-full rounded-3xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
