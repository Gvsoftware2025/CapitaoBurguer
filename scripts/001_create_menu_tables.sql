-- =============================================
-- CAPITAO BURGUER - BANCO DE DADOS COMPLETO
-- =============================================

-- Tabela de categorias do cardapio
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de subcategorias (para bebidas, pasteis, etc)
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Tabela de produtos do cardapio
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  ingredients TEXT[],
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de variacoes (ex: Batata Inteira, Meia, Individual)
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de acrescimos (add-ons)
CREATE TABLE IF NOT EXISTS addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de relacionamento produtos x acrescimos
CREATE TABLE IF NOT EXISTS product_addons (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  addon_id UUID NOT NULL REFERENCES addons(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, addon_id)
);

-- Tabela de maioneses
CREATE TABLE IF NOT EXISTS maioneses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  extra_price DECIMAL(10,2) DEFAULT 2.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de opcoes de combo (escolhas dentro de combos)
CREATE TABLE IF NOT EXISTS combo_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de opcoes disponiveis para cada escolha de combo
CREATE TABLE IF NOT EXISTS combo_choice_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_choice_id UUID NOT NULL REFERENCES combo_choices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELAS PARA SISTEMA DE GESTAO DE PEDIDOS
-- =============================================

-- Status possiveis dos pedidos
CREATE TYPE order_status AS ENUM (
  'pending',      -- Aguardando confirmacao
  'confirmed',    -- Confirmado
  'preparing',    -- Em preparacao
  'ready',        -- Pronto para entrega/retirada
  'delivering',   -- Saiu para entrega
  'delivered',    -- Entregue
  'cancelled'     -- Cancelado
);

-- Tipo de entrega
CREATE TYPE delivery_type AS ENUM (
  'delivery',     -- Entrega
  'pickup'        -- Retirada no local
);

-- Tipo de pagamento
CREATE TYPE payment_type AS ENUM (
  'pix',
  'credit_card',
  'debit_card',
  'cash'
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_neighborhood TEXT,
  customer_reference TEXT,
  delivery_type delivery_type NOT NULL DEFAULT 'delivery',
  payment_type payment_type NOT NULL,
  change_for DECIMAL(10,2),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variation_name TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  maionese TEXT,
  extra_maioneses TEXT[],
  combo_choices JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Acrescimos dos itens do pedido
CREATE TABLE IF NOT EXISTS order_item_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  addon_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Tabela de admins (para controle de acesso ao painel)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de configuracoes da loja
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE maioneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_choice_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Politicas de leitura publica para o cardapio
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_subcategories" ON subcategories FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_variations" ON product_variations FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_addons" ON addons FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_product_addons" ON product_addons FOR SELECT USING (true);
CREATE POLICY "public_read_maioneses" ON maioneses FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_combo_choices" ON combo_choices FOR SELECT USING (true);
CREATE POLICY "public_read_combo_choice_options" ON combo_choice_options FOR SELECT USING (true);

-- Politicas de insercao publica para pedidos (clientes podem criar pedidos)
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_order_item_addons" ON order_item_addons FOR INSERT WITH CHECK (true);

-- Politicas de escrita para service_role (admin)
CREATE POLICY "service_all_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_subcategories" ON subcategories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_variations" ON product_variations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_addons" ON addons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_product_addons" ON product_addons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_maioneses" ON maioneses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_combo_choices" ON combo_choices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_combo_choice_options" ON combo_choice_options FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_order_item_addons" ON order_item_addons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_admins" ON admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_store_settings" ON store_settings FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- INDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_variations_product ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);

-- =============================================
-- FUNCOES UTEIS
-- =============================================

-- Funcao para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addons_updated_at ON addons;
CREATE TRIGGER update_addons_updated_at
  BEFORE UPDATE ON addons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
