-- Seed inicial das categorias
INSERT INTO categories (name, slug, display_order) VALUES
('Burgueres', 'burgueres', 1),
('Super Burgueres', 'super_burgueres', 2),
('Porcoes', 'porcoes', 3),
('Bebidas', 'bebidas', 4),
('Combos e Barcas', 'combos', 5),
('Espetos', 'espetos', 6),
('Jantinha', 'jantinha', 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed inicial das maioneses (ja inseridas na migration 001)
