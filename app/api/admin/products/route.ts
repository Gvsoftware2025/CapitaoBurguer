import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

// GET - Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')

    let query = supabase
      .from('products')
      .select(`
        *,
        categories (id, name, slug),
        product_variations (*)
      `)
      .order('name', { ascending: true })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json({ products: data || [] })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products', products: [] }, { status: 500 })
  }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('products')
      .insert([{
        category_id: body.category_id,
        name: body.name,
        description: body.description,
        price: body.price,
        image_url: body.image_url,
        ingredients: body.ingredients || [],
        subcategory: body.subcategory,
        active: body.active !== false
      }])
      .select()
      .single()

    if (error) throw error

    // Se tiver variacoes, inserir tambem
    if (body.variations && body.variations.length > 0) {
      const variations = body.variations.map((v: { name: string; price: number }) => ({
        product_id: data.id,
        name: v.name,
        price: v.price
      }))
      
      await supabase.from('product_variations').insert(variations)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// PUT - Atualizar produto
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('products')
      .update({
        category_id: body.category_id,
        name: body.name,
        description: body.description,
        price: body.price,
        image_url: body.image_url,
        ingredients: body.ingredients || [],
        subcategory: body.subcategory,
        active: body.active
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    // Atualizar variacoes (deletar antigas e inserir novas)
    if (body.variations !== undefined) {
      await supabase.from('product_variations').delete().eq('product_id', body.id)
      
      if (body.variations && body.variations.length > 0) {
        const variations = body.variations.map((v: { name: string; price: number }) => ({
          product_id: body.id,
          name: v.name,
          price: v.price
        }))
        
        await supabase.from('product_variations').insert(variations)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE - Excluir produto
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
