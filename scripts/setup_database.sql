-- =====================================================
-- CAPITAO BURGUER - SETUP COMPLETO DO BANCO DE DADOS
-- VPS: 168.231.93.220 | Database: gvsoftware
-- =====================================================

-- Dropar tabelas existentes para recriar (ordem correta por dependencias)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_addons CASCADE;
DROP TABLE IF EXISTS product_variations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS addons CASCADE;
DROP TABLE IF EXISTS maioneses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de categorias do cardapio
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos do cardapio
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  ingredients TEXT[],
  subcategory VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de variacoes (ex: Batata Inteira, Meia, Individual)
CREATE TABLE product_variations (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de acrescimos (add-ons)
CREATE TABLE addons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de relacionamento produtos x acrescimos
CREATE TABLE product_addons (
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  addon_id INT NOT NULL REFERENCES addons(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, addon_id)
);

-- Tabela de maioneses
CREATE TABLE maioneses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  extra_price DECIMAL(10,2) DEFAULT 2.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABELAS DE PEDIDOS
-- =====================================================

-- Tabela de pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(20) NOT NULL UNIQUE,
  customer_name VARCHAR(200),
  customer_address TEXT,
  delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('retirar', 'entregar')),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cartao', 'pix', 'dinheiro')),
  cash_amount DECIMAL(10,2),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'em_preparo', 'pronto', 'saiu_entrega', 'entregue', 'cancelado')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  variation_name VARCHAR(100),
  variation_price DECIMAL(10,2),
  maionese VARCHAR(100),
  extra_maioneses TEXT[],
  addons JSONB,
  acompanhamentos VARCHAR(500),
  item_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_variations_product ON product_variations(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =====================================================
-- FUNCAO PARA GERAR NUMERO DO PEDIDO
-- =====================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(20) AS $$
DECLARE
  today_date VARCHAR(8);
  seq_num INT;
  order_num VARCHAR(20);
BEGIN
  today_date := TO_CHAR(NOW(), 'YYYYMMDD');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INT)), 0) + 1
  INTO seq_num
  FROM orders
  WHERE order_number LIKE today_date || '-%';
  
  order_num := today_date || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS INICIAIS - MAIONESES
-- =====================================================

INSERT INTO maioneses (name) VALUES 
  ('Maionese de Bacon'),
  ('Maionese de Rucula'),
  ('Maionese de Picles');

-- =====================================================
-- DADOS INICIAIS - ACRESCIMOS (ADD-ONS)
-- =====================================================

INSERT INTO addons (name, price) VALUES 
  ('Queijo Empanado', 12.00),
  ('Hamburguer Extra', 9.00),
  ('Bacon', 6.00),
  ('Queijo', 6.00),
  ('Catupiry', 6.00),
  ('Cheddar', 6.00),
  ('Ovo', 3.00),
  ('Salada', 3.00),
  ('Onions', 2.00);

-- =====================================================
-- DADOS INICIAIS - CATEGORIAS
-- =====================================================

INSERT INTO categories (name, slug, display_order) VALUES 
  ('Burgueres', 'burgueres', 1),
  ('Super Burgueres', 'super_burgueres', 2),
  ('Porcoes', 'porcoes', 3),
  ('Bebidas', 'bebidas', 4),
  ('Combos e Barcas', 'combos', 5),
  ('Espetos', 'espetos', 6),
  ('Jantinha', 'jantinha', 7),
  ('Churros', 'churros', 8);

-- =====================================================
-- DADOS INICIAIS - PRODUTOS (BURGUERES)
-- =====================================================

