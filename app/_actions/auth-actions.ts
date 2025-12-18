"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation" // <--- Importação crucial

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // 1. Tenta logar passando redirect: false
    // Isso impede que o NextAuth lance o erro de redirecionamento automático
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false, 
    })
    
  } catch (error) {
    // Se der erro de autenticação (senha errada), cai aqui
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Email ou senha incorretos."
        default:
          return "Erro ao tentar entrar. Tente novamente."
      }
    }
    // Se for outro erro (banco fora do ar, etc), repassa pra frente
    throw error
  }

  // 2. Se o código chegou aqui, significa que NÃO deu erro no await signIn.
  // Então o login foi sucesso! Agora nós forçamos o redirecionamento.
  redirect("/admin")
}