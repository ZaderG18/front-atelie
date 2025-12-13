// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
})
const productsData = [
  {
    name: "Bolo de Ninho com Morango",
    description: "Camadas de massa macia com creme de leite ninho e morangos frescos.",
    sale_price: 89.9,
    category: "bolos_festivos",
    image_url: "/elegant-layered-cake-with-strawberries-and-cream--.jpg",
    is_made_to_order: true,
  },
  {
    name: "Bolo Red Velvet",
    description: "O clássico bolo vermelho com cobertura de cream cheese.",
    sale_price: 95.9,
    category: "bolos_festivos",
    image_url: "/red-velvet-cake-with-cream-cheese-frosting--elegan.jpg",
    is_made_to_order: true,
  },
  {
    name: "Bolo Espatulado de Chocolate",
    description: "Bolo artesanal com textura rústica e recheio cremoso de brigadeiro gourmet.",
    sale_price: 79.9,
    category: "bolos_festivos",
    image_url: "/rustic-chocolate-spatula-cake-with-brigadeiro-fill.jpg",
    is_made_to_order: false,
  },
  {
    name: "Bolo no Pote - Brigadeiro",
    description: "Camadas de bolo, brigadeiro gourmet e granulado belga.",
    sale_price: 18.9,
    category: "bolos_no_pote",
    image_url: "/brazilian-brigadeiro-cake-in-a-jar--layered-desser.jpg",
    is_made_to_order: false,
  },
  {
    name: "Bolo no Pote - Ninho com Nutella",
    description: "Combinação irresistível de creme de leite ninho com Nutella.",
    sale_price: 22.9,
    category: "bolos_no_pote",
    image_url: "/cake-in-jar-with-cream-and-nutella-layers--elegant.jpg",
    is_made_to_order: false,
  },
  {
    name: "Brigadeiro Gourmet (25 un)",
    description: "Brigadeiros artesanais com chocolate belga.",
    sale_price: 45.0,
    category: "docinhos",
    image_url: "/gourmet-brazilian-brigadeiros-on-elegant-display--.jpg",
    is_made_to_order: false,
  },
  {
    name: "Beijinho (25 un)",
    description: "Docinhos de coco delicados com acabamento artesanal.",
    sale_price: 42.0,
    category: "docinhos",
    image_url: "/brazilian-beijinho-coconut-sweets-on-elegant-tray-.jpg",
    is_made_to_order: true,
  },
  {
    name: "Mini Coxinha (50 un)",
    description: "Coxinhas artesanais com recheio cremoso de frango.",
    sale_price: 65.0,
    category: "salgados",
    image_url: "/brazilian-coxinha-appetizers-on-elegant-serving-pl.jpg",
    is_made_to_order: true,
  },
  {
    name: "Mini Esfiha (50 un)",
    description: "Esfihas abertas com carne temperada artesanalmente.",
    sale_price: 60.0,
    category: "salgados",
    image_url: "/mini-brazilian-esfiha-meat-pastries-on-wooden-boar.jpg",
    is_made_to_order: true,
  },
]

async function main() {
  console.log('🌱 Começando o seed...')

  await prisma.product.deleteMany()

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        ...p,
        is_active: true,
      },
    })
  }

  console.log('✅ Banco populado com sucesso!')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