INSERT INTO products (category_id, name, description, price, image_url, ingredients) VALUES 
  (1, 'Capitao Classico', 'O tradicional que conquistou os mares', 25.00, '/images/capitao-classico.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Tomate']),
  (1, 'Capitao Bacon', 'Para os amantes de bacon', 28.00, '/images/capitao-bacon.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Bacon', 'Cebola Caramelizada']),
  (1, 'Capitao Cheddar', 'Explosao de cheddar cremoso', 28.00, '/images/capitao-cheddar.jpg', ARRAY['Hamburguer 150g', 'Cheddar Cremoso', 'Bacon Crocante']),
  (1, 'Capitao Salada', 'Fresquinho e saboroso', 28.00, '/images/capitao-salada.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Picles', 'Tomate', 'Cebola Roxa']),
  (1, 'Capitao Onion', 'Com onions crocantes', 30.00, '/images/capitao-onion.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Bacon Crocante', 'Molho Barbecue', 'Onions']),
  (1, 'Capitao Gorgonzola', 'Sabor sofisticado', 30.00, '/images/capitao-gorgonzola.jpg', ARRAY['Hamburguer 150g', 'Queijo Gorgonzola', 'Mel', 'Rucula']),
  (1, 'Capitao Harry', 'Magico e delicioso', 30.00, '/images/capitao-harry.jpg', ARRAY['Hamburguer 150g', 'Queijo Mussarela', 'Catupiry', 'Alho Frito', 'Bacon Crocante']),
  (1, 'Capitao Cheese', 'Queijo por todos os lados', 30.00, '/images/capitao-cheese.jpg', ARRAY['Hamburguer 150g', 'Cream Cheese', 'Cebola Crispy']),
  (1, 'Capitao Pig', 'Suino especial', 30.00, '/images/capitao-pig.jpg', ARRAY['Hamburguer de Pernil Suino', 'Queijo Mussarela', 'Bacon Crocante', 'Molho Barbecue', 'Alface Fresca']),
  (1, 'Capitao Vegetariano', 'Sem carne, muito sabor', 30.00, '/images/capitao-vegetariano.jpg', ARRAY['Queijo Empanado', 'Cream Cheese', 'Tomates Secos', 'Rucula Fresca']),
  (1, 'Capitao Kids', 'Para os pequenos piratas', 28.00, '/images/capitao-kids.jpg', ARRAY['Hamburguer 100g', 'Queijo Prato', 'Cheddar', 'Bacon Crocante', 'Batata Frita']),
  (1, 'Capitao Rucula', 'Fresquinho com rucula', 28.00, '/images/capitao-rucula.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Bacon Crocante', 'Cebola Caramelizada', 'Rucula Fresca']),
  (1, 'Capitao Nacho', 'Com doritos crocante', 28.00, '/images/capitao_nacho.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Cheddar Cremoso', 'Doritos']);

-- =====================================================
-- DADOS INICIAIS - PRODUTOS (SUPER BURGUERES)
-- =====================================================

INSERT INTO products (category_id, name, description, price, image_url, ingredients) VALUES 
  (2, 'Capitao Chicken', 'Frango empanado especial', 38.00, '/images/capitao_chicken.jpg', ARRAY['Hamburguer de Frango', 'Queijo Prato', 'Catupiry', 'Bacon Crocante']),
  (2, 'Capitao Hulk', 'Para os famintos de verdade', 38.00, '/images/capitao_hulk.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Hamburguer de Pernil', 'Bacon Crocante', 'Requeijao Cremoso', 'Alface Fresca', 'Tomate', 'Cebola']),
  (2, 'Capitao Nordestino', 'Sabor do sertao', 38.00, '/images/capitao-nordestino.jpg', ARRAY['Hamburguer 150g', 'Queijo Mussarela', 'Catupiry', 'Carne Seca']),
  (2, 'Capitao Empoderado', 'Costela suculenta', 38.00, '/images/capitao-empoderado.jpg', ARRAY['Hamburguer de Costela 180g', 'Barbecue na Base', 'Muito Queijo', 'Muito Bacon', 'Onions']),
  (2, 'Capitao Duca', 'Completo e irresistivel', 38.00, '/images/capitao-duca.jpg', ARRAY['Hamburguer 150g', 'Queijo Empanado', 'Ovo', 'Alface', 'Tomate', 'Cebola Roxa']),
  (2, 'Capitao da Casa', 'O monstro da casa', 38.00, '/images/capitao-casa.jpg', ARRAY['Hamburguer 300g', 'Queijo Mussarela', 'Bacon', 'Ovo', 'Catupiry', 'Rucula Fresca']),
  (2, 'Capitao Eclipse', 'Triplo poder', 38.00, '/images/capitao-eclipse.jpg', ARRAY['3x Hamburguer 100g', 'Maionese da Casa', 'Muito Queijo', 'Bacon Crocante', 'Cebola Caramelizada', 'Alface Fresca']),
  (2, 'Capitao America', 'O lendario recheado', 38.00, '/images/capitao-america.jpg', ARRAY['Hamburguer 200g Recheado com Mussarela', 'Queijo Mussarela', 'Maionese da Casa', 'Bacon Crocante', 'Alface Fresca', 'Tomate', 'Cebola Roxa']),
  (2, 'Capitao Costela', 'Com costela desfiada', 38.00, '/images/capitao-costela.jpg', ARRAY['Hamburguer 150g', 'Queijo Mussarela', 'Catupiry', 'Alho Frito', 'Costela Desfiada', 'Rucula']),
  (2, 'Capitao Bauru', 'Contra-file especial', 38.00, '/images/capitao-bauru.jpg', ARRAY['Hamburguer 200g de Contra-File', 'Queijo Mussarela', 'Catupiry', 'Tomate', 'Rucula Fresca']),
  (2, 'Capitao Supremo', 'O premium de fraldinha', 49.00, '/images/capitao-supremo.jpg', ARRAY['Hamburguer 180g de Fraldinha', 'Queijo Mussarela', 'Catupiry', 'Mostarda', 'Tomate', 'Alface']);

