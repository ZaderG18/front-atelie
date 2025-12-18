import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado Esquerdo - Imagem Atmosférica */}
      <div className="relative hidden lg:block h-full">
        <Image
          src="https://images.unsplash.com/photo-1516919549054-e08258825f80?q=80&w=2670&auto=format&fit=crop"
          alt="Ateliê Aflorar Patisserie"
          fill
          className="object-cover"
          priority
        />
        {/* Gradiente para dar um charme e separar do formulário */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex items-center justify-center p-8 bg-cream h-full">
        <LoginForm />
      </div>
    </div>
  )
}