import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// POST - Login admin ou verificar token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, token } = body

    // Se recebeu token, verifica se é válido
    if (token) {
      // Token simples - só verifica se existe e começa com "admin:"
      try {
        const decoded = Buffer.from(token, 'base64').toString()
        if (decoded.startsWith('admin:')) {
          return NextResponse.json({ success: true })
        }
      } catch {
        return NextResponse.json({ success: false }, { status: 401 })
      }
      return NextResponse.json({ success: false }, { status: 401 })
    }

    // Login com senha
    const supabase = await createClient()
    
    // Verificar senha na tabela admins
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('password_hash', password)
      .single()

    if (error || !admin) {
      return NextResponse.json({ error: 'Senha incorreta', success: false }, { status: 401 })
    }

    // Criar token simples (em producao usar JWT)
    const newToken = Buffer.from(`admin:${Date.now()}`).toString('base64')
    
    // Salvar em cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    })

    return NextResponse.json({ success: true, token: newToken })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed', success: false }, { status: 500 })
  }
}

// GET - Verificar se esta logado
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

// DELETE - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_token')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