-- =====================================================
-- DADOS INICIAIS - PRODUTOS (PORCOES)
-- =====================================================

INSERT INTO products (category_id, name, description, price, image_url, ingredients) VALUES 
  (3, 'Batata Frita', 'Batatas fritas crocantes com tempero especial', 8.00, '/images/porcao-batata.jpg', ARRAY['Batata Frita', 'Tempero Especial']),
  (3, 'Kibe', 'Kibes bem temperados', 40.00, '/images/porcao-kibe.jpg', ARRAY['Kibe', 'Tempero Especial']),
  (3, 'Anel de Cebola', 'Aneis de cebola empanados e crocantes', 30.00, '/images/porcao-onion.jpg', ARRAY['Cebola Empanada']),
  (3, 'Tilapia', 'Porcao de tilapia empanada', 50.00, '/images/porcao-tilapia.jpg', ARRAY['Tilapia Empanada']),
  (3, 'Pastelzinho', 'Pastelzinhos fritos variados', 42.00, '/images/porcao-pastelzinho.jpg', ARRAY['Pastelzinho Frito']),
  (3, 'Dadinho de Tapioca', 'Dadinhos de tapioca com queijo coalho', 45.00, '/images/porcao-dadinho.jpg', ARRAY['Tapioca', 'Queijo Coalho']),
  (3, 'Coxinha Cremosa', 'Coxinhas cremosas de frango', 45.00, '/images/porcao-coxinha.jpg', ARRAY['Coxinha de Frango']),
  (3, 'Calabresa Acebolada', 'Calabresa fatiada com cebola', 40.00, '/images/porcao-calabresa.jpg', ARRAY['Calabresa', 'Cebola']),
  (3, 'Contra File', 'Porcao de contra file grelhado', 70.00, '/images/porcao-contra.jpg', ARRAY['Contra File Grelhado']),
  (3, 'Fraldinha na Mostarda', 'Fraldinha ao molho de mostarda', 60.00, '/images/porcao-fraldinha.jpg', ARRAY['Fraldinha', 'Molho Mostarda']),
  (3, 'Salame', 'Porcao de salame fatiado', 28.00, '/images/porcao-salame.jpg', ARRAY['Salame Fatiado']),
  (3, 'Palmito', 'Porcao de palmito', 32.00, '/images/porcao-palmito.jpg', ARRAY['Palmito']),
  (3, 'Azeitona', 'Porcao de azeitonas', 10.00, '/images/porcao-azeitona.jpg', ARRAY['Azeitonas']),
  (3, 'Ovo de Codorna', 'Unidade de ovo de codorna', 0.50, '/images/porcao-ovodecodorna.jpg', ARRAY['Ovo de Codorna']),
  (3, 'Bolinho de Costela com Catupiry', 'Porcao inteira com 12 bolinhos de costela recheados com catupiry', 50.00, '/images/porcao-bolinho-costela.jpg', ARRAY['12 Bolinhos de Costela', 'Catupiry']),
  (3, 'Tabua de Frios', 'Salame, Presunto, Mussarela, Ovo de Codorna, Azeitona, Palmito, Tomate', 80.00, '/images/tabuadefrios.jpg', ARRAY['Salame', 'Presunto', 'Mussarela', 'Ovo de Codorna', 'Azeitona', 'Palmito', 'Tomate']);

