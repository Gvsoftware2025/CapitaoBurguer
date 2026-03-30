-- =============================================
-- CAPITAO BURGUER - SEED DE TODOS OS PRODUTOS
-- =============================================

-- Limpar dados existentes (opcional - remova se quiser manter dados)
TRUNCATE TABLE combo_choice_options CASCADE;
TRUNCATE TABLE combo_choices CASCADE;
TRUNCATE TABLE product_addons CASCADE;
TRUNCATE TABLE product_variations CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE subcategories CASCADE;
TRUNCATE TABLE addons CASCADE;
TRUNCATE TABLE maioneses CASCADE;
TRUNCATE TABLE categories CASCADE;

-- =============================================
-- CATEGORIAS
-- =============================================
INSERT INTO categories (id, name, slug, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Burgueres', 'burgueres', 1),
  ('22222222-2222-2222-2222-222222222222', 'Super Burgueres', 'super_burgueres', 2),
  ('33333333-3333-3333-3333-333333333333', 'Pastel', 'pastel', 3),
  ('44444444-4444-4444-4444-444444444444', 'Porcoes', 'porcoes', 4),
  ('55555555-5555-5555-5555-555555555555', 'Combos e Barcas', 'combos', 5),
  ('66666666-6666-6666-6666-666666666666', 'Espetos', 'espetos', 6),
  ('77777777-7777-7777-7777-777777777777', 'Jantinha', 'jantinha', 7),
  ('88888888-8888-8888-8888-888888888888', 'Bebidas', 'bebidas', 8),
  ('99999999-9999-9999-9999-999999999999', 'Churros', 'churros', 9);

-- =============================================
-- SUBCATEGORIAS
-- =============================================
-- Subcategorias de Bebidas
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES
  ('aaa11111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 'Cervejas', 'cervejas', 1),
  ('aaa22222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888', 'Long Necks', 'long_necks', 2),
  ('aaa33333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', 'Aguas', 'aguas', 3),
  ('aaa44444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'Sucos', 'sucos', 4),
  ('aaa55555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', 'Energeticos', 'energeticos', 5),
  ('aaa66666-6666-6666-6666-666666666666', '88888888-8888-8888-8888-888888888888', 'Refrigerantes', 'refrigerantes', 6);

-- Subcategorias de Pastel
INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES
  ('bbb11111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Pastel Salgado', 'pastel_salgado', 1),
  ('bbb22222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Pastel Doce', 'pastel_doce', 2);

-- =============================================
-- MAIONESES
-- =============================================
INSERT INTO maioneses (id, name, extra_price) VALUES
  ('ccc11111-1111-1111-1111-111111111111', 'Maionese de Bacon', 2.00),
  ('ccc22222-2222-2222-2222-222222222222', 'Maionese de Rucula', 2.00),
  ('ccc33333-3333-3333-3333-333333333333', 'Maionese de Picles', 2.00);

-- =============================================
-- ACRESCIMOS (ADD-ONS)
-- =============================================
INSERT INTO addons (id, name, price) VALUES
  ('ddd11111-1111-1111-1111-111111111111', 'Queijo Empanado', 12.00),
  ('ddd22222-2222-2222-2222-222222222222', 'Hamburguer Extra', 9.00),
  ('ddd33333-3333-3333-3333-333333333333', 'Bacon', 6.00),
  ('ddd44444-4444-4444-4444-444444444444', 'Queijo', 6.00),
  ('ddd55555-5555-5555-5555-555555555555', 'Catupiry', 6.00),
  ('ddd66666-6666-6666-6666-666666666666', 'Cheddar', 6.00),
  ('ddd77777-7777-7777-7777-777777777777', 'Ovo', 3.00),
  ('ddd88888-8888-8888-8888-888888888888', 'Salada', 3.00),
  ('ddd99999-9999-9999-9999-999999999999', 'Onions', 2.00);

-- =============================================
-- BURGUERES
-- =============================================
INSERT INTO products (id, category_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Capitao Classico', 'O tradicional que conquistou os mares', 25.00, '/images/capitao-classico.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Tomate'], 1),
  ('p0000001-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'Capitao Bacon', 'Para os amantes de bacon', 28.00, '/images/capitao-bacon.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Bacon', 'Cebola Caramelizada'], 2),
  ('p0000001-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'Capitao Cheddar', 'Explosao de cheddar cremoso', 28.00, '/images/capitao-cheddar.jpg', ARRAY['Hamburguer 150g', 'Cheddar Cremoso', 'Bacon Crocante'], 3),
  ('p0000001-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111111', 'Capitao Salada', 'Fresquinho e saboroso', 28.00, '/images/capitao-salada.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Picles', 'Tomate', 'Cebola Roxa'], 4),
  ('p0000001-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111111', 'Capitao Onion', 'Com onions crocantes', 30.00, '/images/capitao-onion.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Bacon Crocante', 'Molho Barbecue', 'Onions'], 5),
  ('p0000001-0001-0001-0001-000000000006', '11111111-1111-1111-1111-111111111111', 'Capitao Gorgonzola', 'Sabor sofisticado', 30.00, '/images/capitao-gorgonzola.jpg', ARRAY['Hamburguer 150g', 'Queijo Gorgonzola', 'Mel', 'Rucula'], 6),
  ('p0000001-0001-0001-0001-000000000007', '11111111-1111-1111-1111-111111111111', 'Capitao Harry', 'Magico e delicioso', 30.00, '/images/capitao-harry.jpg', ARRAY['Hamburguer 150g', 'Queijo Mussarela', 'Catupiry', 'Alho Frito', 'Bacon Crocante'], 7),
  ('p0000001-0001-0001-0001-000000000008', '11111111-1111-1111-1111-111111111111', 'Capitao Cheese', 'Queijo por todos os lados', 30.00, '/images/capitao-cheese.jpg', ARRAY['Hamburguer 150g', 'Cream Cheese', 'Cebola Crispy'], 8),
  ('p0000001-0001-0001-0001-000000000009', '11111111-1111-1111-1111-111111111111', 'Capitao Pig', 'Suino especial', 30.00, '/images/capitao-pig.jpg', ARRAY['Hamburguer de Pernil Suino', 'Queijo Mussarela', 'Bacon Crocante', 'Molho Barbecue', 'Alface Fresca'], 9),
  ('p0000001-0001-0001-0001-000000000010', '11111111-1111-1111-1111-111111111111', 'Capitao Vegetariano', 'Sem carne, muito sabor', 30.00, '/images/capitao-vegetariano.jpg', ARRAY['Queijo Empanado', 'Cream Cheese', 'Tomates Secos', 'Rucula Fresca'], 10),
  ('p0000001-0001-0001-0001-000000000011', '11111111-1111-1111-1111-111111111111', 'Capitao Kids', 'Para os pequenos piratas', 28.00, '/images/capitao-kids.jpg', ARRAY['Hamburguer 100g', 'Queijo Prato', 'Cheddar', 'Bacon Crocante', 'Batata Frita'], 11),
  ('p0000001-0001-0001-0001-000000000012', '11111111-1111-1111-1111-111111111111', 'Capitao Rucula', 'Fresquinho com rucula', 28.00, '/images/capitao-rucula.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Bacon Crocante', 'Cebola Caramelizada', 'Rucula Fresca'], 12),
  ('p0000001-0001-0001-0001-000000000013', '11111111-1111-1111-1111-111111111111', 'Capitao Nacho', 'Com doritos crocante', 28.00, '/images/capitao_nacho.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Cheddar Cremoso', 'Doritos'], 13);

-- =============================================
-- SUPER BURGUERES
-- =============================================
INSERT INTO products (id, category_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000002-0002-0002-0002-000000000001', '22222222-2222-2222-2222-222222222222', 'Capitao Chicken', 'Frango empanado especial', 38.00, '/images/capitao_chicken.jpg', ARRAY['Hamburguer de Frango', 'Queijo Prato', 'Catupiry', 'Bacon Crocante'], 1),
  ('p0000002-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222222', 'Capitao Hulk', 'Para os famintos de verdade', 38.00, '/images/capitao_hulk.jpg', ARRAY['Hamburguer 150g', 'Queijo Prato', 'Hamburguer de Pernil', 'Bacon Crocante', 'Requeijao Cremoso', 'Alface Fresca', 'Tomate', 'Cebola'], 2),
  ('p0000002-0002-0002-0002-000000000003', '22222222-2222-2222-2222-222222222222', 'Capitao Nordestino', 'Sabor do sertao', 38.00, '/images/capitao-nordestino.jpg', ARRAY['Hamburguer 150g', 'Queijo Mussarela', 'Catupiry', 'Carne Seca'], 3),
  ('p0000002-0002-0002-0002-000000000004', '22222222-2222-2222-2222-222222222222', 'Capitao Empoderado', 'Costela suculenta', 38.00, '/images/capitao-empoderado.jpg', ARRAY['Hamburguer de Costela 180g', 'Barbecue na Base', 'Muito Queijo', 'Muito Bacon', 'Onions'], 4),
  ('p0000002-0002-0002-0002-000000000005', '22222222-2222-2222-2222-222222222222', 'Capitao Duca', 'Completo e irresistivel', 38.00, '/images/capitao-duca.jpg', ARRAY['Hamburguer 150g', 'Queijo Empanado', 'Ovo', 'Alface', 'Tomate', 'Cebola Roxa'], 5),
  ('p0000002-0002-0002-0002-000000000006', '22222222-2222-2222-2222-222222222222', 'Capitao da Casa', 'O monstro da casa', 38.00, '/images/capitao-casa.jpg', ARRAY['Hamburguer 300g', 'Queijo Mussarela', 'Bacon', 'Ovo', 'Catupiry', 'Rucula Fresca'], 6),
  ('p0000002-0002-0002-0002-000000000007', '22222222-2222-2222-2222-222222222222', 'Capitao Eclipse', 'Triplo poder', 38.00, '/images/capitao-eclipse.jpg', ARRAY['3x Hamburguer 100g', 'Maionese da Casa', 'Muito Queijo', 'Bacon Crocante', 'Cebola Caramelizada', 'Alface Fresca'], 7),
  ('p0000002-0002-0002-0002-000000000008', '22222222-2222-2222-2222-222222222222', 'Capitao America', 'O lendario recheado', 38.00, '/images/capitao-america.jpg', ARRAY['Hamburguer 200g Recheado com Mussarela', 'Queijo Mussarela', 'Maionese da Casa', 'Bacon Crocante', 'Alface Fresca', 'Tomate', 'Cebola Roxa'], 8),
  ('p0000002-0002-0002-0002-000000000009', '22222222-2222-2222-2222-222222222222', 'Capitao Costela', 'Com costela desfiada', 38.00, '/images/capitao-costela.jpg', ARRAY['Hamburguer 150g', 'Queijo Mussarela', 'Catupiry', 'Alho Frito', 'Costela Desfiada', 'Rucula'], 9),
  ('p0000002-0002-0002-0002-000000000010', '22222222-2222-2222-2222-222222222222', 'Capitao Bauru', 'Contra-file especial', 38.00, '/images/capitao-bauru.jpg', ARRAY['Hamburguer 200g de Contra-File', 'Queijo Mussarela', 'Catupiry', 'Tomate', 'Rucula Fresca'], 10),
  ('p0000002-0002-0002-0002-000000000011', '22222222-2222-2222-2222-222222222222', 'Capitao Supremo', 'O premium de fraldinha', 40.00, '/images/capitao-supremo.jpg', ARRAY['Hamburguer 180g de Fraldinha', 'Queijo Mussarela', 'Catupiry', 'Mostarda', 'Tomate', 'Alface'], 11);

-- =============================================
-- PORCOES
-- =============================================
INSERT INTO products (id, category_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000003-0003-0003-0003-000000000001', '44444444-4444-4444-4444-444444444444', 'Batata Frita', 'Batatas fritas crocantes com tempero especial', 10.00, '/images/porcao-batata.jpg', ARRAY['Batata Frita', 'Tempero Especial'], 1),
  ('p0000003-0003-0003-0003-000000000002', '44444444-4444-4444-4444-444444444444', 'Kibe', 'Kibes bem temperados', 45.00, '/images/porcao-kibe.jpg', ARRAY['Kibe', 'Tempero Especial'], 2),
  ('p0000003-0003-0003-0003-000000000003', '44444444-4444-4444-4444-444444444444', 'Anel de Cebola', 'Aneis de cebola empanados e crocantes', 30.00, '/images/porcao-onion.jpg', ARRAY['Cebola Empanada'], 3),
  ('p0000003-0003-0003-0003-000000000004', '44444444-4444-4444-4444-444444444444', 'Tilapia', 'Porcao de tilapia empanada', 55.00, '/images/porcao-tilapia.jpg', ARRAY['Tilapia Empanada'], 4),
  ('p0000003-0003-0003-0003-000000000005', '44444444-4444-4444-4444-444444444444', 'Pastelzinho', 'Pastelzinhos fritos variados', 45.00, '/images/porcao-pastelzinho.jpg', ARRAY['Pastelzinho Frito'], 5),
  ('p0000003-0003-0003-0003-000000000006', '44444444-4444-4444-4444-444444444444', 'Dadinho de Tapioca', 'Dadinhos de tapioca com queijo coalho', 45.00, '/images/porcao-dadinho.jpg', ARRAY['Tapioca', 'Queijo Coalho'], 6),
  ('p0000003-0003-0003-0003-000000000007', '44444444-4444-4444-4444-444444444444', 'Coxinha Cremosa', 'Coxinhas cremosas de frango', 48.00, '/images/porcao-coxinha.jpg', ARRAY['Coxinha de Frango'], 7),
  ('p0000003-0003-0003-0003-000000000008', '44444444-4444-4444-4444-444444444444', 'Calabresa Acebolada', 'Calabresa fatiada com cebola', 40.00, '/images/porcao-calabresa.jpg', ARRAY['Calabresa', 'Cebola'], 8),
  ('p0000003-0003-0003-0003-000000000009', '44444444-4444-4444-4444-444444444444', 'Contra File', 'Porcao de contra file grelhado', 70.00, '/images/porcao-contra.jpg', ARRAY['Contra File Grelhado'], 9),
  ('p0000003-0003-0003-0003-000000000010', '44444444-4444-4444-4444-444444444444', 'Fraldinha na Mostarda', 'Fraldinha ao molho de mostarda', 60.00, '/images/porcao-fraldinha.jpg', ARRAY['Fraldinha', 'Molho Mostarda'], 10),
  ('p0000003-0003-0003-0003-000000000011', '44444444-4444-4444-4444-444444444444', 'Salame', 'Porcao de salame fatiado', 30.00, '/images/porcao-salame.jpg', ARRAY['Salame Fatiado'], 11),
  ('p0000003-0003-0003-0003-000000000012', '44444444-4444-4444-4444-444444444444', 'Palmito', 'Porcao de palmito', 32.00, '/images/porcao-palmito.jpg', ARRAY['Palmito'], 12),
  ('p0000003-0003-0003-0003-000000000013', '44444444-4444-4444-4444-444444444444', 'Azeitona', 'Porcao de azeitonas', 10.00, '/images/porcao-azeitona.jpg', ARRAY['Azeitonas'], 13),
  ('p0000003-0003-0003-0003-000000000014', '44444444-4444-4444-4444-444444444444', 'Ovo de Codorna', 'Unidade de ovo de codorna', 0.50, '/images/porcao-ovodecodorna.jpg', ARRAY['Ovo de Codorna'], 14),
  ('p0000003-0003-0003-0003-000000000015', '44444444-4444-4444-4444-444444444444', 'Bolinho de Costela com Catupiry', 'Porcao inteira com 12 bolinhos de costela recheados com catupiry', 55.00, '/images/porcao-bolinho-costela.png', ARRAY['12 Bolinhos de Costela', 'Catupiry'], 15),
  ('p0000003-0003-0003-0003-000000000016', '44444444-4444-4444-4444-444444444444', 'Tabua de Frios', 'Salame, Presunto, Mussarela, Ovo de Codorna, Azeitona, Palmito, Tomate', 80.00, '/images/tabuadefrios.jpg', ARRAY['Salame', 'Presunto', 'Mussarela', 'Ovo de Codorna', 'Azeitona', 'Palmito', 'Tomate'], 16);

-- Variacoes da Batata Frita
INSERT INTO product_variations (product_id, name, price, display_order) VALUES
  ('p0000003-0003-0003-0003-000000000001', 'Individual', 10.00, 1),
  ('p0000003-0003-0003-0003-000000000001', 'Meia', 22.00, 2),
  ('p0000003-0003-0003-0003-000000000001', 'Inteira', 32.00, 3);

-- Variacoes do Kibe
INSERT INTO product_variations (product_id, name, price, display_order) VALUES
  ('p0000003-0003-0003-0003-000000000002', 'Tradicional', 45.00, 1),
  ('p0000003-0003-0003-0003-000000000002', 'Catupiry', 45.00, 2),
  ('p0000003-0003-0003-0003-000000000002', 'Coalhada', 45.00, 3);

-- =============================================
-- CHURROS
-- =============================================
INSERT INTO products (id, category_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000009-0009-0009-0009-000000000001', '99999999-9999-9999-9999-999999999999', 'Mini Porcao de Churros', '30 mini churros deliciosos com acucar e canela', 42.00, '/images/churros.jpg', ARRAY['30 Mini Churros', 'Acucar', 'Canela'], 1);

-- =============================================
-- ESPETOS
-- =============================================
INSERT INTO products (id, category_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000004-0004-0004-0004-000000000001', '66666666-6666-6666-6666-666666666666', 'Espeto Pedaco', 'Espeto de carne em pedacos', 8.00, '/images/espeto-pedaco.jpg', ARRAY['Carne em Pedacos'], 1),
  ('p0000004-0004-0004-0004-000000000002', '66666666-6666-6666-6666-666666666666', 'Espeto Kafta', 'Espeto de kafta temperada', 8.00, '/images/espeto-kafita.jpg', ARRAY['Kafta Temperada'], 2),
  ('p0000004-0004-0004-0004-000000000003', '66666666-6666-6666-6666-666666666666', 'Espeto Linguica', 'Espeto de linguica', 8.00, '/images/espeto-linguica.jpg', ARRAY['Linguica'], 3),
  ('p0000004-0004-0004-0004-000000000004', '66666666-6666-6666-6666-666666666666', 'Espeto Medalhao', 'Espeto de medalhao de carne', 12.00, '/images/espeto-medalhao.jpg', ARRAY['Medalhao de Carne'], 4),
  ('p0000004-0004-0004-0004-000000000005', '66666666-6666-6666-6666-666666666666', 'Espeto Coracao', 'Espeto de coracao de frango', 12.00, '/images/espeto-coracao.jpg', ARRAY['Coracao de Frango'], 5),
  ('p0000004-0004-0004-0004-000000000006', '66666666-6666-6666-6666-666666666666', 'Espeto Queijinho', 'Espeto de queijo coalho', 10.00, '/images/espeto-queijinho.jpg', ARRAY['Queijo Coalho'], 6),
  ('p0000004-0004-0004-0004-000000000007', '66666666-6666-6666-6666-666666666666', 'Pao de Alho', 'Pao de alho na brasa', 6.00, '/images/espeto-paodealho.jpg', ARRAY['Pao de Alho'], 7);

-- =============================================
-- JANTINHA
-- =============================================
INSERT INTO products (id, category_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000005-0005-0005-0005-000000000001', '77777777-7777-7777-7777-777777777777', 'Jantinha Completa', 'Acompanha arroz, vinagrete, mandioca e farofa', 15.00, '/images/jantinha.jpg', ARRAY['Arroz', 'Vinagrete', 'Mandioca', 'Farofa'], 1);

-- =============================================
-- COMBOS E BARCAS
-- =============================================
INSERT INTO products (id, category_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000006-0006-0006-0006-000000000001', '55555555-5555-5555-5555-555555555555', 'Barca do Capitao', '1 Capitao Salada, 1 Capitao Bacon, 1/2 Batata, 8 Aneis de Cebola', 84.90, '/images/barca-capitao.jpg', ARRAY['Capitao Salada', 'Capitao Bacon', '1/2 Batata', '8 Aneis de Cebola'], 1),
  ('p0000006-0006-0006-0006-000000000002', '55555555-5555-5555-5555-555555555555', 'Barca de Porcoes', '7 Pasteizinhos, 1/2 Kibe, 1/2 Batata, 5 Coxinhas', 84.90, '/images/barca-porcoes.jpg', ARRAY['7 Pasteizinhos Mistos', '1/2 Kibe', '1/2 Batata', '5 Coxinhas Cremosas'], 2),
  ('p0000006-0006-0006-0006-000000000003', '55555555-5555-5555-5555-555555555555', 'Barca Mista', '1 Capitao Salada, 1 Capitao Bacon, 1/2 Kibe, 1/2 Batata, 5 Coxinhas', 109.90, '/images/barca-mista.jpg', ARRAY['Capitao Salada', 'Capitao Bacon', '1/2 Kibe', '1/2 Batata', '5 Coxinhas Cremosas'], 3),
  ('p0000006-0006-0006-0006-000000000004', '55555555-5555-5555-5555-555555555555', 'Mini Rodizio', '5 sabores variados de hamburgueres + Batata Frita', 84.90, '/images/mini-rodizio.jpg', ARRAY['Capitao Salada', 'Capitao Bacon', 'Capitao Classico', 'Capitao Harry', 'Capitao Empoderado', 'Batata Frita'], 4);

-- Combo Choices para Barca do Capitao
INSERT INTO combo_choices (id, product_id, label, display_order) VALUES
  ('cc000001-0001-0001-0001-000000000001', 'p0000006-0006-0006-0006-000000000001', 'Batata com:', 1);
INSERT INTO combo_choice_options (combo_choice_id, name, display_order) VALUES
  ('cc000001-0001-0001-0001-000000000001', 'Catupiry', 1),
  ('cc000001-0001-0001-0001-000000000001', 'Cheddar', 2);

-- Combo Choices para Barca de Porcoes
INSERT INTO combo_choices (id, product_id, label, display_order) VALUES
  ('cc000002-0002-0002-0002-000000000001', 'p0000006-0006-0006-0006-000000000002', 'Batata com:', 1),
  ('cc000002-0002-0002-0002-000000000002', 'p0000006-0006-0006-0006-000000000002', 'Kibe:', 2);
INSERT INTO combo_choice_options (combo_choice_id, name, display_order) VALUES
  ('cc000002-0002-0002-0002-000000000001', 'Catupiry', 1),
  ('cc000002-0002-0002-0002-000000000001', 'Cheddar', 2),
  ('cc000002-0002-0002-0002-000000000002', 'Tradicional', 1),
  ('cc000002-0002-0002-0002-000000000002', 'Catupiry', 2),
  ('cc000002-0002-0002-0002-000000000002', 'Coalhada', 3);

-- Combo Choices para Barca Mista
INSERT INTO combo_choices (id, product_id, label, display_order) VALUES
  ('cc000003-0003-0003-0003-000000000001', 'p0000006-0006-0006-0006-000000000003', 'Batata com:', 1),
  ('cc000003-0003-0003-0003-000000000002', 'p0000006-0006-0006-0006-000000000003', 'Kibe:', 2);
INSERT INTO combo_choice_options (combo_choice_id, name, display_order) VALUES
  ('cc000003-0003-0003-0003-000000000001', 'Catupiry', 1),
  ('cc000003-0003-0003-0003-000000000001', 'Cheddar', 2),
  ('cc000003-0003-0003-0003-000000000002', 'Tradicional', 1),
  ('cc000003-0003-0003-0003-000000000002', 'Catupiry', 2),
  ('cc000003-0003-0003-0003-000000000002', 'Coalhada', 3);

-- =============================================
-- PASTEIS SALGADOS
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000007-0007-0007-0007-000000000001', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel de Carne', 'Carne moida, tomate e oregano', 19.00, '/images/pastel-carne.jpg', ARRAY['Carne moida', 'Tomate', 'Oregano'], 1),
  ('p0000007-0007-0007-0007-000000000002', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel de Queijo', 'Queijo Mussarela, Tomate E Oregano', 18.00, '/images/pastel-queijo.jpg', ARRAY['Queijo Mussarela', 'Tomate', 'Oregano'], 2),
  ('p0000007-0007-0007-0007-000000000003', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel de Pizza', 'Mussarela, Presunto, Tomate, Azeitona e Oregano', 19.00, '/images/pastel-pizza.jpg', ARRAY['Mussarela', 'Presunto', 'Tomate', 'Azeitona', 'Oregano'], 3),
  ('p0000007-0007-0007-0007-000000000004', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel Frango Catupiry', 'Frango desfiado, Tomate, Oregano, Mussarela e catupiry', 22.00, '/images/pastel-frango.jpg', ARRAY['Frango desfiado', 'Tomate', 'Oregano', 'Mussarela', 'Catupiry'], 4),
  ('p0000007-0007-0007-0007-000000000005', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel de Carne Seca', 'Queijo Mussarela, Carne Seca, tomate, Catupiry e oregano', 24.00, '/images/pastel-carne-seca.jpg', ARRAY['Queijo Mussarela', 'Carne Seca', 'Tomate', 'Catupiry', 'Oregano'], 5),
  ('p0000007-0007-0007-0007-000000000006', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel A Moda da Casa', 'Frango desfiado, Palmito, Bacon, Milho, Azeitona, Catupiry, Tomate e Oregano', 26.00, '/images/pastel-moda-casa.jpg', ARRAY['Frango desfiado', 'Palmito', 'Bacon', 'Milho', 'Azeitona', 'Catupiry', 'Tomate', 'Oregano'], 6),
  ('p0000007-0007-0007-0007-000000000007', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel de Calabresa', 'Calabresa, tomate, Mussarela, Oregano e Catupiry', 19.00, '/images/pastel-calabresa.jpg', ARRAY['Calabresa', 'Tomate', 'Mussarela', 'Oregano', 'Catupiry'], 7),
  ('p0000007-0007-0007-0007-000000000008', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel Brocolis com Bacon', 'Brocolis, bacon, Tomate, Mussarela, Oregano e Catupiry', 21.00, '/images/pastel-brocolis.jpg', ARRAY['Brocolis', 'Bacon', 'Tomate', 'Mussarela', 'Oregano', 'Catupiry'], 8),
  ('p0000007-0007-0007-0007-000000000009', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Pastel Carne com Queijo', 'Carne, Tomate, Queijo Mussarela e Oregano', 21.00, '/images/pastel-carne-queijo.jpg', ARRAY['Carne', 'Tomate', 'Queijo Mussarela', 'Oregano'], 9),
  ('p0000007-0007-0007-0007-000000000010', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Palmito', 'Palmito, tomate, mussarela, Oregano e catupiry', 22.00, '/images/pastel-palmito.jpg', ARRAY['Palmito', 'Tomate', 'Mussarela', 'Oregano', 'Catupiry'], 10),
  ('p0000007-0007-0007-0007-000000000011', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'Costela', 'Queijo mussarela, costela desfiada, alho frito, tomate, Oregano e catupiry', 26.00, '/images/pastel-costela.jpg', ARRAY['Queijo Mussarela', 'Costela desfiada', 'Alho frito', 'Tomate', 'Oregano', 'Catupiry'], 11),
  ('p0000007-0007-0007-0007-000000000012', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', 'File ao Alho', 'Contra file, alho frito, tomate seco, mussarela, Oregano e catupiry', 26.00, '/images/pastel-file.jpg', ARRAY['Contra file', 'Alho frito', 'Tomate seco', 'Mussarela', 'Oregano', 'Catupiry'], 12),
  ('p0000007-0007-0007-0007-000000000013', '33333333-3333-3333-3333-333333333333', 'bbb11111-1111-1111-1111-111111111111', '4 Queijos', 'Mussarela, gorgonzola, tomate, Oregano, provolone e catupiry', 23.00, '/images/pastel-4queijo.jpg', ARRAY['Mussarela', 'Gorgonzola', 'Tomate', 'Oregano', 'Provolone', 'Catupiry'], 13);

-- =============================================
-- PASTEIS DOCES
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000008-0008-0008-0008-000000000001', '33333333-3333-3333-3333-333333333333', 'bbb22222-2222-2222-2222-222222222222', 'Pastel Ovo Matine', 'Creme de Ovomaltine', 18.00, '/images/pastel-ovomaltine.jpg', ARRAY['Creme de Ovomaltine'], 1),
  ('p0000008-0008-0008-0008-000000000002', '33333333-3333-3333-3333-333333333333', 'bbb22222-2222-2222-2222-222222222222', 'Pastel Sensacao', 'Geleia de morango e brigadeiro', 18.00, '/images/pastel-sensacao.jpg', ARRAY['Geleia de morango', 'Brigadeiro'], 2),
  ('p0000008-0008-0008-0008-000000000003', '33333333-3333-3333-3333-333333333333', 'bbb22222-2222-2222-2222-222222222222', 'Pastel de Brigadeiro', 'Brigadeiro e granulado', 16.00, '/images/pastel-brigadeiro.jpg', ARRAY['Brigadeiro', 'Granulado'], 3),
  ('p0000008-0008-0008-0008-000000000004', '33333333-3333-3333-3333-333333333333', 'bbb22222-2222-2222-2222-222222222222', 'Pastel Leite Ninho', 'Creme de Leite Ninho', 16.00, '/images/pastel-leite-ninho.jpg', ARRAY['Creme de Leite Ninho'], 4),
  ('p0000008-0008-0008-0008-000000000005', '33333333-3333-3333-3333-333333333333', 'bbb22222-2222-2222-2222-222222222222', 'Pastel Ninho com Nutella', 'Creme de Leite Ninho e Nutella original', 18.00, '/images/pastel-ninho-nutella.jpg', ARRAY['Creme de Leite Ninho', 'Nutella original'], 5),
  ('p0000008-0008-0008-0008-000000000006', '33333333-3333-3333-3333-333333333333', 'bbb22222-2222-2222-2222-222222222222', 'Pastel Ninho com Morango', 'Creme de Leite Ninho com morango', 18.00, '/images/pastel-ninho-morango.jpg', ARRAY['Creme de Leite Ninho', 'Morango'], 6),
  ('p0000008-0008-0008-0008-000000000007', '33333333-3333-3333-3333-333333333333', 'bbb22222-2222-2222-2222-222222222222', 'Pastel de Nutella', 'Nutella original', 18.00, '/images/pastel-nutella.jpg', ARRAY['Nutella original'], 7),
  ('p0000008-0008-0008-0008-000000000008', '33333333-3333-3333-3333-333333333333', 'bbb22222-2222-2222-2222-222222222222', 'Pastel de Churros', 'Doce de leite', 16.00, '/images/pastel-churros.jpg', ARRAY['Doce de leite'], 8);

-- =============================================
-- BEBIDAS - CERVEJAS
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000010-0010-0010-0010-000000000001', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Antarctica 600ml', 'Cerveja Garrafa', 10.00, '/images/antartica600.png', ARRAY['600ml'], 1),
  ('p0000010-0010-0010-0010-000000000002', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Skol 600ml', 'Cerveja Garrafa', 12.00, '/images/skol600.png', ARRAY['600ml'], 2),
  ('p0000010-0010-0010-0010-000000000003', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Original 600ml', 'Cerveja Garrafa', 13.00, '/images/originalgarrafa.png', ARRAY['600ml'], 3),
  ('p0000010-0010-0010-0010-000000000004', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Heineken 600ml', 'Cerveja Garrafa', 16.00, '/images/heineken600.jpg', ARRAY['600ml'], 4),
  ('p0000010-0010-0010-0010-000000000005', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Eisenbahn 600', 'Cerveja Garrafa', 14.00, '/images/eisenbahn600.png', ARRAY['600ml'], 5),
  ('p0000010-0010-0010-0010-000000000006', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Spaten 600ml', 'Cerveja Garrafa', 14.00, '/images/spaten600.png', ARRAY['600ml'], 6),
  ('p0000010-0010-0010-0010-000000000007', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Brahma Lata', 'Cerveja Lata', 6.00, '/images/brahmalata.jpg', ARRAY['Lata'], 7),
  ('p0000010-0010-0010-0010-000000000008', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Antarctica Lata', 'Cerveja Lata', 6.00, '/images/antartica-lata.png', ARRAY['Lata'], 8),
  ('p0000010-0010-0010-0010-000000000009', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Skol Lata', 'Cerveja Lata', 6.00, '/images/skol-lata.png', ARRAY['Lata'], 9),
  ('p0000010-0010-0010-0010-000000000010', '88888888-8888-8888-8888-888888888888', 'aaa11111-1111-1111-1111-111111111111', 'Original Lata', 'Cerveja Lata', 8.00, '/images/original-lata.png', ARRAY['Lata'], 10);

-- =============================================
-- BEBIDAS - LONG NECKS
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000011-0011-0011-0011-000000000001', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Heineken', 'Long Neck', 10.00, '/images/heiniken-long.png', ARRAY['Long Neck'], 1),
  ('p0000011-0011-0011-0011-000000000002', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Heineken Zero', 'Long Neck', 10.00, '/images/heiniken-long-zero.png', ARRAY['Long Neck'], 2),
  ('p0000011-0011-0011-0011-000000000003', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Eisenbahn', 'Long Neck', 9.00, '/images/eisenbahn-long.png', ARRAY['Long Neck'], 3),
  ('p0000011-0011-0011-0011-000000000004', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Spaten', 'Long Neck', 9.00, '/images/spaten-long.png', ARRAY['Long Neck'], 4),
  ('p0000011-0011-0011-0011-000000000005', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Corona', 'Long Neck', 10.00, '/images/corona-long.png', ARRAY['Long Neck'], 5),
  ('p0000011-0011-0011-0011-000000000006', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Budweiser', 'Long Neck', 9.00, '/images/budweiser-long.png', ARRAY['Long Neck'], 6),
  ('p0000011-0011-0011-0011-000000000007', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Imperio', 'Long Neck', 6.00, '/images/imperio-long.png', ARRAY['Long Neck'], 7),
  ('p0000011-0011-0011-0011-000000000008', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Smirnoff Ice', 'Long Neck', 9.00, '/images/smirnoff-ice-long.png', ARRAY['Long Neck'], 8),
  ('p0000011-0011-0011-0011-000000000009', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Ice Cabare', 'Long Neck', 9.00, '/images/ice-cabare-long.png', ARRAY['Long Neck'], 9),
  ('p0000011-0011-0011-0011-000000000010', '88888888-8888-8888-8888-888888888888', 'aaa22222-2222-2222-2222-222222222222', 'Ice 51', 'Long Neck', 9.00, '/images/ice-51-long.png', ARRAY['Long Neck'], 10);

-- =============================================
-- BEBIDAS - AGUAS
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000012-0012-0012-0012-000000000001', '88888888-8888-8888-8888-888888888888', 'aaa33333-3333-3333-3333-333333333333', 'Agua Mineral sem Gas', 'Garrafa', 3.00, '/images/aguasemgas.png', ARRAY['Garrafa'], 1),
  ('p0000012-0012-0012-0012-000000000002', '88888888-8888-8888-8888-888888888888', 'aaa33333-3333-3333-3333-333333333333', 'Agua Mineral com Gas', 'Garrafa', 4.00, '/images/aguacomgas.png', ARRAY['Garrafa'], 2),
  ('p0000012-0012-0012-0012-000000000003', '88888888-8888-8888-8888-888888888888', 'aaa33333-3333-3333-3333-333333333333', 'Agua Tonica', 'Garrafa', 6.00, '/images/agua-tonica.png', ARRAY['Garrafa'], 3),
  ('p0000012-0012-0012-0012-000000000004', '88888888-8888-8888-8888-888888888888', 'aaa33333-3333-3333-3333-333333333333', 'H2O', 'Agua Saborizada', 7.50, '/images/h2o.png', ARRAY['Garrafa'], 4);

-- =============================================
-- BEBIDAS - SUCOS
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000013-0013-0013-0013-000000000001', '88888888-8888-8888-8888-888888888888', 'aaa44444-4444-4444-4444-444444444444', 'Suco Del Valle', 'Lata', 7.00, '/images/suco-delvalle-lata.png', ARRAY['Caixa'], 1);

-- =============================================
-- BEBIDAS - ENERGETICOS
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000014-0014-0014-0014-000000000001', '88888888-8888-8888-8888-888888888888', 'aaa55555-5555-5555-5555-555555555555', 'Red Bull', 'Lata', 15.00, '/images/redbull.jpg', ARRAY['Lata'], 1),
  ('p0000014-0014-0014-0014-000000000002', '88888888-8888-8888-8888-888888888888', 'aaa55555-5555-5555-5555-555555555555', 'Monster', 'Lata', 12.00, '/images/monster.jpg', ARRAY['Lata'], 2);

-- =============================================
-- BEBIDAS - REFRIGERANTES
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, image_url, ingredients, display_order) VALUES
  ('p0000015-0015-0015-0015-000000000001', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Coca-Cola Lata', 'Lata', 6.00, '/images/cocalata.jpg', ARRAY['Lata'], 1),
  ('p0000015-0015-0015-0015-000000000002', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Coca-Cola Zero Lata', 'Lata', 6.00, '/images/cocazero-lata.jpg', ARRAY['Lata'], 2),
  ('p0000015-0015-0015-0015-000000000003', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Guarana Lata', 'Lata', 6.00, '/images/guarana-lata.jpg', ARRAY['Lata'], 3),
  ('p0000015-0015-0015-0015-000000000004', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Sprite Lata', 'Lata', 6.00, '/images/sprite-lata.jpg', ARRAY['Lata'], 4),
  ('p0000015-0015-0015-0015-000000000005', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Schweppes Lata', 'Lata', 6.00, '/images/Schweppes-lata.png', ARRAY['Lata'], 5),
  ('p0000015-0015-0015-0015-000000000006', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Fanta Laranja Lata', 'Lata', 6.00, '/images/fantalaranja-lata.jpg', ARRAY['Lata'], 6),
  ('p0000015-0015-0015-0015-000000000007', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Fanta Uva Lata', 'Lata', 6.00, '/images/fantauva-lata.jpg', ARRAY['Lata'], 7),
  ('p0000015-0015-0015-0015-000000000008', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Coca-Cola 290ml', 'Garrafa', 5.00, '/images/coca-290.png', ARRAY['290ml'], 8),
  ('p0000015-0015-0015-0015-000000000009', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Coca-Cola 600ml', 'Garrafa', 8.00, '/images/coca600.jpg', ARRAY['600ml'], 9),
  ('p0000015-0015-0015-0015-000000000010', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Guarana 600ml', 'Garrafa', 8.00, '/images/guarana600.jpg', ARRAY['600ml'], 10),
  ('p0000015-0015-0015-0015-000000000011', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Sprite 600ml', 'Garrafa', 8.00, '/images/sprite600.jpg', ARRAY['600ml'], 11),
  ('p0000015-0015-0015-0015-000000000012', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Coca-Cola 1L', 'Garrafa', 10.00, '/images/coca1l.png', ARRAY['1 Litro'], 12),
  ('p0000015-0015-0015-0015-000000000013', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Guarana 1L', 'Garrafa', 10.00, '/images/guarana1l.png', ARRAY['1 Litro'], 13),
  ('p0000015-0015-0015-0015-000000000014', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Coca-Cola 2L', 'Garrafa', 15.00, '/images/coca2l.jpg', ARRAY['2 Litros'], 14),
  ('p0000015-0015-0015-0015-000000000015', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Sprite 2L', 'Garrafa', 12.00, '/images/sprite2l.jpg', ARRAY['2 Litros'], 15),
  ('p0000015-0015-0015-0015-000000000016', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Fanta Laranja 2L', 'Garrafa', 12.00, '/images/fanta-laranja2l.jpg', ARRAY['2 Litros'], 16),
  ('p0000015-0015-0015-0015-000000000017', '88888888-8888-8888-8888-888888888888', 'aaa66666-6666-6666-6666-666666666666', 'Guarana 2L', 'Garrafa', 12.00, '/images/guarana2l.jpg', ARRAY['2 Litros'], 17);

-- =============================================
-- RELACIONAR BURGUERES COM ADD-ONS
-- =============================================
INSERT INTO product_addons (product_id, addon_id)
SELECT p.id, a.id 
FROM products p
CROSS JOIN addons a
WHERE p.category_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');

-- =============================================
-- CONFIGURACOES INICIAIS DA LOJA
-- =============================================
INSERT INTO store_settings (key, value) VALUES
  ('store_name', 'Capitao Burguer'),
  ('store_phone', '(11) 99999-9999'),
  ('delivery_fee', '5.00'),
  ('min_order_value', '20.00'),
  ('opening_hours', '18:00 - 23:00'),
  ('whatsapp_number', '5511999999999'),
  ('is_open', 'true');
