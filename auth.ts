import NextAuth, { type User } from "next-auth" // <--- 1. Importamos o tipo User
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"

import { authConfig } from "./auth.config"
import { prisma } from "@/lib/prisma"

async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials)

        if (!parsed.success) {
          return null
        }

        const { email, password } = parsed.data

        const user = await getUserByEmail(email)
        if (!user) {
          console.warn("Usuário não encontrado:", email)
          return null
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          console.warn("Senha inválida para:", email)
          return null
        }

        // Retorna apenas dados seguros
        // O "as User" abaixo força o TypeScript a aceitar que o role está certo
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        } as User // <--- 2. A Mágica acontece aqui
      },
    }),
  ],
})