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
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_subcategories" ON subcategories;
CREATE POLICY "public_read_subcategories" ON subcategories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_variations" ON product_variations;
CREATE POLICY "public_read_variations" ON product_variations FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_addons" ON addons;
CREATE POLICY "public_read_addons" ON addons FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_product_addons" ON product_addons;
CREATE POLICY "public_read_product_addons" ON product_addons FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_maioneses" ON maioneses;
CREATE POLICY "public_read_maioneses" ON maioneses FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_combo_choices" ON combo_choices;
CREATE POLICY "public_read_combo_choices" ON combo_choices FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_combo_choice_options" ON combo_choice_options;
CREATE POLICY "public_read_combo_choice_options" ON combo_choice_options FOR SELECT USING (true);

-- Politicas de insercao publica para pedidos
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_orders" ON orders;
CREATE POLICY "public_read_orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_order_items" ON order_items;
CREATE POLICY "public_read_order_items" ON order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_insert_order_item_addons" ON order_item_addons;
CREATE POLICY "public_insert_order_item_addons" ON order_item_addons FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_order_item_addons" ON order_item_addons;
CREATE POLICY "public_read_order_item_addons" ON order_item_addons FOR SELECT USING (true);
