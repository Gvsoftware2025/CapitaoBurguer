import { NextResponse } from "next/server"
import { query } from "@/lib/db"

const SCHEMA = "capitao_burguer"

// GET - Buscar cardapio completo (produtos, maioneses, adicionais, variacoes)
export async function GET() {
  try {
    // Buscar produtos ativos
    const products = await query(
      `SELECT 
        id, name, description, price, category, image_url, is_available,
        has_maionese_option, has_variation
       FROM ${SCHEMA}.products 
       WHERE is_available = true 
       ORDER BY category, name`
    )

    // Buscar variacoes de produtos
    const variations = await query(
      `SELECT id, product_id, name, price 
       FROM ${SCHEMA}.product_variations 
       ORDER BY product_id, price`
    )

    // Buscar maioneses ativas
    const maioneses = await query(
      `SELECT id, name, price, is_available 
       FROM ${SCHEMA}.maioneses 
       WHERE is_available = true 
       ORDER BY name`
    )

    // Buscar adicionais ativos
    const addons = await query(
      `SELECT id, name, price, is_available 
       FROM ${SCHEMA}.addons 
       WHERE is_available = true 
       ORDER BY name`
    )

    return NextResponse.json({
      success: true,
      data: {
        products: products || [],
        variations: variations || [],
        maioneses: maioneses || [],
        addons: addons || []
      }
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar cardapio:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar cardapio" },
      { status: 500 }
    )
  }
}
