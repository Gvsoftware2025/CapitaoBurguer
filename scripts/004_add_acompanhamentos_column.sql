-- =====================================================
-- MIGRACAO: Adicionar coluna acompanhamentos em order_items
-- =====================================================
-- Esta coluna armazena as opcoes especiais selecionadas nas barcas
-- Ex: "Batata com: Cheddar, Kibe: Catupiry"
-- =====================================================

-- Adicionar coluna acompanhamentos se nao existir
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS acompanhamentos VARCHAR(500);

-- Comentario para documentacao
COMMENT ON COLUMN order_items.acompanhamentos IS 'Opcoes especiais das barcas (ex: Batata com: Cheddar, Kibe: Catupiry)';
