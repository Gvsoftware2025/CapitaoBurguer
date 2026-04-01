# Exemplos de API - Sistema de Gestão Capitão Burguer

Este documento mostra exemplos de como usar a API com a estrutura do banco de dados criada.

## Autenticação

```javascript
// Login do admin
const login = async (username, password) => {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};
```

---

## Gerenciamento de Produtos

### Listar todos os produtos por categoria

```javascript
const getProductsByCategory = async (categorySlug) => {
  const response = await fetch(`/api/products/category/${categorySlug}`);
  return response.json();
};

// Uso
const burgers = await getProductsByCategory('lanches');
```

### Obter produto com variações e acrescimos

```javascript
const getProductDetails = async (productId) => {
  const response = await fetch(`/api/products/${productId}`);
  return response.json();
};
```

**Resposta esperada:**
```json
{
  "id": "uuid",
  "name": "X-Salada",
  "price": 18.00,
  "description": "Pão, queijo, alface e tomate",
  "variations": [
    { "id": "uuid", "name": "Inteira", "price": 18.00 },
    { "id": "uuid", "name": "Meia", "price": 12.00 }
  ],
  "availableAddons": [
    { "id": "uuid", "name": "Batata Frita", "price": 5.00 },
    { "id": "uuid", "name": "Refrigerante 1L", "price": 8.00 }
  ],
  "availableMaioneses": [
    { "id": "uuid", "name": "Maionese", "price": 2.00 },
    { "id": "uuid", "name": "Maionese Alho", "price": 2.50 }
  ]
}
```

### Atualizar preço do produto

```javascript
const updateProductPrice = async (productId, newPrice) => {
  const response = await fetch(`/api/products/${productId}/price`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: newPrice })
  });
  return response.json();
};

// Uso
await updateProductPrice('product-id', 25.00);
```

### Criar novo produto

```javascript
const createProduct = async (productData) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return response.json();
};

// Uso
await createProduct({
  categoryId: 'lanches-id',
  name: 'X-Especial',
  description: 'Um hambúrguer especial',
  price: 35.00
});
```

### Deletar/Desativar produto

```javascript
const deleteProduct = async (productId) => {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE'
  });
  return response.json();
};
```

---

## Gerenciamento de Pedidos

### Criar novo pedido

```javascript
const createOrder = async (orderData) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return response.json();
};

// Uso
await createOrder({
  customerName: 'João Silva',
  customerPhone: '11999999999',
  customerAddress: 'Rua das Flores, 123',
  customerNeighborhood: 'Centro',
  deliveryType: 'delivery',
  paymentMethod: 'dinheiro',
  paymentChangeFor: 100.00,
  items: [
    {
      productId: 'uuid',
      productName: 'X-Salada',
      variationName: 'Inteira',
      quantity: 2,
      unitPrice: 18.00,
      addons: [
        { name: 'Batata Frita', price: 5.00 }
      ],
      maionese: 'Maionese Alho',
      notes: 'Sem tomate no primeiro',
      total: 46.00
    }
  ],
  subtotal: 41.00,
  deliveryFee: 5.00,
  total: 46.00,
  notes: 'Buzinar quando chegar',
  estimatedTime: 30
});
```

**Resposta esperada:**
```json
{
  "id": "uuid",
  "orderNumber": 1001,
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Listar pedidos com filtros

```javascript
const getOrders = async (filters) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/orders?${queryParams}`);
  return response.json();
};

// Uso - Pedidos pendentes
await getOrders({ status: 'pending' });

// Uso - Pedidos de hoje
await getOrders({ 
  startDate: '2024-01-15T00:00:00Z',
  endDate: '2024-01-15T23:59:59Z'
});

// Uso - Pedidos de um cliente
await getOrders({ phone: '11999999999' });
```

### Obter detalhes de um pedido

```javascript
const getOrderDetails = async (orderId) => {
  const response = await fetch(`/api/orders/${orderId}`);
  return response.json();
};
```

