import { NextResponse } from "next/server"
import { query, SCHEMA } from "@/lib/db"

// O cardapio deve refletir sempre o estado atual do banco de gestao.
export const dynamic = "force-dynamic"

// Mapeia o nome da categoria no banco para a chave interna usada no cardapio.
const CATEGORY_KEY: Record<string, string> = {
  BURGUERES: "burgueres",
  "SUPER BURGUERES": "super_burgueres",
  "LANCHES TRADICIONAIS": "lanches_tradicionais",
  PASTEL: "pastel",
  PORCOES: "porcoes",
  "COMBOS E BARCAS": "combos",
  ESPETOS: "espetos",
  JANTINHA: "jantinha",
  DIVERSOS: "diversos",
  BEBIDAS: "bebidas",
}

interface ProductRow {
  id: number
  name: string
  description: string | null
  price: string
  image_url: string | null
  category_name: string
}
interface VariationRow {
  id: number
  product_id: number
  name: string
  price: string
}
interface OptionRow {
  id: number
  product_id: number
  option_group: string
  option_name: string
  display_order: number
}

const toTitle = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

// GET - Cardapio completo direto do banco (produtos agrupados por categoria,
// com variacoes e opcoes, alem de maioneses e adicionais)
export async function GET() {
  try {
    const [products, variations, options, maioneses, addons] = await Promise.all([
      query<ProductRow>(
        `SELECT p.id, p.name, p.description, p.price, p.image_url, c.name AS category_name
         FROM ${SCHEMA}.products p
         JOIN ${SCHEMA}.categories c ON c.id = p.category_id
         WHERE p.is_available = true AND c.is_active = true
         ORDER BY c.display_order, p.display_order, p.name`,
      ),
      query<VariationRow>(
        `SELECT id, product_id, name, price
         FROM ${SCHEMA}.product_variations
         WHERE is_available = true
         ORDER BY product_id, id`,
      ),
      query<OptionRow>(
        `SELECT id, product_id, option_group, option_name, display_order
         FROM ${SCHEMA}.product_options
         WHERE is_available = true
         ORDER BY product_id, option_group, display_order, id`,
      ),
      query(
        `SELECT id, name, price, is_available
         FROM ${SCHEMA}.maioneses
         WHERE is_available = true
         ORDER BY name`,
      ),
      query(
        `SELECT id, name, price, is_available
         FROM ${SCHEMA}.addons
         WHERE is_available = true
         ORDER BY name`,
      ),
    ])

    // Agrupa variacoes por produto
    const variationsByProduct = new Map<number, { id: string; name: string; price: number }[]>()
    for (const v of variations) {
      const arr = variationsByProduct.get(v.product_id) ?? []
      arr.push({ id: `var${v.id}`, name: v.name, price: Number(v.price) })
      variationsByProduct.set(v.product_id, arr)
    }

    // Agrupa opcoes por produto e por grupo (viram as "comboChoices")
    const optionsByProduct = new Map<number, Map<string, { id: string; name: string }[]>>()
    for (const o of options) {
      let groups = optionsByProduct.get(o.product_id)
      if (!groups) {
        groups = new Map()
        optionsByProduct.set(o.product_id, groups)
      }
      const arr = groups.get(o.option_group) ?? []
      arr.push({ id: `opt${o.id}`, name: o.option_name })
      groups.set(o.option_group, arr)
    }

    const grouped: Record<string, unknown[]> = {}
    for (const p of products) {
      const key = CATEGORY_KEY[p.category_name]
      if (!key) continue

      const variationsArr = variationsByProduct.get(p.id)
      const groups = optionsByProduct.get(p.id)
      const comboChoices = groups
        ? Array.from(groups.entries()).map(([group, opts]) => ({
            id: `cc-${p.id}-${group.replace(/\s+/g, "_").toLowerCase()}`,
            label: `${toTitle(group)}:`,
            options: opts,
          }))
        : undefined

      ;(grouped[key] ??= []).push({
        id: String(p.id),
        name: p.name,
        description: p.description ?? "",
        price: Number(p.price),
        image: p.image_url ?? "",
        variations: variationsArr && variationsArr.length ? variationsArr : undefined,
        comboChoices: comboChoices && comboChoices.length ? comboChoices : undefined,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        products: grouped,
        maioneses: maioneses ?? [],
        addons: addons ?? [],
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar cardapio:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar cardapio" }, { status: 500 })
  }
}
