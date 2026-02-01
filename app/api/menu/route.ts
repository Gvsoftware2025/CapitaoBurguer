import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Buscar categorias
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .order("display_order")

    if (catError) throw catError

    // Buscar produtos ativos
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("display_order")

    if (prodError) throw prodError

    // Buscar variacoes
    const { data: variations, error: varError } = await supabase
      .from("product_variations")
      .select("*")
      .order("display_order")

    if (varError) throw varError

    // Buscar addons
    const { data: addons, error: addError } = await supabase
      .from("addons")
      .select("*")
      .eq("active", true)
      .order("display_order")

    if (addError) throw addError

    // Buscar product_addons
    const { data: productAddons, error: paError } = await supabase
      .from("product_addons")
      .select("*")

    if (paError) throw paError

    // Buscar maioneses
    const { data: maioneses, error: maioError } = await supabase
      .from("maioneses")
      .select("*")
      .eq("active", true)
      .order("display_order")

    if (maioError) throw maioError

    // Organizar dados por categoria
    const menuData: Record<string, any[]> = {}
    
    categories?.forEach((cat) => {
      const categoryProducts = products?.filter(p => p.category_id === cat.id) || []
      
      menuData[cat.slug] = categoryProducts.map(product => {
        // Pegar variacoes do produto
        const productVariations = variations?.filter(v => v.product_id === product.id) || []
        
        // Pegar addons do produto
        const productAddonIds = productAddons?.filter(pa => pa.product_id === product.id).map(pa => pa.addon_id) || []
        const productAddonsList = addons?.filter(a => productAddonIds.includes(a.id)) || []

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image_url || "/images/burger-bacon.jpg",
          ingredients: product.ingredients || [],
          addOns: productAddonsList.map(a => ({
            id: a.id,
            name: a.name,
            price: a.price,
          })),
          variations: productVariations.map(v => ({
            id: v.id,
            name: v.name,
            price: v.price,
          })),
          subcategory: product.subcategory,
        }
      })
    })

    return NextResponse.json({ 
      success: true, 
      categories: categories?.map(c => ({ key: c.slug, label: c.name })) || [],
      menuData,
      maioneses: maioneses?.map(m => ({ id: m.id, name: m.name })) || [],
    })
  } catch (error) {
    console.error("Erro ao buscar menu:", error)
    return NextResponse.json({ success: false, error: "Erro ao buscar menu" }, { status: 500 })
  }
}
