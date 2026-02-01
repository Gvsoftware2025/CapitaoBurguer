-- Inserir admin padrao
-- Usuario: admin
-- Senha: capitao2024
INSERT INTO admins (username, password_hash) 
VALUES ('admin', 'capitao2024')
ON CONFLICT (username) DO NOTHING;
