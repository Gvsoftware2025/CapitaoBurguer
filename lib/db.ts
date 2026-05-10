import { Pool } from 'pg'

// Pool de conexao com o PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || '168.231.93.220',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'gvsoftware',
  user: process.env.DB_USER || 'gvuser',
  password: process.env.DB_PASSWORD || '153045',
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Schema do Capitao Burguer
export const SCHEMA = 'capitao_burguer'

// Testar conexao
pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL', err)
})

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

export async function queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}

export { pool }
