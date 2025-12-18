import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login", // Se não estiver logado, manda pra cá
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      
      // Lógica do Porteiro:
      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redireciona para /login
      } else if (isLoggedIn) {
        // Se já está logado e tenta ir pro login, manda pro painel
        // (Futuramente podemos mandar funcionários para outra rota)
        const isOnLogin = nextUrl.pathname.startsWith("/login")
        if (isOnLogin) {
             return Response.redirect(new URL("/admin", nextUrl))
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        // Agora o TS sabe que 'role' existe em ambos! Sem erro!
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        // O TS sabe que user tem role e token também
        token.role = user.role
      }
      return token
    }
  },
  providers: [], // Providers vêm no auth.ts para compatibilidade Edge
} satisfies NextAuthConfig