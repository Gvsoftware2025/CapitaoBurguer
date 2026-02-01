'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/capitao-admin')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="flex min-h-screen w-full items-center justify-center p-6"
      style={{
        backgroundImage: `url('/images/pirate-wood-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-b from-[#2a1a10] to-[#1a0f08] rounded-2xl border-2 border-amber-700/50 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image src="/logo.png" alt="Capitao Burguer" fill className="object-contain" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-amber-100 text-center mb-2" style={{ fontFamily: 'serif' }}>
            Painel Administrativo
          </h1>
          <p className="text-amber-600 text-center text-sm mb-6">
            Acesso restrito ao capitao
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@capitaoburguer.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1a0f08] border-amber-800/50 text-amber-100 placeholder-amber-700 focus:border-amber-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-200">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1a0f08] border-amber-800/50 text-amber-100 placeholder-amber-700 focus:border-amber-500"
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg">
                {error}
              </p>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-bold py-3 rounded-xl border border-amber-400/30"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar no Painel'}
            </Button>
          </form>
          
          <p className="text-amber-800 text-xs text-center mt-6">
            Este painel e de uso exclusivo da administracao
          </p>
        </div>
      </div>
    </div>
  )
}
