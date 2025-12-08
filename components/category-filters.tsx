"use client"

import { cn } from "@/lib/utils"

const categories = [
  { id: "todos", label: "Todos" },
  { id: "bolos_festivos", label: "Bolos Festivos" },
  { id: "bolos-no-pote", label: "Bolos no Pote" },
  { id: "docinhos", label: "Docinhos" },
  { id: "salgados", label: "Salgados" },
  { id: "tortas", label: "Tortas" },

]

interface CategoryFiltersProps {
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilters({ selected, onSelect }: CategoryFiltersProps) {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
            selected === category.id
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
