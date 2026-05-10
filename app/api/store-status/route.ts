import { NextResponse } from 'next/server'
import { query, queryOne, SCHEMA } from '@/lib/db'

// GET - Buscar status da loja
export async function GET() {
  try {
    const result = await queryOne<{ value: string }>(
      `SELECT value FROM ${SCHEMA}.store_config WHERE key = 'is_open'`
    )
    
    const isOpen = result?.value === 'true'
    
    return NextResponse.json({ isOpen })
  } catch (error) {
    console.error('Erro ao buscar status da loja:', error)
    // Fallback: retorna fechado em caso de erro
    return NextResponse.json({ isOpen: false })
  }
}

// PATCH - Alterar status da loja
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { isOpen } = body
    
    if (typeof isOpen !== 'boolean') {
      return NextResponse.json(
        { error: 'Campo isOpen deve ser boolean' },
        { status: 400 }
      )
    }
    
    await query(
      `UPDATE ${SCHEMA}.store_config SET value = $1, updated_at = NOW() WHERE key = 'is_open'`,
      [isOpen ? 'true' : 'false']
    )
    
    return NextResponse.json({ 
      success: true, 
      isOpen,
      message: isOpen ? 'Loja aberta!' : 'Loja fechada!'
    })
  } catch (error) {
    console.error('Erro ao atualizar status da loja:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar status' },
      { status: 500 }
    )
  }
}
