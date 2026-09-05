import pg from "pg"

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 8000,
})

const SCHEMA = "capitao_burguer"

try {
  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name`,
    [SCHEMA]
  )
  console.log("TABLES:", tables.rows.map((r) => r.table_name).join(", "))

  for (const { table_name } of tables.rows) {
    const cols = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position`,
      [SCHEMA, table_name]
    )
    console.log(`\n== ${table_name} ==`)
    console.log(cols.rows.map((c) => `${c.column_name}:${c.data_type}`).join(", "))
  }

  // sample products
  console.log("\n\n=== SAMPLE products ===")
  const p = await pool.query(`SELECT * FROM ${SCHEMA}.products LIMIT 5`)
  console.log(JSON.stringify(p.rows, null, 2))
} catch (e) {
  console.error("ERR:", e.message)
} finally {
  await pool.end()
}
