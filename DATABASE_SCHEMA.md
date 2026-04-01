# Documentação do Banco de Dados - Capitão Burguer

## Visão Geral

Este documento descreve a estrutura completa do banco de dados PostgreSQL para o sistema de gestão de pedidos e cardápio do Capitão Burguer.

---

## Tabelas

### 1. **categories** (Categorias do Cardápio)
Armazena as categorias principais do cardápio.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `name` | TEXT | Nome da categoria |
| `slug` | TEXT | URL-friendly name (UNIQUE) |
| `display_order` | INT | Ordem de exibição |
| `is_active` | BOOLEAN | Ativo/Inativo |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

**Categorias disponíveis:**
- Lanches
- Bebidas
- Bolinhos
- Pastéis
- Churros
- Sobremesas

---

### 2. **subcategories** (Subcategorias)
Subcategorias dentro de cada categoria (ex: Refrigerantes, Cervejas dentro de Bebidas).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `category_id` | UUID | Referência para category (FK) |
| `name` | TEXT | Nome da subcategoria |
| `slug` | TEXT | URL-friendly name |
| `display_order` | INT | Ordem de exibição |
| `is_active` | BOOLEAN | Ativo/Inativo |
| `created_at` | TIMESTAMPTZ | Data de criação |

---

### 3. **products** (Produtos do Cardápio)
Armazena todos os produtos disponíveis no cardápio.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `category_id` | UUID | Referência para category (FK) |
| `subcategory_id` | UUID | Referência para subcategory (FK, nullable) |
| `name` | TEXT | Nome do produto |
| `description` | TEXT | Descrição do produto |
| `price` | DECIMAL(10,2) | Preço do produto |
| `image_url` | TEXT | URL da imagem |
| `ingredients` | TEXT[] | Array de ingredientes |
| `display_order` | INT | Ordem de exibição |
| `is_active` | BOOLEAN | Ativo/Inativo |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

---

### 4. **product_variations** (Variações de Produtos)
Armazena variações de um produto (ex: Batata Inteira, Meia, Individual).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `product_id` | UUID | Referência para product (FK) |
| `name` | TEXT | Nome da variação |
| `price` | DECIMAL(10,2) | Preço da variação |
| `display_order` | INT | Ordem de exibição |
| `is_active` | BOOLEAN | Ativo/Inativo |
| `created_at` | TIMESTAMPTZ | Data de criação |

---

### 5. **addons** (Acrescimos)
Armazena opções de acrescimos (add-ons) que podem ser adicionados aos produtos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `name` | TEXT | Nome do acrescimo (UNIQUE) |
| `price` | DECIMAL(10,2) | Preço do acrescimo |
| `is_active` | BOOLEAN | Ativo/Inativo |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

---

### 6. **product_addons** (Relacionamento Produtos-Acrescimos)
Tabela de ligação entre produtos e acrescimos disponíveis.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `product_id` | UUID | Referência para product (FK, PK) |
| `addon_id` | UUID | Referência para addon (FK, PK) |

---

### 7. **maioneses** (Tipos de Maionese)
Armazena os diferentes tipos de maionese disponíveis.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `name` | TEXT | Nome da maionese (UNIQUE) |
| `extra_price` | DECIMAL(10,2) | Preço adicional |
| `is_active` | BOOLEAN | Ativo/Inativo |
| `created_at` | TIMESTAMPTZ | Data de criação |

**Maioneses disponíveis:**
- Maionese
- Maionese Alho
- Maionese Temperada
- Maionese Picante
- Maionese Tártara
- Maionese da Casa

---

### 8. **combo_choices** (Opções de Combo)
Armazena as escolhas disponíveis em um combo (ex: Escolha sua bebida, Escolha seu acompanhamento).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `product_id` | UUID | Referência para product (FK) |
| `label` | TEXT | Rótulo da escolha |
| `display_order` | INT | Ordem de exibição |
| `created_at` | TIMESTAMPTZ | Data de criação |

---

### 9. **combo_choice_options** (Opções de Combo)
Armazena as opções disponíveis para cada escolha de combo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `combo_choice_id` | UUID | Referência para combo_choice (FK) |
| `name` | TEXT | Nome da opção |
| `display_order` | INT | Ordem de exibição |
| `created_at` | TIMESTAMPTZ | Data de criação |

---

### 10. **orders** (Pedidos)
Armazena todos os pedidos do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `order_number` | SERIAL | Número do pedido (sequencial) |
| `customer_name` | TEXT | Nome do cliente |
| `customer_phone` | TEXT | Telefone do cliente |
| `customer_address` | TEXT | Endereço de entrega |
| `customer_neighborhood` | TEXT | Bairro |
| `customer_complement` | TEXT | Complemento do endereço |
| `customer_reference` | TEXT | Referência do endereço |
| `delivery_type` | TEXT | Tipo (delivery/pickup) |
| `payment_method` | TEXT | Método de pagamento |
| `payment_change_for` | DECIMAL(10,2) | Valor para troco |
| `items` | JSONB | Itens do pedido (JSON) |
| `subtotal` | DECIMAL(10,2) | Subtotal |
| `delivery_fee` | DECIMAL(10,2) | Taxa de entrega |
| `total` | DECIMAL(10,2) | Total do pedido |
| `notes` | TEXT | Observações |
| `status` | TEXT | Status (pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled) |
| `estimated_time` | INT | Tempo estimado em minutos |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |
| `confirmed_at` | TIMESTAMPTZ | Quando foi confirmado |
| `ready_at` | TIMESTAMPTZ | Quando ficou pronto |
| `delivered_at` | TIMESTAMPTZ | Quando foi entregue |

---

