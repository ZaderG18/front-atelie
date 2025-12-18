"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { UserRole } from "@prisma/client"

// 1. Tipagem Padronizada
type ActionResult = 
  | { success: true; message: string }
  | { success: false; error: string }

const createUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.nativeEnum(UserRole)
})

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return []
  }
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  try {
    // 2. Casting seguro (Blindagem de input)
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as UserRole,
    }

    const parsed = createUserSchema.safeParse(rawData)

    if (!parsed.success) {
      // Pega o primeiro erro da validação para mostrar
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { name, email, password, role } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    })

    revalidatePath("/admin/configuracoes")
    return { success: true, message: "Usuário cadastrado com sucesso!" }

  } catch (error) {
    // 4. Logs expressivos
    console.error("Erro ao criar usuário:", error)
    return { success: false, error: "Erro interno ao criar usuário." }
  }
}

export async function deleteUser(id: number): Promise<ActionResult> {
  try {
    // 3. Regra do Último Admin (Segurança de Negócio)
    const userToDelete = await prisma.user.findUnique({ where: { id } })

    if (userToDelete?.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } })
      if (adminCount <= 1) {
        return { success: false, error: "Não é possível excluir o último administrador." }
      }
    }

    await prisma.user.delete({ where: { id } })
    revalidatePath("/admin/configuracoes")
    
    return { success: true, message: "Usuário removido com sucesso." }

  } catch (error) {
    console.error("Erro ao excluir usuário ID " + id, error)
    return { success: false, error: "Erro ao tentar excluir o usuário." }
  }
}