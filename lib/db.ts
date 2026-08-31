import { Pool, PoolClient } from 'pg'

// Singleton global para evitar multiplos pools em serverless
declare global {
  var pgPool: Pool | undefined
}

// Pool de conexao com o PostgreSQL (singleton)
const pool = global.pgPool || new Pool({
  host: process.env.DB_HOST || '76.13.164.193',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  // DB_PASS tem prioridade (contorna problema de truncamento no DB_PASSWORD antigo)
  password: process.env.DB_PASS || process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 6000,
  // Evita que uma unica query lenta trave a requisicao por muito tempo.
  statement_timeout: 8000,
  query_timeout: 8000,
  keepAlive: true,
  allowExitOnIdle: true,
})

// Manter referencia global em dev
if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool
}

// Schema do Capitao Burguer
export const SCHEMA = 'capitao_burguer'

// Testar conexao
pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL', err)
})

// Funcao com retry para lidar com conexoes perdidas
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error: unknown) {
      const isConnectionError = error instanceof Error && 
        (error.message.includes('ECONNRESET') || 
         error.message.includes('ETIMEDOUT') ||
         error.message.includes('Connection terminated'))
      
      if (isConnectionError && i < retries - 1) {
        console.log(`[v0] Tentativa ${i + 1} falhou, reconectando...`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        continue
      }
      throw error
    }
  }
  throw new Error('Maximo de tentativas excedido')
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  return withRetry(async () => {
    const client = await pool.connect()
    try {
      const result = await client.query(text, params)
      return result.rows as T[]
    } finally {
      client.release()
    }
  })
}

export async function queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}

/**
 * Executa varias queries em UMA unica conexao dentro de uma transacao.
 * Reduz drasticamente o numero de conexoes abertas (fundamental para o
 * servidor externo, que e lento/instavel) e garante atomicidade: ou o
 * pedido inteiro (com todos os itens) e salvo, ou nada e salvo.
 */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  return withRetry(async () => {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const result = await fn(client)
      await client.query('COMMIT')
      return result
    } catch (error) {
      try {
        await client.query('ROLLBACK')
      } catch {
        // ignora erro de rollback
      }
      throw error
    } finally {
      client.release()
    }
  })
}

export { pool }
