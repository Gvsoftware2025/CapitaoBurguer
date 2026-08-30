"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import { CheckoutScreen, type OrderData } from "./checkout-screen"

interface MenuScreenProps {
  onBack: () => void
}

// A categoria agora e dinamica (vem do banco), entao usamos string.
type Category = string

interface AddOn {
  id: string
  name: string
  price: number
}

interface Variation {
  id: string
  name: string
  price: number
}

interface ComboChoiceOption {
  id: string
  name: string
}

interface ComboChoice {
  id: string
  label: string
  options: ComboChoiceOption[]
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  ingredients: string[]
  addOns: AddOn[]
  variations?: Variation[]
  subcategory?: string
  comboChoices?: ComboChoice[]
  requiresMaionese?: boolean
  allowsAddons?: boolean
}

// Estrutura de uma categoria do cardapio vinda do banco
interface MenuCategory {
  key: string
  label: string
  items: MenuItem[]
}

interface Maionese {
  id: string
  name: string
}

interface CartItem {
  item: MenuItem
  quantity: number
  selectedAddOns: { addOn: AddOn; quantity: number }[]
  selectedVariation?: Variation
  selectedMaionese?: Maionese
  extraMaioneses?: Maionese[]
  selectedComboChoices?: Record<string, ComboChoiceOption>
  totalPrice: number
}

// Fallback para maioneses caso a API falhe
const defaultMaioneses: Maionese[] = [
  { id: "maio1", name: "Maionese de Bacon" },
  { id: "maio2", name: "Maionese de Rucula" },
]

// Fallback para adicionais caso a API falhe
const defaultAddOns: AddOn[] = [
  { id: "add1", name: "Queijo Empanado", price: 12 },
  { id: "add2", name: "Hamburguer Extra", price: 9 },
  { id: "add3", name: "Bacon", price: 6 },
  { id: "add4", name: "Queijo", price: 6 },
  { id: "add5", name: "Catupiry", price: 6 },
  { id: "add6", name: "Cheddar", price: 6 },
  { id: "add7", name: "Ovo", price: 3 },
  { id: "add8", name: "Salada", price: 3 },
  { id: "add9", name: "Onions", price: 2 },
]


export function MenuScreen({ onBack }: MenuScreenProps) {
  const [menu, setMenu] = useState<MenuCategory[]>([])
  const [menuLoading, setMenuLoading] = useState(true)
  const [menuError, setMenuError] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>("")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({})
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null)
  const [selectedMaionese, setSelectedMaionese] = useState<Maionese | null>(null)
  const [extraMaioneses, setExtraMaioneses] = useState<Maionese[]>([])
  const [selectedComboChoices, setSelectedComboChoices] = useState<Record<string, ComboChoiceOption>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  
  // Dados dinamicos do banco de dados
  const [maionesesOptions, setMaionesesOptions] = useState<Maionese[]>(defaultMaioneses)
  const [addOnsOptions, setAddOnsOptions] = useState<AddOn[]>(defaultAddOns)
  
  // Buscar cardapio completo (produtos, categorias, maioneses e adicionais) do banco
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu')
        const data = await response.json()
        if (data.success) {
          // Cardapio (categorias + produtos)
          if (Array.isArray(data.data.categories)) {
            setMenu(data.data.categories)
            if (data.data.categories.length > 0) {
              setSelectedCategory((prev) => prev || data.data.categories[0].key)
            }
          }
          // Atualizar maioneses
          if (data.data.maioneses && data.data.maioneses.length > 0) {
            setMaionesesOptions(data.data.maioneses.map((m: { id: number; name: string }) => ({
              id: `maio${m.id}`,
              name: m.name
            })))
          }
          // Atualizar adicionais
          if (data.data.addons && data.data.addons.length > 0) {
            setAddOnsOptions(data.data.addons.map((a: { id: number; name: string; price: number }) => ({
              id: `add${a.id}`,
              name: a.name,
              price: Number(a.price)
            })))
          }
        } else {
          setMenuError(true)
        }
      } catch (error) {
        console.error('Erro ao buscar dados do cardapio:', error)
        setMenuError(true)
      } finally {
        setMenuLoading(false)
      }
    }
    fetchMenuData()
  }, [])

  // Itens da categoria selecionada
  const currentItems: MenuItem[] = menu.find((c) => c.key === selectedCategory)?.items || []

  // Subcategorias (se os itens da categoria tiverem esse campo)
  const hasSubcategories = currentItems.some((item) => item.subcategory)
  const availableSubcategories = hasSubcategories
    ? ["Todos", ...Array.from(new Set(currentItems.map(item => item.subcategory).filter(Boolean)))]
    : []

  const filteredItems = currentItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubcategory = !hasSubcategories || 
      selectedSubcategory === "Todos" || 
      item.subcategory === selectedSubcategory
    return matchesSearch && matchesSubcategory
  })

  // Lista de categorias para as abas
  const categories: { key: Category; label: string }[] = menu.map((c) => ({ key: c.key, label: c.label }))