**Resposta esperada:**
```json
{
  "id": "uuid",
  "orderNumber": 1001,
  "customerName": "João Silva",
  "customerPhone": "11999999999",
  "customerAddress": "Rua das Flores, 123",
  "customerNeighborhood": "Centro",
  "deliveryType": "delivery",
  "paymentMethod": "dinheiro",
  "paymentChangeFor": 100.00,
  "items": [
    {
      "id": "uuid",
      "productName": "X-Salada",
      "quantity": 2,
      "unitPrice": 18.00,
      "total": 36.00
    }
  ],
  "subtotal": 41.00,
  "deliveryFee": 5.00,
  "total": 46.00,
  "status": "pending",
  "estimatedTime": 30,
  "notes": "Buzinar quando chegar",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Atualizar status do pedido

```javascript
const updateOrderStatus = async (orderId, newStatus) => {
  const response = await fetch(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  return response.json();
};

// Uso
await updateOrderStatus('order-id', 'confirmed');
await updateOrderStatus('order-id', 'preparing');
await updateOrderStatus('order-id', 'ready');
await updateOrderStatus('order-id', 'out_for_delivery');
await updateOrderStatus('order-id', 'delivered');
```

### Cancelar pedido

```javascript
const cancelOrder = async (orderId, reason) => {
  const response = await fetch(`/api/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  return response.json();
};
```

---

## Relatórios e Análises

### Resumo de vendas

```javascript
const getSalesSummary = async (startDate, endDate) => {
  const response = await fetch('/api/reports/sales-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate })
  });
  return response.json();
};

// Uso
const summary = await getSalesSummary(
  '2024-01-01T00:00:00Z',
  '2024-01-31T23:59:59Z'
);
```

**Resposta esperada:**
```json
{
  "totalOrders": 150,
  "totalRevenue": 7500.00,
  "averageOrderValue": 50.00,
  "deliveryOrders": 120,
  "pickupOrders": 30,
  "byPaymentMethod": {
    "dinheiro": 5000.00,
    "cartao": 2500.00
  }
}
```

### Produtos mais vendidos

```javascript
const getTopProducts = async (startDate, endDate, limit = 10) => {
  const response = await fetch('/api/reports/top-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, limit })
  });
  return response.json();
};

// Uso
const topProducts = await getTopProducts(
  '2024-01-01T00:00:00Z',
  '2024-01-31T23:59:59Z',
  10
);
```

**Resposta esperada:**
```json
[
  {
    "productId": "uuid",
    "productName": "X-Salada",
    "quantitySold": 85,
    "revenue": 1530.00
  },
  {
    "productId": "uuid",
    "productName": "X-Bacon",
    "quantitySold": 72,
    "revenue": 1584.00
  }
]
```

### Pedidos por período

```javascript
const getOrdersByPeriod = async (startDate, endDate, status = null) => {
  const response = await fetch('/api/reports/orders-by-period', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, status })
  });
  return response.json();
};

// Uso
const deliveredOrders = await getOrdersByPeriod(
  '2024-01-01T00:00:00Z',
  '2024-01-31T23:59:59Z',
  'delivered'
);
```

---

## Webhooks (Para integração com WhatsApp)

### Receber notificação de novo pedido do WhatsApp

```javascript
// POST /api/webhooks/whatsapp/new-order
// Body:
{
  "messageId": "unique-id",
  "phone": "5511999999999",
  "message": "Quero 2 X-Salada e 1 Refrigerante",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Enviar notificação de status para WhatsApp

```javascript
const sendOrderStatusUpdate = async (orderId, phone) => {
  const response = await fetch('/api/webhooks/whatsapp/send-update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, phone })
  });
  return response.json();
};
```

---

## Erros Comuns

### Produto não encontrado
```json
{
  "error": "Product not found",
  "code": "PRODUCT_NOT_FOUND",
  "statusCode": 404
}
```

### Pedido não encontrado
```json
{
  "error": "Order not found",
  "code": "ORDER_NOT_FOUND",
  "statusCode": 404
}
```

### Autenticação falhou
```json
{
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS",
  "statusCode": 401
}
```

### Validação falhou
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": [
    {
      "field": "customerPhone",
      "message": "Phone number is required"
    }
  ]
}
```

---

## Exemplo Completo de Uso

```javascript
// 1. Login
const admin = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
}).then(r => r.json());

// 2. Obter pedidos pendentes
const pendingOrders = await fetch('/api/orders?status=pending')
  .then(r => r.json());

// 3. Atualizar status de um pedido
await fetch(`/api/orders/${pendingOrders[0].id}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'confirmed' })
});

// 4. Obter resumo de vendas
const summary = await fetch('/api/reports/sales-summary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z'
  })
}).then(r => r.json());

console.log(`Total de vendas: R$ ${summary.totalRevenue.toFixed(2)}`);
```

---

Pronto para implementar! Esses exemplos cobrem as funcionalidades principais do sistema. 🚀
