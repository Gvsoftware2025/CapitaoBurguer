-- Tabela de categorias do cardapio
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos do cardapio
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de acrescimos (add-ons)
CREATE TABLE IF NOT EXISTS addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
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
  name TEXT NOT NULL,
  extra_price DECIMAL(10,2) DEFAULT 2.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de admins (para controle de acesso ao painel)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE maioneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Politicas de leitura publica para o cardapio (todos podem ver)
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_variations" ON product_variations FOR SELECT USING (true);
CREATE POLICY "public_read_addons" ON addons FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_product_addons" ON product_addons FOR SELECT USING (true);
CREATE POLICY "public_read_maioneses" ON maioneses FOR SELECT USING (is_active = true);

-- Politicas de escrita para service_role (usado pelo admin via API)
CREATE POLICY "service_write_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_write_products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_write_variations" ON product_variations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_write_addons" ON addons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_write_product_addons" ON product_addons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_write_maioneses" ON maioneses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_read_admins" ON admins FOR SELECT USING (true);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_variations_product ON product_variations(product_id);

-- Inserir dados iniciais de maioneses
INSERT INTO maioneses (name) VALUES 
  ('Maionese de Bacon'),
  ('Maionese de Rucula'),
  ('Maionese de Picles')
ON CONFLICT DO NOTHING;
