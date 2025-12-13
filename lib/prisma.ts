import { PrismaClient } from '@prisma/client'

// Adiciona o prisma ao escopo global do NodeJS para evitar recriação
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Se já existir uma conexão global, usa ela. Se não, cria uma nova.
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Em desenvolvimento, salva a conexão na variável global para sobreviver ao hot-reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}