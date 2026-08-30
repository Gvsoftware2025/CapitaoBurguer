import { notFound } from 'next/navigation'
import { queryOne } from '@/lib/db'

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default async function PrintOrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const order = await queryOne<any>(
    `SELECT o.*, COALESCE(json_agg(json_build_object(
      'productName', oi.product_name,
      'quantity', oi.quantity,
      'variationName', oi.variation_name,
      'addons', oi.addons,
      'itemTotal', oi.item_total
    ) ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
     FROM capitao_burguer.orders o
     LEFT JOIN capitao_burguer.order_items oi ON oi.order_id = o.id
     WHERE o.id = $1
     GROUP BY o.id`,
    [id]
  )

  if (!order) notFound()

  return (
    <main className="mx-auto max-w-sm bg-white p-6 font-mono text-black print:max-w-none print:p-2">
      <h1 className="text-center text-xl font-bold">CAPITÃO BURGUER</h1>
      <p className="text-center">Pedido {order.order_number}</p>
      <hr className="my-4 border-black" />
      <p>Cliente: {order.customer_name || 'Não informado'}</p>
      <p>Tipo: {order.delivery_type}</p>
      {order.customer_address && <p>Endereço: {order.customer_address}</p>}
      {order.table_number && <p>Mesa: {order.table_number}</p>}
      <hr className="my-4 border-black" />
      {(order.items || []).map((item: any, index: number) => (
        <div key={`${item.productName}-${index}`} className="mb-3">
          <p>{item.quantity}x {item.productName}</p>
          {item.variationName && <p className="pl-4">Tamanho: {item.variationName}</p>}
          {item.addons && <p className="pl-4">Adicionais: {JSON.stringify(item.addons)}</p>}
          <p className="text-right">R$ {Number(item.itemTotal || 0).toFixed(2)}</p>
        </div>
      ))}
      <hr className="my-4 border-black" />
      <p>Subtotal: R$ {Number(order.subtotal || 0).toFixed(2)}</p>
      <p>Entrega: R$ {Number(order.delivery_fee || 0).toFixed(2)}</p>
      <p className="text-lg font-bold">TOTAL: R$ {Number(order.total || 0).toFixed(2)}</p>
      <p className="mt-6 text-center text-xs">Status: {order.status}</p>
      <script dangerouslySetInnerHTML={{ __html: 'window.print()' }} />
    </main>
  )
}