-- Variacoes da Batata
INSERT INTO product_variations (product_id, name, price, display_order) 
SELECT id, 'Individual', 8.00, 1 FROM products WHERE name = 'Batata Frita';
INSERT INTO product_variations (product_id, name, price, display_order) 
SELECT id, 'Meia', 20.00, 2 FROM products WHERE name = 'Batata Frita';
INSERT INTO product_variations (product_id, name, price, display_order) 
SELECT id, 'Inteira', 30.00, 3 FROM products WHERE name = 'Batata Frita';

-- Variacoes do Kibe
INSERT INTO product_variations (product_id, name, price, display_order) 
SELECT id, 'Tradicional', 40.00, 1 FROM products WHERE name = 'Kibe';
INSERT INTO product_variations (product_id, name, price, display_order) 
SELECT id, 'Catupiry', 40.00, 2 FROM products WHERE name = 'Kibe';
INSERT INTO product_variations (product_id, name, price, display_order) 
SELECT id, 'Queijada', 40.00, 3 FROM products WHERE name = 'Kibe';

-- =====================================================
-- DADOS INICIAIS - PRODUTOS (BEBIDAS)
-- =====================================================

INSERT INTO products (category_id, name, description, price, image_url, ingredients, subcategory) VALUES 
  -- Cervejas
  (4, 'Antarctica 600ml', 'Cerveja Garrafa', 10.00, '/images/antartica600.png', ARRAY['600ml'], 'Cervejas'),
  (4, 'Skol 600ml', 'Cerveja Garrafa', 12.00, '/images/skol600.png', ARRAY['600ml'], 'Cervejas'),
  (4, 'Original 600ml', 'Cerveja Garrafa', 13.00, '/images/originalgarrafa.png', ARRAY['600ml'], 'Cervejas'),
  (4, 'Heineken 600ml', 'Cerveja Garrafa', 15.00, '/images/heineken600.jpg', ARRAY['600ml'], 'Cervejas'),
  (4, 'Brahma Lata', 'Cerveja Lata', 6.00, '/images/brahmalata.jpg', ARRAY['Lata'], 'Cervejas'),
  (4, 'Antarctica Lata', 'Cerveja Lata', 6.00, '/images/antartica-lata.png', ARRAY['Lata'], 'Cervejas'),
  (4, 'Skol Lata', 'Cerveja Lata', 6.00, '/images/skol-lata.png', ARRAY['Lata'], 'Cervejas'),
  (4, 'Original Lata', 'Cerveja Lata', 8.00, '/images/original-lata.png', ARRAY['Lata'], 'Cervejas'),
  (4, 'Brahma Zero', 'Cerveja Sem Alcool', 7.00, '/images/brahma-zero-lata.png', ARRAY['Lata'], 'Cervejas'),
  -- Long Necks
  (4, 'Heineken', 'Long Neck', 10.00, '/images/heiniken-long.png', ARRAY['Long Neck'], 'Long Necks'),
  (4, 'Spaten', 'Long Neck', 9.00, '/images/spaten-long.png', ARRAY['Long Neck'], 'Long Necks'),
  (4, 'Corona', 'Long Neck', 10.00, '/images/corona-long.png', ARRAY['Long Neck'], 'Long Necks'),
  (4, 'Budweiser', 'Long Neck', 9.00, '/images/budweiser-long.png', ARRAY['Long Neck'], 'Long Necks'),
  (4, 'Imperio', 'Long Neck', 6.00, '/images/imperio-long.png', ARRAY['Long Neck'], 'Long Necks'),
  (4, 'Smirnoff Ice', 'Long Neck', 9.00, '/images/smirnoff-ice-long.png', ARRAY['Long Neck'], 'Long Necks'),
  (4, 'Ice Cabare', 'Long Neck', 9.00, '/images/ice-cabare-long.png', ARRAY['Long Neck'], 'Long Necks'),
  (4, 'Ice 51', 'Long Neck', 9.00, '/images/ice-51-long.png', ARRAY['Long Neck'], 'Long Necks'),
  -- Aguas
  (4, 'Agua Mineral sem Gas', 'Garrafa', 3.00, '/images/aguasemgas.png', ARRAY['Garrafa'], 'Aguas'),
  (4, 'Agua Mineral com Gas', 'Garrafa', 4.00, '/images/aguacomgas.png', ARRAY['Garrafa'], 'Aguas'),
  (4, 'Agua Tonica', 'Garrafa', 6.00, '/images/agua-tonica.png', ARRAY['Garrafa'], 'Aguas'),
  (4, 'H2O', 'Agua Saborizada', 6.00, '/images/h2o.png', ARRAY['Garrafa'], 'Aguas'),
  -- Sucos
  (4, 'Suco Del Valle', 'Caixa', 7.00, '/images/suco-delvalle.png', ARRAY['Caixa'], 'Sucos'),
  -- Energeticos
  (4, 'Red Bull', 'Lata', 15.00, '/images/redbull.jpg', ARRAY['Lata'], 'Energeticos'),
  (4, 'Monster', 'Lata', 12.00, '/images/monster.jpg', ARRAY['Lata'], 'Energeticos'),
  -- Refrigerantes
  (4, 'Coca-Cola Lata', 'Lata', 6.00, '/images/cocalata.jpg', ARRAY['Lata'], 'Refrigerantes'),
  (4, 'Coca-Cola Zero Lata', 'Lata', 6.00, '/images/cocazero-lata.jpg', ARRAY['Lata'], 'Refrigerantes'),
  (4, 'Guarana Lata', 'Lata', 6.00, '/images/guarana-lata.jpg', ARRAY['Lata'], 'Refrigerantes'),
  (4, 'Sprite Lata', 'Lata', 6.00, '/images/sprite-lata.jpg', ARRAY['Lata'], 'Refrigerantes'),
  (4, 'Schweppes Lata', 'Lata', 6.00, '/images/Schweppes-lata.png', ARRAY['Lata'], 'Refrigerantes'),
  (4, 'Fanta Laranja Lata', 'Lata', 6.00, '/images/fantalaranja-lata.jpg', ARRAY['Lata'], 'Refrigerantes'),
  (4, 'Fanta Uva Lata', 'Lata', 6.00, '/images/fantauva-lata.jpg', ARRAY['Lata'], 'Refrigerantes'),
  (4, 'Coca-Cola 290ml', 'Garrafa', 5.00, '/images/coca-290.png', ARRAY['290ml'], 'Refrigerantes'),
  (4, 'Coca-Cola 600ml', 'Garrafa', 8.00, '/images/coca600.jpg', ARRAY['600ml'], 'Refrigerantes'),
  (4, 'Guarana 600ml', 'Garrafa', 8.00, '/images/guarana600.jpg', ARRAY['600ml'], 'Refrigerantes'),
  (4, 'Sprite 600ml', 'Garrafa', 8.00, '/images/sprite600.jpg', ARRAY['600ml'], 'Refrigerantes'),
  (4, 'Coca-Cola 1L', 'Garrafa', 10.00, '/images/coca1l.png', ARRAY['1 Litro'], 'Refrigerantes'),
  (4, 'Guarana 1L', 'Garrafa', 10.00, '/images/guarana1l.png', ARRAY['1 Litro'], 'Refrigerantes'),
  (4, 'Coca-Cola 2L', 'Garrafa', 15.00, '/images/coca2l.jpg', ARRAY['2 Litros'], 'Refrigerantes'),
  (4, 'Sprite 2L', 'Garrafa', 12.00, '/images/sprite2l.jpg', ARRAY['2 Litros'], 'Refrigerantes'),
  (4, 'Fanta Laranja 2L', 'Garrafa', 12.00, '/images/fanta-laranja2l.jpg', ARRAY['2 Litros'], 'Refrigerantes'),
  (4, 'Guarana 2L', 'Garrafa', 12.00, '/images/guarana2l.jpg', ARRAY['2 Litros'], 'Refrigerantes');

