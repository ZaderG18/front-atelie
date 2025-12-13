// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 1. Mapeamos os códigos antigos para nomes bonitos de categoria
const categoriesMap: Record<string, string> = {
  "bolos_festivos": "Bolos Festivos",
  "bolos_no_pote": "Bolos de Pote",
  "docinhos": "Docinhos",
  "salgados": "Salgados"
}

const productsData = [
  {
    name: "Bolo de Ninho com Morango",
    description: "Camadas de massa macia com creme de leite ninho e morangos frescos.",
    price: 89.9,
    categoryKey: "bolos_festivos", // Usamos uma chave para buscar a categoria depois
    image: "/elegant-layered-cake-with-strawberries-and-cream--.jpg",
    madeToOrder: true,
  },
  {
    name: "Bolo Red Velvet",
    description: "O clássico bolo vermelho com cobertura de cream cheese.",
    price: 95.9,
    categoryKey: "bolos_festivos",
    image: "/red-velvet-cake-with-cream-cheese-frosting--elegan.jpg",
    madeToOrder: true,
  },
  {
    name: "Bolo Espatulado de Chocolate",
    description: "Bolo artesanal com textura rústica e recheio cremoso de brigadeiro gourmet.",
    price: 79.9,
    categoryKey: "bolos_festivos",
    image: "/rustic-chocolate-spatula-cake-with-brigadeiro-fill.jpg",
    madeToOrder: false,
  },
  {
    name: "Bolo no Pote - Brigadeiro",
    description: "Camadas de bolo, brigadeiro gourmet e granulado belga.",
    price: 18.9,
    categoryKey: "bolos_no_pote",
    image: "/brazilian-brigadeiro-cake-in-a-jar--layered-desser.jpg",
    madeToOrder: false,
  },
  {
    name: "Bolo no Pote - Ninho com Nutella",
    description: "Combinação irresistível de creme de leite ninho com Nutella.",
    price: 22.9,
    categoryKey: "bolos_no_pote",
    image: "/cake-in-jar-with-cream-and-nutella-layers--elegant.jpg",
    madeToOrder: false,
  },
  {
    name: "Brigadeiro Gourmet (25 un)",
    description: "Brigadeiros artesanais com chocolate belga.",
    price: 45.0,
    categoryKey: "docinhos",
    image: "/gourmet-brazilian-brigadeiros-on-elegant-display--.jpg",
    madeToOrder: false,
  },
  {
    name: "Beijinho (25 un)",
    description: "Docinhos de coco delicados com acabamento artesanal.",
    price: 42.0,
    categoryKey: "docinhos",
    image: "/brazilian-beijinho-coconut-sweets-on-elegant-tray-.jpg",
    madeToOrder: true,
  },
  {
    name: "Mini Coxinha (50 un)",
    description: "Coxinhas artesanais com recheio cremoso de frango.",
    price: 65.0,
    categoryKey: "salgados",
    image: "/brazilian-coxinha-appetizers-on-elegant-serving-pl.jpg",
    madeToOrder: true,
  },
  {
    name: "Mini Esfiha (50 un)",
    description: "Esfihas abertas com carne temperada artesanalmente.",
    price: 60.0,
    categoryKey: "salgados",
    image: "/mini-brazilian-esfiha-meat-pastries-on-wooden-boar.jpg",
    madeToOrder: true,
  },
]

async function main() {
  console.log('🌱 Começando o seed...')
  
  // Limpa o banco antes de popular (na ordem certa por causa das chaves estrangeiras)
  // Deletamos itens de pedido primeiro, depois produtos, depois categorias
  await prisma.orderItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('🧹 Banco limpo.')

  // 1. Criar Categorias e guardar os IDs
  const categoriesIds: Record<string, number> = {}
  
  for (const [key, label] of Object.entries(categoriesMap)) {
    const category = await prisma.category.create({
      data: { name: label }
    })
    categoriesIds[key] = category.id
    console.log(`📂 Categoria criada: ${label}`)
  }

  // 2. Criar Produtos conectados às Categorias
  for (const p of productsData) {
    const categoryId = categoriesIds[p.categoryKey]

    if (!categoryId) {
      console.warn(`⚠️ Categoria não encontrada para: ${p.categoryKey}`)
      continue
    }

    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        basePrice: p.price,         // Nome atualizado no schema
        imageUrl: p.image,          // Nome atualizado no schema
        isMadeToOrder: p.madeToOrder, // Nome atualizado no schema
        isActive: true,
        categoryId: categoryId      // Conexão via ID da categoria
      }
    })
  }
  
  console.log(`✅ ${productsData.length} produtos criados com sucesso!`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })