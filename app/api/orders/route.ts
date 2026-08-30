import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne, SCHEMA } from '@/lib/db'

interface OrderItemInput {
  productId?: string
  productName: string
  productPrice: number
  quantity: number
  variationName?: string
  variationPrice?: number
  maionese?: string
  extraMaioneses?: string[]
  addons?: { name: string; quantity: number; price: number }[]
  acompanhamentos?: string
  itemTotal: number
}

interface OrderInput {
  customerName?: string
  customerAddress?: string
  tableNumber?: number
  deliveryType: 'retirar' | 'entregar' | 'mesa'
  paymentMethod: 'cartao' | 'pix' | 'dinheiro'
  cashAmount?: number
  subtotal: number
  deliveryFee: number
  total: number
  items: OrderItemInput[]
}

// POST - Criar novo pedido
export async function POST(request: NextRequest) {
  console.log("[v0] API orders POST - inicio")
  try {
    const body: OrderInput = await request.json()
    console.log("[v0] Body recebido:", JSON.stringify(body, null, 2))

    // TODO: Verificacao de pedido existente para mesa desabilitada temporariamente
    // devido a instabilidade de conexao com o banco. Reabilitar depois.

    // Gerar numero do pedido baseado no maior numero existente do dia
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const prefix = `CB-${today}-`
    console.log("[v0] Buscando maior numero de pedido do dia com prefixo:", prefix)
    
    const maxResult = await queryOne<{ max_num: string | null }>(
      `SELECT MAX(SUBSTRING(order_number FROM '[0-9]+$')::INT) as max_num 
       FROM ${SCHEMA}.orders 
       WHERE order_number LIKE $1`,
      [`${prefix}%`]
    )
    console.log("[v0] Maior numero encontrado:", maxResult)
    const nextNumber = (parseInt(maxResult?.max_num || '0') || 0) + 1
    const orderNumber = `${prefix}${nextNumber.toString().padStart(4, '0')}`
    console.log("[v0] Numero do pedido gerado:", orderNumber)

    // Inserir pedido
    console.log("[v0] Inserindo pedido na tabela orders...")
    
    // Para pedidos de mesa, definir customer_name como "Mesa X"
    const customerName = body.deliveryType === 'mesa' && body.tableNumber 
      ? `Mesa ${body.tableNumber}` 
      : (body.customerName || null)
    console.log("[v0] customerName calculado:", customerName)
    
    // Para pedidos de mesa sem forma de pagamento, usar 'pendente' como default
    const paymentMethod = body.paymentMethod || (body.deliveryType === 'mesa' ? 'pendente' : 'pix')
    console.log("[v0] paymentMethod calculado:", paymentMethod)
    
    const orderResult = await queryOne<{ id: number }>(
      `INSERT INTO ${SCHEMA}.orders (
        order_number, customer_name, customer_address, table_number, delivery_type,
        payment_method, cash_amount, subtotal, delivery_fee, total, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pendente')
      RETURNING id`,
      [
        orderNumber,
        customerName,
        body.customerAddress || null,
        body.tableNumber || null,
        body.deliveryType,
        paymentMethod,
        body.cashAmount || null,
        body.subtotal,
        body.deliveryFee,
        body.total
      ]
    )
    console.log("[v0] Resultado do INSERT orders:", orderResult)

    if (!orderResult) {
      throw new Error('Erro ao criar pedido')
    }

    const orderId = orderResult.id
    console.log("[v0] Order ID criado:", orderId)

    if (!Array.isArray(body.items) || body.items.length === 0) {
      await query(`DELETE FROM ${SCHEMA}.orders WHERE id = $1`, [orderId])
      return NextResponse.json(
        { success: false, error: 'O pedido precisa ter pelo menos um item' },
        { status: 400 }
      )
    }

    // Inserir todos os itens; qualquer falha invalida o pedido inteiro.
    console.log("[v0] Inserindo", body.items.length, "itens...")
    try {
      for (const item of body.items) {
        if (!item.productName || !Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error(`Item inválido: ${item.productName || 'sem nome'}`)
        }

        await query(
          `INSERT INTO ${SCHEMA}.order_items (
            order_id, product_name, product_price, quantity,
            variation_name, variation_price, maionese, extra_maioneses, addons, acompanhamentos, item_total
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            orderId,
            item.productName,
            item.productPrice,
            item.quantity,
            item.variationName || null,
            item.variationPrice || null,
            item.maionese || null,
            item.extraMaioneses || null,
            item.addons ? JSON.stringify(item.addons) : null,
            item.acompanhamentos || null,
            item.itemTotal
          ]
        )
      }
    } catch (itemError) {
      console.error('[v0] Falha ao inserir itens; removendo pedido incompleto:', itemError)
      await query(`DELETE FROM ${SCHEMA}.orders WHERE id = $1`, [orderId])
      throw new Error('Não foi possível salvar todos os itens do pedido')
    }

    console.log("[v0] Pedido salvo com sucesso! orderNumber:", orderNumber)
    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      message: 'Pedido criado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar pedido' },
      { status: 500 }
    )
  }
}

// GET - Listar pedidos (para o dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let queryText = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'productPrice', oi.product_price,
            'quantity', oi.quantity,
            'variationName', oi.variation_name,
            'variationPrice', oi.variation_price,
            'maionese', oi.maionese,
            'extraMaioneses', oi.extra_maioneses,
            'addons', oi.addons,
            'acompanhamentos', oi.acompanhamentos,
            'itemTotal', oi.item_total
          )
        ) as items
      FROM ${SCHEMA}.orders o
      LEFT JOIN ${SCHEMA}.order_items oi ON o.id = oi.order_id
    `
    
    const params: unknown[] = []
    
    if (status) {
      queryText += ' WHERE o.status = $1'
      params.push(status)
    }
    
    queryText += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const orders = await query(queryText, params)

    return NextResponse.json({
      success: true,
      orders,
      pagination: { limit, offset }
    })

  } catch (error) {
    console.error('Erro ao listar pedidos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar status do pedido
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'orderId e status sao obrigatorios' },
        { status: 400 }
      )
    }

    const validStatuses = ['pendente', 'confirmado', 'em_preparo', 'pronto', 'saiu_entrega', 'entregue', 'cancelado']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status invalido' },
        { status: 400 }
      )
    }

    await query(
      `UPDATE ${SCHEMA}.orders SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, orderId]
    )

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar pedido' },
      { status: 500 }
    )
  }
}