-- =====================================================
-- DADOS INICIAIS - PRODUTOS (COMBOS)
-- =====================================================

INSERT INTO products (category_id, name, description, price, image_url, ingredients) VALUES 
  (5, 'Barca do Capitao', '1 Capitao Salada, 1 Capitao Bacon, 1/2 Batata c/ Catupiry e Bacon, 8 Aneis de Cebola', 84.90, '/images/barca-capitao.jpg', ARRAY['Capitao Salada', 'Capitao Bacon', '1/2 Batata c/ Catupiry e Bacon', '8 Aneis de Cebola']),
  (5, 'Barca de Porcoes', '7 Pasteizinhos, 1/2 Kibe, 1/2 Batata c/ Catupiry e Bacon, 5 Coxinhas', 84.90, '/images/barca-porcoes.jpg', ARRAY['7 Pasteizinhos Mistos', '1/2 Porcao de Kibe', '1/2 Batata c/ Catupiry e Bacon', '5 Coxinhas Cremosas']),
  (5, 'Barca Mista', '1 Capitao Salada, 1 Capitao Bacon, 1/2 Kibe, 1/2 Batata, 5 Coxinhas', 109.90, '/images/barca-mista.jpg', ARRAY['Capitao Salada', 'Capitao Bacon', '1/2 Porcao de Kibe', '1/2 Batata c/ Catupiry e Bacon', '5 Coxinhas Cremosas']),
  (5, 'Mini Rodizio', '5 sabores variados de hamburgueres + Batata Frita', 84.90, '/images/mini-rodizio.jpg', ARRAY['Capitao Salada', 'Capitao Bacon', 'Capitao Classico', 'Capitao Harry', 'Capitao Empoderado', 'Batata Frita']);

