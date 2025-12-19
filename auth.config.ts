import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login", // Se não estiver logado, manda pra cá
  },
  callbacks: {
    // 1. O Porteiro (Middleware)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      
      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redireciona para /login
      } else if (isLoggedIn) {
        const isOnLogin = nextUrl.pathname.startsWith("/login")
        if (isOnLogin) {
             return Response.redirect(new URL("/admin", nextUrl))
        }
      }
      return true
    },
    
    // 2. A Mágica do Role (Front-end)
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      // Passa o cargo do Token para a Sessão
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "EMPLOYEE"
      }
      return session
    },

    // 3. A Mágica do Role (Back-end)
    async jwt({ token, user }) {
      if (user) {
        // Salva o cargo do usuário no Token assim que ele loga
        token.role = user.role
      }
      return token
    }
  },
  providers: [], // Providers ficam no auth.ts
} satisfies NextAuthConfig