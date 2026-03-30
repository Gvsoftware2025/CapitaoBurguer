-- Inserir admin padrao
-- Usuario: admin
-- Senha: capitao2024 (em producao, usar hash bcrypt)
INSERT INTO admins (username, password_hash) 
VALUES ('admin', 'capitao2024')
ON CONFLICT (username) DO UPDATE SET password_hash = 'capitao2024';