### 11. **order_items** (Itens do Pedido)
Armazena detalhes de cada item em um pedido.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `order_id` | UUID | Referência para order (FK) |
| `product_id` | UUID | Referência para product (FK, nullable) |
| `product_name` | TEXT | Nome do produto (snapshot) |
| `variation_name` | TEXT | Nome da variação escolhida |
| `quantity` | INT | Quantidade |
| `unit_price` | DECIMAL(10,2) | Preço unitário |
| `addons` | JSONB | Acrescimos escolhidos (JSON) |
| `maionese` | TEXT | Tipo de maionese escolhido |
| `notes` | TEXT | Observações do item |
| `total` | DECIMAL(10,2) | Total do item |
| `created_at` | TIMESTAMPTZ | Data de criação |

---

### 12. **admins** (Usuários Administradores)
Armazena credenciais de acesso ao sistema administrativo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `username` | TEXT | Usuário (UNIQUE) |
| `password_hash` | TEXT | Hash da senha (bcrypt) |
| `is_active` | BOOLEAN | Ativo/Inativo |
| `last_login` | TIMESTAMPTZ | Último login |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

**Admin Padrão:**
- Username: `admin`
- Senha: `admin123`

---

### 13. **store_settings** (Configurações da Loja)
Armazena configurações gerais do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (PK) |
| `key` | TEXT | Chave da configuração (UNIQUE) |
| `value` | TEXT | Valor da configuração |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

---

## Funções SQL Disponíveis

### 1. **update_order_status()**
Atualiza o status de um pedido com timestamps automáticos.

```sql
SELECT update_order_status(order_id, 'confirmed');
```

**Statuses disponíveis:**
- `pending` - Pendente
- `confirmed` - Confirmado
- `preparing` - Em preparação
- `ready` - Pronto
- `out_for_delivery` - Em entrega
- `delivered` - Entregue
- `cancelled` - Cancelado

---

### 2. **get_orders_by_period()**
Obtém pedidos de um período específico.

```sql
SELECT * FROM get_orders_by_period('2024-01-01'::TIMESTAMP, '2024-01-31'::TIMESTAMP, 'delivered');
```

---

### 3. **get_sales_summary()**
Obtém resumo de vendas (total de pedidos, receita, ticket médio, etc).

```sql
SELECT * FROM get_sales_summary('2024-01-01'::TIMESTAMP, '2024-01-31'::TIMESTAMP);
```

---

### 4. **get_top_products()**
Obtém os produtos mais vendidos em um período.

```sql
SELECT * FROM get_top_products('2024-01-01'::TIMESTAMP, '2024-01-31'::TIMESTAMP, 10);
```

---

### 5. **update_product_price()**
Atualiza o preço de um produto.

```sql
SELECT update_product_price(product_id, 25.00);
```

---

### 6. **deactivate_product()**
Desativa um produto (soft delete).

```sql
SELECT deactivate_product(product_id);
```

---

## Índices

Os seguintes índices foram criados para otimizar as queries:

- `idx_products_category` - Produtos por categoria
- `idx_products_subcategory` - Produtos por subcategoria
- `idx_products_active` - Produtos ativos
- `idx_variations_product` - Variações por produto
- `idx_subcategories_category` - Subcategorias por categoria
- `idx_orders_status` - Pedidos por status
- `idx_orders_created` - Pedidos por data (DESC)
- `idx_orders_phone` - Pedidos por telefone
- `idx_order_items_order` - Itens por pedido
- `idx_order_items_product` - Itens por produto

---

## Como Usar

### Listar todos os produtos ativos
```sql
SELECT p.id, p.name, p.price, c.name as category 
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY c.display_order, p.display_order;
```

### Buscar categorias com seus produtos
```sql
SELECT c.id, c.name, p.id as product_id, p.name as product_name, p.price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
WHERE c.is_active = true
ORDER BY c.display_order, p.display_order;
```

### Criar um novo pedido
```sql
INSERT INTO orders (
  customer_name, 
  customer_phone, 
  customer_address,
  customer_neighborhood,
  delivery_type,
  payment_method,
  items,
  subtotal,
  delivery_fee,
  total,
  status
) VALUES (
  'João Silva',
  '11999999999',
  'Rua das Flores, 123',
  'Centro',
  'delivery',
  'dinheiro',
  '[]'::jsonb,
  50.00,
  5.00,
  55.00,
  'pending'
);
```

### Obter pedidos pendentes
```sql
SELECT * FROM orders 
WHERE status = 'pending' 
ORDER BY created_at ASC;
```

### Obter dados de um pedido com seus itens
```sql
SELECT 
  o.id,
  o.order_number,
  o.customer_name,
  o.customer_phone,
  o.total,
  o.status,
  o.created_at,
  json_agg(
    json_build_object(
      'product_name', oi.product_name,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price,
      'total', oi.total
    )
  ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.id = 'seu-pedido-id'
GROUP BY o.id, o.order_number, o.customer_name, o.customer_phone, o.total, o.status, o.created_at;
```

---

## Dados Iniciais

O banco foi popula com:
- **6 categorias** (Lanches, Bebidas, Bolinhos, Pastéis, Churros, Sobremesas)
- **70+ produtos** com preços e descrições
- **6 tipos de maionese**
- **1 usuário admin** (username: admin, senha: admin123)

---

## Próximos Passos

Para o seu sistema de gestão, você pode:

1. **Criar APIs** para CRUD de produtos e pedidos
2. **Implementar autenticação** para os admins
3. **Criar dashboards** com gráficos usando as funções de resumo
4. **Integrar com WhatsApp** para sincronizar pedidos
5. **Criar notificações** para novos pedidos em tempo real
6. **Implementar filtros** por status, data e cliente

Pronto para qualquer ajuste ou adição ao banco de dados! 🚀
