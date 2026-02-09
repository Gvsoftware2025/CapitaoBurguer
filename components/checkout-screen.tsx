"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Store, CreditCard, QrCode, Banknote, User, Home } from "lucide-react"
import Image from "next/image"

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

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  ingredients: string[]
  addOns: AddOn[]
  variations?: Variation[]
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
  totalPrice: number
}

interface CheckoutScreenProps {
  cart: CartItem[]
  cartTotal: number
  onBack: () => void
  onConfirm: (orderData: OrderData) => void
}

export interface OrderData {
  deliveryType: "retirar" | "entregar"
  name: string
  address: string
  paymentMethod: "cartao" | "pix" | "dinheiro"
  cashAmount?: number
}

export function CheckoutScreen({ cart, cartTotal, onBack, onConfirm }: CheckoutScreenProps) {
  const [deliveryType, setDeliveryType] = useState<"retirar" | "entregar" | null>(null)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cartao" | "pix" | "dinheiro" | null>(null)
  const [cashAmount, setCashAmount] = useState("")
  const [errors, setErrors] = useState<{ deliveryType?: boolean; paymentMethod?: boolean }>({})

  const deliveryFee = deliveryType === "entregar" ? 2 : 0
  const finalTotal = cartTotal + deliveryFee
  
  const cashValue = parseFloat(cashAmount) || 0
  const difference = cashValue - finalTotal

  const getCashStatus = () => {
    if (!cashAmount || cashValue === 0) return "empty"
    if (difference < 0) return "insufficient" // vermelho - falta dinheiro
    if (difference === 0) return "exact" // verde - valor exato
    return "change" // amarelo - tem troco
  }

  const cashStatus = getCashStatus()

  const handleConfirm = () => {
    const newErrors: { deliveryType?: boolean; paymentMethod?: boolean } = {}
    
    if (!deliveryType) {
      newErrors.deliveryType = true
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = true
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (paymentMethod === "dinheiro" && cashStatus === "insufficient") {
      return
    }

    onConfirm({
      deliveryType: deliveryType!,
      name,
      address,
      paymentMethod: paymentMethod!,
      cashAmount: paymentMethod === "dinheiro" ? cashValue : undefined,
    })
  }

  return (
    <div 
      className="min-h-screen h-full overflow-y-auto relative"
      style={{
        backgroundImage: `url('/images/bg-pirate-deck.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
            Pagamento
          </h1>

          <div className="w-11" />
        </div>
      </div>

      <div className="relative z-10 px-4 py-6 pb-24 max-w-lg mx-auto space-y-6">
        
        {/* Resumo do Pedido */}
        <div className="bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-2xl border-2 border-amber-700/40 p-4 shadow-lg">
          <h2 className="text-amber-100 font-bold text-lg mb-4 border-b border-amber-700/40 pb-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Resumo do Pedido
          </h2>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {cart.map((cartItem, index) => (
              <div key={index} className="flex gap-3 bg-[#1a0f08]/50 rounded-xl p-3 border border-amber-900/30">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={cartItem.item.image || "/placeholder.svg"} alt={cartItem.item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-amber-100 font-semibold text-sm truncate">
                    {cartItem.quantity}x {cartItem.item.name}
                    {cartItem.selectedVariation && (
                      <span className="text-amber-400 font-normal"> ({cartItem.selectedVariation.name})</span>
                    )}
                  </h4>
{cartItem.selectedMaionese && (
  <p className="text-green-600 text-xs mt-1">Maionese: {cartItem.selectedMaionese.name}</p>
  )}
  {cartItem.extraMaioneses && cartItem.extraMaioneses.length > 0 && (
  <p className="text-amber-500 text-xs">+ {cartItem.extraMaioneses.map(m => m.name).join(", ")}</p>
  )}
  {cartItem.selectedAddOns.length > 0 && (
  <p className="text-amber-500 text-xs mt-1">
  + {cartItem.selectedAddOns.map(a => `${a.quantity}x ${a.addOn.name}`).join(", ")}
  </p>
  )}
  <p className="text-green-500 font-bold text-sm mt-1">R$ {cartItem.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-amber-700/40 mt-4 pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-amber-400 text-sm">Subtotal:</span>
              <span className="text-amber-100">R$ {cartTotal.toFixed(2)}</span>
            </div>
            {deliveryType === "entregar" && (
              <div className="flex justify-between items-center">
                <span className="text-amber-400 text-sm">Taxa de entrega:</span>
                <span className="text-amber-100">R$ {deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-amber-700/30">
              <span className="text-amber-300 font-semibold">Total:</span>
              <span className="text-2xl font-bold text-green-500">R$ {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Tipo de Entrega */}
        <div className={`bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-2xl border-2 p-4 shadow-lg transition-colors ${errors.deliveryType && !deliveryType ? 'border-red-500' : 'border-amber-700/40'}`}>
          <h2 className="text-amber-100 font-bold text-lg mb-4" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Tipo de Entrega <span className="text-red-500">*</span>
          </h2>
          {errors.deliveryType && !deliveryType && (
            <p className="text-red-500 text-xs mb-3">Selecione uma opcao</p>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setDeliveryType("retirar")
                setErrors(prev => ({ ...prev, deliveryType: false }))
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                deliveryType === "retirar"
                  ? "bg-gradient-to-b from-amber-500 to-amber-700 border-amber-400 text-white"
                  : "bg-[#1a0f08]/50 border-amber-800/50 text-amber-400 hover:border-amber-600"
              }`}
            >
              <Store className="w-8 h-8" />
              <span className="font-semibold">Retirar</span>
            </button>
            
            <button
              onClick={() => {
                setDeliveryType("entregar")
                setErrors(prev => ({ ...prev, deliveryType: false }))
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                deliveryType === "entregar"
                  ? "bg-gradient-to-b from-amber-500 to-amber-700 border-amber-400 text-white"
                  : "bg-[#1a0f08]/50 border-amber-800/50 text-amber-400 hover:border-amber-600"
              }`}
            >
<MapPin className="w-8 h-8" />
  <span className="font-semibold">Entregar</span>
  </button>
  </div>
  {deliveryType === "entregar" && (
    <p className="text-amber-400 text-sm text-center mt-2">Taxa de entrega: R$ 2,00</p>
  )}
  </div>
  
  {/* Dados do Cliente */}
        <div className="bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-2xl border-2 border-amber-700/40 p-4 shadow-lg">
          <h2 className="text-amber-100 font-bold text-lg mb-4" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Dados do Cliente <span className="text-amber-500 text-sm font-normal">(Opcional)</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-amber-400 text-sm mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-[#1a0f08]/50 border-2 border-amber-800/50 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
            
            <div>
              <label className="text-amber-400 text-sm mb-2 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Endereco
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, numero, bairro"
                className="w-full bg-[#1a0f08]/50 border-2 border-amber-800/50 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div className={`bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-2xl border-2 p-4 shadow-lg transition-colors ${errors.paymentMethod && !paymentMethod ? 'border-red-500' : 'border-amber-700/40'}`}>
          <h2 className="text-amber-100 font-bold text-lg mb-4" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            Forma de Pagamento <span className="text-red-500">*</span>
          </h2>
          {errors.paymentMethod && !paymentMethod && (
            <p className="text-red-500 text-xs mb-3">Selecione uma opcao</p>
          )}
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                setPaymentMethod("cartao")
                setErrors(prev => ({ ...prev, paymentMethod: false }))
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === "cartao"
                  ? "bg-gradient-to-b from-amber-500 to-amber-700 border-amber-400 text-white"
                  : "bg-[#1a0f08]/50 border-amber-800/50 text-amber-400 hover:border-amber-600"
              }`}
            >
              <CreditCard className="w-7 h-7" />
              <span className="font-semibold text-sm">Cartao</span>
            </button>
            
            <button
              onClick={() => {
                setPaymentMethod("pix")
                setErrors(prev => ({ ...prev, paymentMethod: false }))
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === "pix"
                  ? "bg-gradient-to-b from-amber-500 to-amber-700 border-amber-400 text-white"
                  : "bg-[#1a0f08]/50 border-amber-800/50 text-amber-400 hover:border-amber-600"
              }`}
            >
              <QrCode className="w-7 h-7" />
              <span className="font-semibold text-sm">PIX</span>
            </button>
            
            <button
              onClick={() => {
                setPaymentMethod("dinheiro")
                setErrors(prev => ({ ...prev, paymentMethod: false }))
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === "dinheiro"
                  ? "bg-gradient-to-b from-amber-500 to-amber-700 border-amber-400 text-white"
                  : "bg-[#1a0f08]/50 border-amber-800/50 text-amber-400 hover:border-amber-600"
              }`}
            >
              <Banknote className="w-7 h-7" />
              <span className="font-semibold text-sm">Dinheiro</span>
            </button>
          </div>
          
          {/* Mensagem PIX */}
          {paymentMethod === "pix" && (
            <p className="text-amber-400 text-sm text-center mt-3">PIX somente na maquininha</p>
          )}

          {/* Campo de Dinheiro */}
          {paymentMethod === "dinheiro" && (
            <div className="mt-4 p-4 bg-[#1a0f08]/50 rounded-xl border border-amber-800/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-amber-400 text-sm">Total a pagar:</span>
                <span className="text-amber-100 font-bold text-lg">R$ {finalTotal.toFixed(2)}</span>
              </div>
              
              <div className="mb-3">
                <label className="text-amber-400 text-sm mb-2 block">Quanto vai pagar em dinheiro?</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-semibold">R$</span>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-[#2a1a10] border-2 border-amber-800/50 rounded-xl py-3 pl-12 pr-4 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500 transition-all text-lg"
                  />
                </div>
              </div>

              {/* Status do Dinheiro */}
              {cashAmount && (
                <div className={`p-3 rounded-xl border-2 ${
                  cashStatus === "insufficient" 
                    ? "bg-red-900/30 border-red-500 text-red-400" 
                    : cashStatus === "exact" 
                    ? "bg-green-900/30 border-green-500 text-green-400"
                    : "bg-yellow-900/30 border-yellow-500 text-yellow-400"
                }`}>
                  {cashStatus === "insufficient" && (
                    <p className="font-semibold">
                      Falta: R$ {Math.abs(difference).toFixed(2)}
                    </p>
                  )}
                  {cashStatus === "exact" && (
                    <p className="font-semibold">
                      Valor exato! Sem troco.
                    </p>
                  )}
                  {cashStatus === "change" && (
                    <p className="font-semibold">
                      Troco: R$ {difference.toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botao Confirmar */}
        <button
          onClick={handleConfirm}
          disabled={paymentMethod === "dinheiro" && cashStatus === "insufficient"}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            paymentMethod === "dinheiro" && cashStatus === "insufficient"
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-b from-green-500 to-green-700 text-white hover:from-green-400 hover:to-green-600 shadow-lg"
          }`}
          style={!(paymentMethod === "dinheiro" && cashStatus === "insufficient") ? { boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)' } : {}}
        >
          Confirmar Pedido
        </button>

        </div>
    </div>
  )
}
