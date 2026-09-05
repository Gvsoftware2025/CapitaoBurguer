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
const q = (t) => pool.query(t).then((r) => r.rows)

try {
  console.log("=== CATEGORIES ===")
  console.log(JSON.stringify(await q(`SELECT id, name, display_order, is_active FROM ${SCHEMA}.categories ORDER BY display_order, id`), null, 2))

  console.log("\n=== PRODUCT COUNT BY CATEGORY ===")
  console.log(JSON.stringify(await q(`SELECT c.name, count(p.id) FROM ${SCHEMA}.categories c LEFT JOIN ${SCHEMA}.products p ON p.category_id=c.id GROUP BY c.name ORDER BY c.name`), null, 2))

  console.log("\n=== PRODUCT_OPTIONS sample (groups) ===")
  console.log(JSON.stringify(await q(`SELECT product_id, option_group, option_name, display_order, is_available FROM ${SCHEMA}.product_options ORDER BY product_id, option_group, display_order LIMIT 30`), null, 2))

  console.log("\n=== product_options distinct groups ===")
  console.log(JSON.stringify(await q(`SELECT DISTINCT option_group, count(*) FROM ${SCHEMA}.product_options GROUP BY option_group`), null, 2))

  console.log("\n=== product_maioneses sample ===")
  console.log(JSON.stringify(await q(`SELECT * FROM ${SCHEMA}.product_maioneses LIMIT 10`), null, 2))

  console.log("\n=== product_addons sample ===")
  console.log(JSON.stringify(await q(`SELECT * FROM ${SCHEMA}.product_addons LIMIT 10`), null, 2))

  console.log("\n=== product_variations sample ===")
  console.log(JSON.stringify(await q(`SELECT * FROM ${SCHEMA}.product_variations LIMIT 10`), null, 2))

  console.log("\n=== maioneses ===")
  console.log(JSON.stringify(await q(`SELECT * FROM ${SCHEMA}.maioneses ORDER BY name`), null, 2))

  console.log("\n=== addons ===")
  console.log(JSON.stringify(await q(`SELECT * FROM ${SCHEMA}.addons ORDER BY name`), null, 2))

  console.log("\n=== store_config ===")
  console.log(JSON.stringify(await q(`SELECT key, value FROM ${SCHEMA}.store_config`), null, 2))
} catch (e) {
  console.error("ERR:", e.message)
} finally {
  await pool.end()
}
