import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * O objeto retornado pelo hook `useSession`, `auth()`, etc.
   */
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "EMPLOYEE"
    } & DefaultSession["user"] // Mantém name, email, image originais
  }

  /**
   * O objeto do usuário vindo do banco de dados (Prisma Adapter ou authorize)
   */
  interface User {
    role: "ADMIN" | "EMPLOYEE"
  }
}

declare module "next-auth/jwt" {
  /**
   * O token JWT criptografado
   */
  interface JWT {
    id: string
    role: "ADMIN" | "EMPLOYEE"
  }
}