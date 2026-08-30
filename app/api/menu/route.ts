import { NextResponse } from "next/server"
import { query } from "@/lib/db"

const SCHEMA = "capitao_burguer"

// Categorias que exigem escolha de maionese e permitem acrescimos (lanches).
// A regra e derivada do nome da categoria porque o banco nao guarda esse flag.
function isLancheCategory(name: string) {
  const upper = (name || "").toUpperCase()
  return upper.includes("BURGUER") || upper.includes("LANCHE")
}

interface DbProduct {
  id: number
  category_id: number
  name: string
  description: string | null
  price: string
  image_url: string | null
}
interface DbVariation {
  id: number
  product_id: number
  name: string
  price: string
}
interface DbOption {
  id: number
  product_id: number
  option_group: string
  option_name: string
}
interface DbCategory {
  id: number
  name: string
}

// GET - Monta o cardapio completo a partir do banco (categorias -> produtos)
export async function GET() {
  try {
    const [categories, products, variations, options, maioneses, addons] = await Promise.all([
      query<DbCategory>(
        `SELECT id, name FROM ${SCHEMA}.categories WHERE is_active = true ORDER BY display_order, id`
      ),
      query<DbProduct>(
        `SELECT id, category_id, name, description, price, image_url
         FROM ${SCHEMA}.products
         WHERE is_available = true
         ORDER BY category_id, display_order, name`
      ),
      query<DbVariation>(
        `SELECT id, product_id, name, price
         FROM ${SCHEMA}.product_variations
         WHERE is_available = true
         ORDER BY product_id, price`
      ),
      query<DbOption>(
        `SELECT id, product_id, option_group, option_name
         FROM ${SCHEMA}.product_options
         WHERE is_available = true
         ORDER BY product_id, display_order, id`
      ),
      query(
        `SELECT id, name, price FROM ${SCHEMA}.maioneses WHERE is_available = true ORDER BY name`
      ),
      query(
        `SELECT id, name, price FROM ${SCHEMA}.addons WHERE is_available = true ORDER BY name`
      ),
    ])

    // Indexa variacoes por produto
    const variationsByProduct = new Map<number, { id: string; name: string; price: number }[]>()
    for (const v of variations) {
      const list = variationsByProduct.get(v.product_id) || []
      list.push({ id: `var${v.id}`, name: v.name, price: Number(v.price) })
      variationsByProduct.set(v.product_id, list)
    }

    // Indexa opcoes (combo choices) por produto, agrupadas por option_group
    const optionsByProduct = new Map<
      number,
      { id: string; label: string; options: { id: string; name: string }[] }[]
    >()
    for (const o of options) {
      const groups = optionsByProduct.get(o.product_id) || []
      let group = groups.find((g) => g.label === o.option_group)
      if (!group) {
        group = { id: `grp${o.product_id}-${groups.length}`, label: o.option_group, options: [] }
        groups.push(group)
      }
      group.options.push({ id: `opt${o.id}`, name: o.option_name })
      optionsByProduct.set(o.product_id, groups)
    }

    // Monta as categorias com seus itens
    const menuCategories = categories.map((cat) => {
      const requiresMaionese = isLancheCategory(cat.name)
      const items = products
        .filter((p) => p.category_id === cat.id)
        .map((p) => {
          const comboChoices = optionsByProduct.get(p.id)
          return {
            id: `prod${p.id}`,
            name: p.name,
            description: p.description || "",
            price: Number(p.price),
            image: p.image_url || "",
            ingredients: [] as string[],
            addOns: [] as { id: string; name: string; price: number }[],
            variations: variationsByProduct.get(p.id),
            comboChoices: comboChoices && comboChoices.length > 0 ? comboChoices : undefined,
            requiresMaionese,
            allowsAddons: requiresMaionese,
          }
        })
      return {
        key: `cat${cat.id}`,
        label: cat.name,
        items,
      }
    })
    // Nao mostra categorias vazias
    .filter((c) => c.items.length > 0)

    return NextResponse.json({
      success: true,
      data: {
        categories: menuCategories,
        maioneses: maioneses || [],
        addons: addons || [],
      },
    })
  } catch (error) {
    console.error("Erro ao buscar cardapio:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar cardapio" },
      { status: 500 }
    )
  }
}