-- =====================================================
-- DADOS INICIAIS - PRODUTOS (ESPETOS)
-- =====================================================

INSERT INTO products (category_id, name, description, price, image_url, ingredients) VALUES 
  (6, 'Espeto Pedaco', 'Espeto de carne em pedacos', 8.00, '/images/espeto-pedaco.jpg', ARRAY['Carne em Pedacos']),
  (6, 'Espeto Kafta', 'Espeto de kafta temperada', 8.00, '/images/espeto-kafita.jpg', ARRAY['Kafta Temperada']),
  (6, 'Espeto Linguica', 'Espeto de linguica', 8.00, '/images/espeto-linguica.jpg', ARRAY['Linguica']),
  (6, 'Espeto Medalhao', 'Espeto de medalhao de carne', 12.00, '/images/espeto-medalhao.jpg', ARRAY['Medalhao de Carne']),
  (6, 'Espeto Coracao', 'Espeto de coracao de frango', 12.00, '/images/espeto-coracao.jpg', ARRAY['Coracao de Frango']),
  (6, 'Espeto Queijinho', 'Espeto de queijo coalho', 10.00, '/images/espeto-queijinho.jpg', ARRAY['Queijo Coalho']),
  (6, 'Pao de Alho', 'Pao de alho na brasa', 6.00, '/images/espeto-paodealho.jpg', ARRAY['Pao de Alho']);

-- =====================================================
-- DADOS INICIAIS - PRODUTOS (JANTINHA E CHURROS)
-- =====================================================

INSERT INTO products (category_id, name, description, price, image_url, ingredients) VALUES 
  (7, 'Jantinha Completa', 'Acompanha arroz, vinagrete, mandioca e farofa', 15.00, '/images/jantinha.jpg', ARRAY['Arroz', 'Vinagrete', 'Mandioca', 'Farofa']),
  (8, 'Mini Porcao de Churros', '30 mini churros deliciosos com acucar e canela', 42.00, '/images/churros.jpg', ARRAY['30 Mini Churros', 'Acucar', 'Canela']);

-- =====================================================
-- ASSOCIAR ADDONS AOS BURGUERES E SUPER BURGUERES
-- =====================================================

INSERT INTO product_addons (product_id, addon_id)
SELECT p.id, a.id 
FROM products p
CROSS JOIN addons a
WHERE p.category_id IN (1, 2);

-- =====================================================
-- FIM DO SETUP
-- =====================================================
