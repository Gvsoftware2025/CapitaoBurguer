-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos (lanches, porcoes, bebidas)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de acrescimos/adicionais
CREATE TABLE IF NOT EXISTS addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de ingredientes dos produtos
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL
);

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;

-- Politicas para leitura publica (cardapio)
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read addons" ON addons FOR SELECT USING (true);
CREATE POLICY "Allow public read ingredients" ON product_ingredients FOR SELECT USING (true);

-- Politicas para admin (usando service role key ou usuario autenticado)
CREATE POLICY "Allow authenticated insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update categories" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete categories" ON categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete products" ON products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert addons" ON addons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update addons" ON addons FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete addons" ON addons FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert ingredients" ON product_ingredients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update ingredients" ON product_ingredients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete ingredients" ON product_ingredients FOR DELETE TO authenticated USING (true);

-- Inserir categorias padrao
INSERT INTO categories (name, slug, order_index) VALUES
  ('Burgueres', 'burgueres', 1),
  ('Super Burgueres', 'super', 2),
  ('Porcoes', 'porcoes', 3),
  ('Bebidas', 'bebidas', 4),
  ('Combos', 'combos', 5)
ON CONFLICT (slug) DO NOTHING;

-- Inserir acrescimos padrao
INSERT INTO addons (name, price, order_index) VALUES
  ('Burguer 150g Extra', 10.00, 1),
  ('Bacon Crocante', 5.00, 2),
  ('Queijo Cheddar Extra', 4.00, 3),
  ('Queijo Prato Extra', 4.00, 4),
  ('Cebola Caramelizada', 3.00, 5),
  ('Molho Especial', 2.00, 6),
  ('Ovo Frito', 3.00, 7),
  ('Jalapeño', 3.00, 8)
ON CONFLICT DO NOTHING;
