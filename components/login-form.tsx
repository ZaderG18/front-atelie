"use client"

// 1. IMPORTANTE: useActionState vem de 'react' agora
// useFormStatus ainda pode vir de 'react-dom' ou 'react' dependendo da versão, 
// mas vamos manter no 'react-dom' se estiver funcionando, ou mudar para 'react' se der erro depois.
import { useActionState } from "react" 
import { useFormStatus } from "react-dom"

import { authenticate } from "@/app/_actions/auth-actions"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Flower2, AlertCircle } from "lucide-react"

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-11 bg-gold hover:bg-gold-dark text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70"
    >
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  )
}

export function LoginForm() {
  // 2. MUDANÇA AQUI: useFormState -> useActionState
  // Ele funciona exatamente igual para o nosso caso
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)

  return (
    <Card className="w-full max-w-md border-none shadow-2xl bg-white/95 backdrop-blur">
      <CardHeader className="space-y-4 text-center pb-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-rose-50 p-3">
            <Flower2 className="h-8 w-8 text-rose-400" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-light tracking-wide text-gold">
            Ateliê Aflorar
          </h1>
          <CardDescription className="text-base text-warm-gray">
            Bem-vindo de volta ao nosso mundo doce
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <form action={dispatch} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gold font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="admin@atelie.com"
              required
              className="h-11 border-rose-100 focus:border-rose-300 focus:ring-rose-300/20 bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gold font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="h-11 border-rose-100 focus:border-rose-300 focus:ring-rose-300/20 bg-white"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md animate-in fade-in-50">
                <AlertCircle className="h-4 w-4" />
                <p>{errorMessage}</p>
            </div>
           )}

          <div className="flex justify-end">
            <a href="#" className="text-sm text-rose-400 hover:text-rose-500 transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          <LoginButton />
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-warm-gray">Sistema de Gestão Interno</p>
        </div>
      </CardContent>
    </Card>
  )
}