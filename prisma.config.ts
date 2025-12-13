// prisma.config.ts
import "dotenv/config"
import { defineConfig } from "prisma/config"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida no .env")
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },

  migrations: {
    seed: "npx ts-node prisma/seed.ts",
  },
})