const calculateItemTotal = () => {
  if (!selectedItem) return 0
  // Usa o preco da variacao selecionada ou o preco base do item
  const basePrice = selectedVariation ? selectedVariation.price : selectedItem.price
  let total = basePrice * itemQuantity
  Object.entries(selectedAddOns).forEach(([addOnId, qty]) => {
  const addOn = addOnsOptions.find((a) => a.id === addOnId)
  if (addOn && qty > 0) {
  total += addOn.price * qty
  }
  })
  // Adiciona R$2 por cada maionese extra
  total += extraMaioneses.length * 2
  return total
  }
  
  // Verifica se o item eh um lanche (exige escolha de maionese)
  const isLanche = (item: MenuItem) => !!item.requiresMaionese

  const handleAddOnChange = (addOnId: string, change: number) => {
    setSelectedAddOns((prev) => {
      const current = prev[addOnId] || 0
      const newValue = Math.max(0, current + change)
      return { ...prev, [addOnId]: newValue }
    })
  }

const handleAddToCart = () => {
  if (!selectedItem) return
  
  // Se o item tem variacoes e nenhuma foi selecionada, nao adiciona
  if (selectedItem.variations && selectedItem.variations.length > 0 && !selectedVariation) {
  return
  }
  
  // Se eh lanche e nao selecionou maionese, nao adiciona
  if (isLanche(selectedItem) && !selectedMaionese) {
  return
  }

  // Se o item tem comboChoices e nem todas foram selecionadas, nao adiciona
  if (selectedItem.comboChoices && selectedItem.comboChoices.length > 0) {
    const allChosen = selectedItem.comboChoices.every(choice => selectedComboChoices[choice.id])
    if (!allChosen) return
  }
  
  const addOnsWithQuantity = Object.entries(selectedAddOns)
  .filter(([_, qty]) => qty > 0)
  .map(([addOnId, qty]) => ({
  addOn: addOnsOptions.find((a) => a.id === addOnId)!,
  quantity: qty,
  }))
  
  const cartItem: CartItem = {
  item: selectedItem,
  quantity: itemQuantity,
  selectedAddOns: addOnsWithQuantity,
  selectedVariation: selectedVariation || undefined,
  selectedMaionese: selectedMaionese || undefined,
  extraMaioneses: extraMaioneses.length > 0 ? [...extraMaioneses] : undefined,
  selectedComboChoices: Object.keys(selectedComboChoices).length > 0 ? { ...selectedComboChoices } : undefined,
  totalPrice: calculateItemTotal(),
  }
  
  setCart((prev) => [...prev, cartItem])
  setSelectedItem(null)
  setItemQuantity(1)
  setSelectedAddOns({})
  setSelectedVariation(null)
  setSelectedMaionese(null)
  setExtraMaioneses([])
  setSelectedComboChoices({})
  setShowCart(true)
  }

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleGoToCheckout = () => {
    setShowCart(false)
    setShowCheckout(true)
  }

  const handleConfirmOrder = async (orderData: OrderData) => {
    const deliveryFee = orderData.deliveryType === "entregar" ? 2 : 0
    const finalTotal = cartTotal + deliveryFee
    const isMesa = orderData.deliveryType === "mesa"

    // Abre UMA janela imediatamente, ainda dentro do gesto de clique.
    // Isso evita o bloqueio/lentidao de pop-up no mobile: reutilizamos essa
    // mesma aba tanto para o WhatsApp (pedidos normais) quanto para a via de
    // impressao (pedidos de mesa).
    const newWindow = window.open('', '_blank')

    // Monta a mensagem do WhatsApp de forma sincrona (os dados ja estao disponiveis).
    const message = buildWhatsappMessage(orderData, deliveryFee, finalTotal)

    // Para pedidos que NAO sao de mesa, abre o WhatsApp IMEDIATAMENTE, sem
    // esperar o banco. Assim o cliente nunca fica travado esperando.
    if (!isMesa && newWindow) {
      newWindow.location.href = `https://wa.me/5517997173099?text=${encodeURIComponent(message)}`
    }

    // Monta o payload e salva no banco. Para pedidos de mesa, o resultado é
    // usado para abrir a via de impressão; para os demais, o salvamento roda
    // em segundo plano (o WhatsApp já foi aberto).
    const orderPayload = {
      customerName: orderData.name || undefined,
      customerAddress: orderData.address || undefined,
      tableNumber: orderData.tableNumber || undefined,
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod,
      cashAmount: orderData.cashAmount,
      subtotal: cartTotal,
      deliveryFee: deliveryFee,
      total: finalTotal,
      items: cart.map((cartItem) => {
        // Formatar acompanhamentos das barcas (Batata com: X, Kibe: Y)
        let acompanhamentos: string | undefined = undefined
        if (cartItem.selectedComboChoices && Object.keys(cartItem.selectedComboChoices).length > 0) {
          acompanhamentos = Object.entries(cartItem.selectedComboChoices).map(([choiceId, option]) => {
            const choiceLabel = cartItem.item.comboChoices?.find(c => c.id === choiceId)?.label || ""
            return `${choiceLabel} ${option.name}`
          }).join(", ")
        }

        return {
          productId: cartItem.item.id,
          productName: cartItem.item.name,
          productPrice: cartItem.selectedVariation ? cartItem.selectedVariation.price : cartItem.item.price,
          quantity: cartItem.quantity,
          variationName: cartItem.selectedVariation?.name,
          variationPrice: cartItem.selectedVariation?.price,
          maionese: cartItem.selectedMaionese?.name,
          extraMaioneses: cartItem.extraMaioneses?.map(m => m.name),
          addons: cartItem.selectedAddOns.map(a => ({
            name: a.addOn.name,
            quantity: a.quantity,
            price: a.addOn.price
          })),
          acompanhamentos,
          itemTotal: cartItem.totalPrice
        }
      })
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
        keepalive: true,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || response.statusText || 'Não foi possível salvar o pedido')
      }

      // Pedido de mesa: usa a janela aberta no gesto para abrir a via de impressão.
      if (isMesa && result.orderId && newWindow) {
        newWindow.location.href = `/pedido/${result.orderId}/imprimir`
      }
    } catch (error) {
      console.error('Erro ao salvar pedido no banco:', error)
      // Se for mesa, a janela estava reservada para a impressão: fecha e avisa.
      // Para os demais, o WhatsApp já abriu, então não travamos o cliente.
      if (isMesa && newWindow) {
        newWindow.close()
        alert('Não foi possível finalizar o pedido agora. Verifique sua conexão e tente novamente.')
        return
      }
    }

    // Limpar carrinho apos finalizar
    setCart([])
    setShowCheckout(false)
  }

  const buildWhatsappMessage = (orderData: OrderData, deliveryFee: number, finalTotal: number) => {
    // Montar mensagem WhatsApp
    let message = `*CAPITAO BURGUER*\n`
    message += `Novo pedido recebido!\n\n`
    
    // Cliente e entrega em uma linha
    if (orderData.name) {
      message += `*Cliente:* ${orderData.name}\n`
    }
    if (orderData.deliveryType === "retirar") {
      message += `*Retirada no local*\n\n`
    } else if (orderData.deliveryType === "mesa") {
      message += `*MESA ${orderData.tableNumber}* - Comer no local\n\n`
    } else {
      message += `*Entregar em:* ${orderData.address || "A combinar"}\n\n`
    }
    
    // Itens do pedido - formato compacto
    message += `*Pedido:*\n`
    cart.forEach((cartItem) => {
      // Usar preco da variacao se existir, senao usa preco do item
      const itemPrice = cartItem.selectedVariation ? cartItem.selectedVariation.price : cartItem.item.price
      const itemTotal = itemPrice * cartItem.quantity
      
      // Incluir nome da variacao no nome do item (ex: "Batata Frita (Meia)")
      let itemName = cartItem.item.name
      if (cartItem.selectedVariation) {
        itemName += ` (${cartItem.selectedVariation.name})`
      }
      message += `> ${cartItem.quantity}x ${itemName} - R$${itemTotal.toFixed(2)}\n`
      
      // Detalhes em linha unica
      const detalhes: string[] = []
      if (cartItem.selectedMaionese) {
        detalhes.push(cartItem.selectedMaionese.name)
      }
      if (cartItem.extraMaioneses && cartItem.extraMaioneses.length > 0) {
        detalhes.push(...cartItem.extraMaioneses.map(m => m.name))
      }
      if (detalhes.length > 0) {
        message += `   _${detalhes.join(", ")}_\n`
      }
      if (cartItem.selectedComboChoices && Object.keys(cartItem.selectedComboChoices).length > 0) {
        const choicesText = Object.entries(cartItem.selectedComboChoices).map(([choiceId, option]) => {
          const choiceLabel = cartItem.item.comboChoices?.find(c => c.id === choiceId)?.label || ""
          return `${choiceLabel} ${option.name}`
        }).join(", ")
        message += `   _${choicesText}_\n`
      }
      if (cartItem.selectedAddOns.length > 0) {
        const addonsText = cartItem.selectedAddOns.map(a => `${a.quantity}x ${a.addOn.name}`).join(", ")
        message += `   +${addonsText}\n`
      }
    })
    
    // Totais
    message += `\n*Subtotal:* R$${cartTotal.toFixed(2)}\n`
    if (deliveryFee > 0) {
      message += `*Taxa entrega:* R$${deliveryFee.toFixed(2)}\n`
    }
    message += `*TOTAL: R$${finalTotal.toFixed(2)}*\n\n`
    
    // Pagamento
    const paymentLabel = orderData.paymentMethod === "cartao" ? "Cartao" : orderData.paymentMethod === "pix" ? "PIX na maquininha" : "Dinheiro"
    message += `*Pagamento:* ${paymentLabel}`
    
    if (orderData.paymentMethod === "dinheiro" && orderData.cashAmount) {
      const troco = orderData.cashAmount - finalTotal
      if (troco > 0) {
        message += ` (Troco p/ R$${orderData.cashAmount.toFixed(2)})`
      }
    }

    return message
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/images/pirate-wood-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#1a0f08'
      }}
    >
      {/* Dark overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/50" />
      {/* Vignette effect */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 200px rgba(0,0,0,0.9)' }} />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-[#1a0f08] via-[#1a0f08]/98 to-transparent backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-700/40">
          <button
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-b from-amber-800/60 to-amber-900/80 text-amber-100 hover:from-amber-700/70 hover:to-amber-800/90 transition-all border border-amber-600/30 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-2xl font-bold text-amber-100 tracking-widest" style={{ fontFamily: "serif", textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(255,180,50,0.3)' }}>
            Cardapio
          </h1>

          <button
            onClick={() => setShowCart(true)}
            className="relative w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-b from-amber-500 to-amber-700 text-white hover:from-amber-400 hover:to-amber-600 transition-all shadow-lg border border-amber-400/30"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
            <input
              type="text"
              placeholder="Pesquisar item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gradient-to-b from-[#2a1a10]/90 to-[#1f150a]/95 border-2 border-amber-700/50 rounded-2xl py-3 pl-12 pr-4 text-amber-100 placeholder-amber-600 focus:outline-none focus:border-amber-500 transition-all shadow-inner backdrop-blur-sm"
              style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setSelectedCategory(cat.key); setSelectedSubcategory("Todos"); }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.key
                    ? "bg-gradient-to-b from-amber-500 to-amber-700 text-white shadow-lg border border-amber-400/50"
                    : "bg-gradient-to-b from-[#2a1a10]/90 to-[#1f150a]/95 text-amber-400 border-2 border-amber-800/50 hover:border-amber-600/60 hover:text-amber-300"
                }`}
                style={selectedCategory === cat.key ? { boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' } : {}}
              >
                {cat.label}
              </button>
            ))}
</div>
  </div>
  </div>

  {/* Subcategories bar (quando a categoria tem subcategorias) */}
  {hasSubcategories && (
    <div className="px-4 pb-3 overflow-x-auto scrollbar-hide relative z-10">
      <div className="flex gap-2">
        {availableSubcategories.map((subcat) => (
          <button
            key={subcat}
            onClick={() => setSelectedSubcategory(subcat || "Todos")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
              selectedSubcategory === subcat
                ? "bg-gradient-to-b from-green-600 to-green-800 text-white shadow-md border border-green-500/50"
                : "bg-[#1a0f08]/80 text-amber-300 border border-amber-900/50 hover:border-amber-700/60 hover:text-amber-200"
            }`}
          >
            {subcat}
          </button>
        ))}
      </div>
    </div>
  )}
  
  {/* Menu items - responsive grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
  <div className="px-3 py-4 relative z-10 max-w-6xl mx-auto">
  {menuLoading ? (
    <div className="py-20 text-center text-amber-300 font-semibold">Carregando cardapio...</div>
  ) : menuError ? (
    <div className="py-20 text-center text-red-400 font-semibold">
      Nao foi possivel carregar o cardapio. Tente novamente em instantes.
    </div>
  ) : filteredItems.length === 0 ? (
    <div className="py-20 text-center text-amber-400/80 font-semibold">Nenhum item encontrado.</div>
  ) : hasSubcategories && selectedSubcategory === "Todos" ? (
  // Mostra todos agrupados por subcategoria
          <>
            {Array.from(new Set(filteredItems.map(item => item.subcategory))).map((subcategory) => (
              <div key={subcategory} className="mb-6">
                <h2 className="text-amber-400 font-bold text-lg mb-3 border-b border-amber-700/50 pb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {subcategory}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredItems.filter(item => item.subcategory === subcategory).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item)
                        setItemQuantity(1)
                        setSelectedAddOns({})
                      }}
                      className="group bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-2xl overflow-hidden border-2 border-amber-700/40 hover:border-amber-500/80 transition-all duration-300 text-left shadow-lg hover:shadow-amber-900/50 hover:scale-[1.02] backdrop-blur-sm"
                      style={{
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,200,100,0.1)'
                      }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {item.variations && item.variations.length > 0 ? (
                          <div className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-700 to-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg border border-amber-500/30"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                            {'Ver opcoes'}
                          </div>
                        ) : (
                          <div className="absolute bottom-2 right-2 bg-gradient-to-r from-red-700 to-red-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg border border-red-500/30"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                            {'R$ '}{item.price.toFixed(2)}
                          </div>
                        )}
                        <div className="absolute top-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-amber-200/70">
                          Img. ilustrativa
                        </div>
                      </div>
                      <div className="p-3 border-t border-amber-800/30">
                        <h3 className="text-amber-100 font-bold text-sm mb-1 group-hover:text-amber-300 transition-colors" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                          {item.name.toUpperCase()}
                        </h3>
                        <p className="text-amber-500/80 text-xs line-clamp-2">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          // Outras categorias - grid normal
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item)
                  setItemQuantity(1)
                  setSelectedAddOns({})
                }}
                className="group bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-2xl overflow-hidden border-2 border-amber-700/40 hover:border-amber-500/80 transition-all duration-300 text-left shadow-lg hover:shadow-amber-900/50 hover:scale-[1.02] backdrop-blur-sm"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,200,100,0.1)'
                }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {item.variations && item.variations.length > 0 ? (
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-700 to-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg border border-amber-500/30"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {'Ver opcoes'}
                    </div>
                  ) : (
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-red-700 to-red-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg border border-red-500/30"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {'R$ '}{item.price.toFixed(2)}
                    </div>
                  )}
                  <div className="absolute top-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-amber-200/70">
                    Img. ilustrativa
                  </div>
                </div>
                <div className="p-3 border-t border-amber-800/30">
                  <h3 className="text-amber-100 font-bold text-sm mb-1 group-hover:text-amber-300 transition-colors" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    {item.name.toUpperCase()}
                  </h3>
                  <p className="text-amber-500/80 text-xs line-clamp-2">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
          <div className="w-full max-w-lg bg-[#1a0f08] rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Product Image */}
            <div className="relative h-64 w-full">
              <Image src={selectedItem.image || "/placeholder.svg"} alt={selectedItem.name} fill className="object-cover" />
              <button
                onClick={() => { setSelectedItem(null); setSelectedComboChoices({}); }}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              {/* Aviso imagem ilustrativa */}
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] text-amber-200/80">
                Imagem ilustrativa
              </div>
            </div>

            <div className="p-5">
              {/* Product Info */}
              <div className="border-b border-amber-900/30 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-amber-100 mb-2">{selectedItem.name.toUpperCase()}</h2>
                <p className="text-amber-600 text-sm mb-4">{selectedItem.description}</p>

                {/* Ingredients */}
                {selectedItem.ingredients.length > 0 && (
                  <div className="mb-3">
                    <p className="text-amber-400 text-xs mb-2 font-semibold">Ingredientes:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="bg-[#2a1a10] border border-amber-900/50 text-amber-300 px-3 py-1 rounded-full text-xs"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-2xl font-bold text-green-500">
                  R$ {selectedVariation ? selectedVariation.price.toFixed(2) : selectedItem.price.toFixed(2)}
                </p>
              </div>

              {/* Variations */}
              {selectedItem.variations && selectedItem.variations.length > 0 && (
                <div className="border-b border-amber-900/30 pb-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-amber-100 font-bold">ESCOLHA UMA OPCAO</h3>
                    <span className="text-red-500 text-xs font-bold">* Obrigatorio</span>
                  </div>

                  <div className="space-y-2">
                    {selectedItem.variations.map((variation) => (
                      <button
                        key={variation.id}
                        onClick={() => setSelectedVariation(variation)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedVariation?.id === variation.id
                            ? "bg-green-900/30 border-green-500"
                            : "bg-[#2a1a10] border-amber-900/30 hover:border-amber-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedVariation?.id === variation.id
                                ? "border-green-500 bg-green-500"
                                : "border-amber-600"
                            }`}
                          >
                            {selectedVariation?.id === variation.id && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-amber-100 font-medium">{variation.name}</span>
                        </div>
                        <span className="text-green-500 font-bold">R$ {variation.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
</div>
  )}

  {/* Combo Choices - para barcas */}
  {selectedItem.comboChoices && selectedItem.comboChoices.length > 0 && (
    <div className="border-b border-amber-900/30 pb-4 mb-4">
      {selectedItem.comboChoices.map((choice) => (
        <div key={choice.id} className="mb-4 last:mb-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-amber-100 font-bold">{choice.label.toUpperCase()}</h3>
            <span className="text-red-500 text-xs font-bold">* Obrigatorio</span>
          </div>
          <div className="space-y-2">
            {choice.options.map((option) => (
              <button
                key={`${choice.id}-${option.id}`}
                onClick={() => setSelectedComboChoices(prev => ({ ...prev, [choice.id]: option }))}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedComboChoices[choice.id]?.id === option.id
                    ? "bg-green-900/30 border-green-500"
                    : "bg-[#2a1a10] border-amber-900/30 hover:border-amber-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedComboChoices[choice.id]?.id === option.id
                      ? "border-green-500 bg-green-500"
                      : "border-amber-600"
                  }`}
                >
                  {selectedComboChoices[choice.id]?.id === option.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-amber-100 font-medium">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Maioneses - apenas para lanches */}
  {isLanche(selectedItem) && (
  <div className="border-b border-amber-900/30 pb-4 mb-4">
  <div className="flex items-center justify-between mb-3">
  <h3 className="text-amber-100 font-bold">ESCOLHA SUA MAIONESE</h3>
  <span className="text-red-500 text-xs font-bold">* Obrigatorio</span>
  </div>
  
  <div className="space-y-2">
  {maionesesOptions.filter(m => !m.name.toLowerCase().includes('picles')).map((maio) => (
  <button
  key={maio.id}
  onClick={() => setSelectedMaionese(maio)}
  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
  selectedMaionese?.id === maio.id
  ? "bg-green-900/30 border-green-500"
  : "bg-[#2a1a10] border-amber-900/30 hover:border-amber-700"
  }`}
  >
  <div className="flex items-center gap-3">
  <div
  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
  selectedMaionese?.id === maio.id
  ? "border-green-500 bg-green-500"
  : "border-amber-600"
  }`}
  >
  {selectedMaionese?.id === maio.id && (
  <div className="w-2 h-2 rounded-full bg-white" />
  )}
  </div>
  <span className="text-amber-100 font-medium">{maio.name}</span>
  </div>
  <span className="text-green-500 font-bold">Gratis</span>
  </button>
  ))}
  </div>

  {/* Maioneses Extras */}
  <div className="mt-4 pt-4 border-t border-amber-900/20">
  <div className="flex items-center justify-between mb-3">
  <h4 className="text-amber-100 font-semibold text-sm">MAIONESE EXTRA</h4>
  <span className="text-amber-500 text-xs">+R$ 2,00 cada</span>
  </div>
  <div className="space-y-2">
  {maionesesOptions.filter(m => !m.name.toLowerCase().includes('picles')).map((maio) => {
  const isSelected = extraMaioneses.some(m => m.id === maio.id)
  return (
  <button
  key={`extra-${maio.id}`}
  onClick={() => {
  if (isSelected) {
  setExtraMaioneses(prev => prev.filter(m => m.id !== maio.id))
  } else {
  setExtraMaioneses(prev => [...prev, maio])
  }
  }}
  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
  isSelected
  ? "bg-amber-900/30 border-amber-500"
  : "bg-[#2a1a10] border-amber-900/30 hover:border-amber-700"
  }`}
  >
  <div className="flex items-center gap-3">
  <div
  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
  isSelected
  ? "border-amber-500 bg-amber-500"
  : "border-amber-600"
  }`}
  >
  {isSelected && (
  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
  )}
  </div>
  <span className="text-amber-100 text-sm">{maio.name}</span>
  </div>
  <span className="text-amber-500 font-bold text-sm">+R$ 2,00</span>
  </button>
  )
  })}
  </div>
  </div>
  </div>
  )}
  
  {/* Add-ons */}
  {addOnsOptions.length > 0 && selectedItem.allowsAddons && (
  <div className="border-b border-amber-900/30 pb-4 mb-4">
  <div className="flex items-center justify-between mb-3">
  <h3 className="text-amber-100 font-bold">ACRESCIMOS</h3>
  <span className="text-amber-600 text-xs">(Opcional)</span>
  </div>
  
  <div className="space-y-3">
  {addOnsOptions.map((addOn) => (
                      <div
                        key={addOn.id}
                        className="flex items-center justify-between bg-[#2a1a10] rounded-xl p-3 border border-amber-900/30"
                      >
                        <div>
                          <p className="text-amber-100 text-sm font-medium">{addOn.name}</p>
                          <p className="text-green-500 text-xs">+ R$ {addOn.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddOnChange(addOn.id, -1)}
                            className="w-8 h-8 rounded-lg bg-amber-900/50 text-amber-100 flex items-center justify-center hover:bg-amber-800/70 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-amber-100 font-bold w-6 text-center">
                            {selectedAddOns[addOn.id] || 0}
                          </span>
                          <button
                            onClick={() => handleAddOnChange(addOn.id, 1)}
                            className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center hover:bg-green-500 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 bg-[#2a1a10] rounded-xl p-4 border border-amber-900/30">
                <div className="flex items-center gap-1">
                  <p className="text-amber-100 font-bold text-lg">Total:</p>
                  <p className="text-green-500 font-bold text-xl">R$ {calculateItemTotal().toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-amber-100 font-bold w-8 text-center text-lg">{itemQuantity}</span>
                  <button
                    onClick={() => setItemQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-lg bg-green-600 text-white flex items-center justify-center hover:bg-green-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-4 rounded-xl font-bold text-lg tracking-wider transition-all duration-300 flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                ADICIONAR AO CARRINHO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
          <div className="w-full max-w-lg bg-[#1a0f08] rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-[#1a0f08] p-5 border-b border-amber-900/30 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-100">CARRINHO</h2>
              <button
                onClick={() => setShowCart(false)}
                className="w-10 h-10 bg-amber-900/30 rounded-full flex items-center justify-center text-amber-100 hover:bg-amber-800/50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-amber-900/50 mx-auto mb-4" />
                  <p className="text-amber-600">Seu carrinho esta vazio</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((cartItem, index) => (
                      <div
                        key={index}
                        className="bg-[#2a1a10] rounded-xl p-4 border border-amber-900/30"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={cartItem.item.image || "/placeholder.svg"}
                              alt={cartItem.item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-amber-100 font-bold text-sm">
                                  {cartItem.quantity}x {cartItem.item.name}
                                  {cartItem.selectedVariation && (
                                    <span className="text-amber-400 font-normal"> ({cartItem.selectedVariation.name})</span>
                                  )}
                                </h3>
{cartItem.selectedMaionese && (
  <p className="text-green-600 text-xs mt-1">
  Maionese: {cartItem.selectedMaionese.name}
  </p>
  )}
  {cartItem.extraMaioneses && cartItem.extraMaioneses.length > 0 && (
  <p className="text-amber-500 text-xs">
  + {cartItem.extraMaioneses.map(m => m.name).join(", ")} (+R${(cartItem.extraMaioneses.length * 2).toFixed(2)})
  </p>
  )}
  {cartItem.selectedComboChoices && Object.keys(cartItem.selectedComboChoices).length > 0 && (
  <div className="mt-1">
  {Object.entries(cartItem.selectedComboChoices).map(([choiceId, option]) => {
    const choiceLabel = cartItem.item.comboChoices?.find(c => c.id === choiceId)?.label || ""
    return (
      <p key={choiceId} className="text-amber-400 text-xs">
        {choiceLabel} {option.name}
      </p>
    )
  })}
  </div>
  )}
  {cartItem.selectedAddOns.length > 0 && (
  <div className="mt-1">
  {cartItem.selectedAddOns.map((addon, idx) => (
  <p key={idx} className="text-amber-600 text-xs">
  + {addon.quantity}x {addon.addOn.name}
  </p>
  ))}
  </div>
  )}
                              </div>
                              <button
                                onClick={() => removeFromCart(index)}
                                className="text-red-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <p className="text-green-500 font-bold mt-2">
                              R$ {cartItem.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Total */}
                  <div className="bg-[#2a1a10] rounded-xl p-4 border border-amber-900/30 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-100 font-bold text-lg">TOTAL:</span>
                      <span className="text-green-500 font-bold text-2xl">R$ {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button
                    onClick={handleGoToCheckout}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-4 rounded-xl font-bold text-lg tracking-wider transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    FINALIZAR PEDIDO
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 px-4 py-10 text-center border-t border-amber-700/40 mt-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="w-12 h-12 relative">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain drop-shadow-lg" />
          </div>
          <span className="text-amber-100 font-bold tracking-widest text-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>CAPITAO BURGUER</span>
        </div>
        <p className="text-amber-500 text-sm mb-2">O melhor hamburguer na brasa!</p>
        <p className="text-amber-400 text-sm font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>@{new Date().getFullYear()} GVSoftware - Todos os direitos reservados</p>
      </div>

      {/* Checkout Screen */}
      {showCheckout && (
        <div className="fixed inset-0 z-50">
          <CheckoutScreen
            cart={cart}
            cartTotal={cartTotal}
            onBack={() => setShowCheckout(false)}
            onConfirm={handleConfirmOrder}
          />
        </div>
      )}
    </div>
  )
}
