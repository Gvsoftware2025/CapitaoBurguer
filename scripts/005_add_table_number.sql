-- Adicionar coluna table_number na tabela orders
ALTER TABLE capitao_burguer.orders 
ADD COLUMN IF NOT EXISTS table_number INT;

-- Atualizar constraint de delivery_type para incluir 'mesa'
ALTER TABLE capitao_burguer.orders 
DROP CONSTRAINT IF EXISTS orders_delivery_type_check;

ALTER TABLE capitao_burguer.orders 
ADD CONSTRAINT orders_delivery_type_check 
CHECK (delivery_type IN ('retirar', 'entregar', 'mesa'));

-- Criar indice para buscar pedidos por mesa
CREATE INDEX IF NOT EXISTS idx_orders_table_number ON capitao_burguer.orders(table_number);
