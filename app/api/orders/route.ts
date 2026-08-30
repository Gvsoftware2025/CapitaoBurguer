import { NextRequest, NextResponse } from 'next/server'
import { query, SCHEMA, withTransaction } from '@/lib/db'

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
  try {
    const body: OrderInput = await request.json()

    // Validacao basica antes de tocar no banco
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'O pedido precisa ter pelo menos um item' },
        { status: 400 }
      )
    }
    for (const item of body.items) {
      if (!item.productName || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: `Item invalido: ${item.productName || 'sem nome'}` },
          { status: 400 }
        )
      }
    }

    // Para pedidos de mesa, definir customer_name como "Mesa X"
    const customerName = body.deliveryType === 'mesa' && body.tableNumber
      ? `Mesa ${body.tableNumber}`
      : (body.customerName || null)

    // Para pedidos de mesa sem forma de pagamento, usar 'pendente' como default
    const paymentMethod = body.paymentMethod || (body.deliveryType === 'mesa' ? 'pendente' : 'pix')

    // Tudo em UMA unica conexao/transacao: gera numero, insere o pedido e
    // insere todos os itens de uma vez. Muito mais rapido e confiavel do que
    // abrir varias conexoes para o banco externo.
    const { orderId, orderNumber } = await withTransaction(async (client) => {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const prefix = `CB-${today}-`

      const maxResult = await client.query<{ max_num: string | null }>(
        `SELECT MAX(SUBSTRING(order_number FROM '[0-9]+$')::INT) as max_num
         FROM ${SCHEMA}.orders
         WHERE order_number LIKE $1`,
        [`${prefix}%`]
      )
      const nextNumber = (parseInt(maxResult.rows[0]?.max_num || '0') || 0) + 1
      const generatedNumber = `${prefix}${nextNumber.toString().padStart(4, '0')}`

      const orderResult = await client.query<{ id: number }>(
        `INSERT INTO ${SCHEMA}.orders (
          order_number, customer_name, customer_address, table_number, delivery_type,
          payment_method, cash_amount, subtotal, delivery_fee, total, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'preparando')
        RETURNING id`,
        [
          generatedNumber,
          customerName,
          body.customerAddress || null,
          body.tableNumber || null,
          body.deliveryType,
          paymentMethod,
          body.cashAmount || null,
          body.subtotal,
          body.deliveryFee,
          body.total,
        ]
      )

      const newOrderId = orderResult.rows[0]?.id
      if (!newOrderId) {
        throw new Error('Erro ao criar pedido')
      }

      // Insere todos os itens numa unica query (multi-row insert)
      const columns = 11
      const values: unknown[] = []
      const placeholders = body.items.map((item, i) => {
        const base = i * columns
        values.push(
          newOrderId,
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
        )
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11})`
      })

      await client.query(
        `INSERT INTO ${SCHEMA}.order_items (
          order_id, product_name, product_price, quantity,
          variation_name, variation_price, maionese, extra_maioneses, addons, acompanhamentos, item_total
        ) VALUES ${placeholders.join(', ')}`,
        values
      )

      return { orderId: newOrderId, orderNumber: generatedNumber }
    })

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      message: 'Pedido criado com sucesso',
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
