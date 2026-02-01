'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, LogOut, Package, Tag, Coffee, X, Save } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  order_index: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  is_available: boolean
  order_index: number
}

interface Addon {
  id: string
  name: string
  price: number
  is_available: boolean
  order_index: number
}

type Tab = 'products' | 'categories' | 'addons'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('products')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [addons, setAddons] = useState<Addon[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | Category | Addon | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({})
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    
    const [categoriesRes, productsRes, addonsRes] = await Promise.all([
      supabase.from('categories').select('*').order('order_index'),
      supabase.from('products').select('*').order('order_index'),
      supabase.from('addons').select('*').order('order_index'),
    ])

    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (productsRes.data) setProducts(productsRes.data)
    if (addonsRes.data) setAddons(addonsRes.data)
    
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/capitao-admin/login')
  }

  function openCreateModal() {
    setEditingItem(null)
    if (activeTab === 'products') {
      setFormData({ name: '', description: '', price: 0, image_url: '', category_id: categories[0]?.id || '', is_available: true })
    } else if (activeTab === 'categories') {
      setFormData({ name: '', slug: '' })
    } else {
      setFormData({ name: '', price: 0, is_available: true })
    }
    setShowModal(true)
  }

  function openEditModal(item: Product | Category | Addon) {
    setEditingItem(item)
    setFormData({ ...item })
    setShowModal(true)
  }

  async function handleSave() {
    const table = activeTab === 'products' ? 'products' : activeTab === 'categories' ? 'categories' : 'addons'
    
    if (editingItem) {
      // Update
      await supabase.from(table).update(formData).eq('id', editingItem.id)
    } else {
      // Insert
      await supabase.from(table).insert(formData)
    }
    
    setShowModal(false)
    loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return
    
    const table = activeTab === 'products' ? 'products' : activeTab === 'categories' ? 'categories' : 'addons'
    await supabase.from(table).delete().eq('id', id)
    loadData()
  }

  const tabs = [
    { key: 'products' as Tab, label: 'Produtos', icon: Package },
    { key: 'categories' as Tab, label: 'Categorias', icon: Tag },
    { key: 'addons' as Tab, label: 'Acrescimos', icon: Coffee },
  ]

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url('/images/pirate-wood-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="fixed inset-0 bg-black/60 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gradient-to-b from-[#1a0f08] to-[#1a0f08]/90 border-b border-amber-800/30 p-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-amber-100 font-bold text-lg">Painel Admin</h1>
                <p className="text-amber-600 text-xs">Capitao Burguer</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-transparent border-amber-700/50 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white'
                    : 'bg-[#2a1a10]/80 text-amber-400 border border-amber-800/50 hover:bg-[#3a2a1a]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Add Button */}
          <div className="mb-6">
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar {activeTab === 'products' ? 'Produto' : activeTab === 'categories' ? 'Categoria' : 'Acrescimo'}
            </Button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-amber-400 text-center py-12">Carregando...</div>
          ) : (
            <div className="grid gap-4">
              {activeTab === 'products' && products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-xl border border-amber-800/40 p-4 flex items-center gap-4"
                >
                  {product.image_url && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-amber-100 font-bold truncate">{product.name}</h3>
                    <p className="text-amber-600 text-sm truncate">{product.description}</p>
                    <p className="text-green-500 font-bold">R$ {product.price.toFixed(2)}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${product.is_available ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {product.is_available ? 'Disponivel' : 'Indisponivel'}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(product)} className="bg-transparent border-amber-700/50 text-amber-400 hover:bg-amber-900/30">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)} className="bg-transparent border-red-700/50 text-red-400 hover:bg-red-900/30">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {activeTab === 'categories' && categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-xl border border-amber-800/40 p-4 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-amber-100 font-bold">{category.name}</h3>
                    <p className="text-amber-600 text-sm">Slug: {category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(category)} className="bg-transparent border-amber-700/50 text-amber-400 hover:bg-amber-900/30">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(category.id)} className="bg-transparent border-red-700/50 text-red-400 hover:bg-red-900/30">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {activeTab === 'addons' && addons.map((addon) => (
                <div
                  key={addon.id}
                  className="bg-gradient-to-b from-[#2a1a10]/95 to-[#1a0f08]/98 rounded-xl border border-amber-800/40 p-4 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-amber-100 font-bold">{addon.name}</h3>
                    <p className="text-green-500 font-bold">+ R$ {addon.price.toFixed(2)}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${addon.is_available ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {addon.is_available ? 'Disponivel' : 'Indisponivel'}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(addon)} className="bg-transparent border-amber-700/50 text-amber-400 hover:bg-amber-900/30">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(addon.id)} className="bg-transparent border-red-700/50 text-red-400 hover:bg-red-900/30">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {((activeTab === 'products' && products.length === 0) ||
                (activeTab === 'categories' && categories.length === 0) ||
                (activeTab === 'addons' && addons.length === 0)) && (
                <div className="text-amber-600 text-center py-12 bg-[#2a1a10]/50 rounded-xl border border-amber-800/30">
                  Nenhum item encontrado. Clique em "Adicionar" para criar.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#2a1a10] to-[#1a0f08] rounded-2xl border-2 border-amber-700/50 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-amber-100">
                {editingItem ? 'Editar' : 'Adicionar'} {activeTab === 'products' ? 'Produto' : activeTab === 'categories' ? 'Categoria' : 'Acrescimo'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-amber-500 hover:text-amber-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-amber-200">Nome</Label>
                <Input
                  value={formData.name as string || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#1a0f08] border-amber-800/50 text-amber-100 mt-1"
                />
              </div>

              {activeTab === 'products' && (
                <>
                  <div>
                    <Label className="text-amber-200">Descricao</Label>
                    <Input
                      value={formData.description as string || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#1a0f08] border-amber-800/50 text-amber-100 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-amber-200">Preco (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price as number || 0}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="bg-[#1a0f08] border-amber-800/50 text-amber-100 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-amber-200">URL da Imagem</Label>
                    <Input
                      value={formData.image_url as string || ''}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                      className="bg-[#1a0f08] border-amber-800/50 text-amber-100 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-amber-200">Categoria</Label>
                    <select
                      value={formData.category_id as string || ''}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-[#1a0f08] border border-amber-800/50 text-amber-100 mt-1 rounded-md px-3 py-2"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_available"
                      checked={formData.is_available as boolean}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="rounded bg-[#1a0f08] border-amber-800/50"
                    />
                    <Label htmlFor="is_available" className="text-amber-200">Disponivel</Label>
                  </div>
                </>
              )}

              {activeTab === 'categories' && (
                <div>
                  <Label className="text-amber-200">Slug (identificador unico)</Label>
                  <Input
                    value={formData.slug as string || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="ex: burgueres"
                    className="bg-[#1a0f08] border-amber-800/50 text-amber-100 mt-1"
                  />
                </div>
              )}

              {activeTab === 'addons' && (
                <>
                  <div>
                    <Label className="text-amber-200">Preco (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price as number || 0}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="bg-[#1a0f08] border-amber-800/50 text-amber-100 mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="addon_available"
                      checked={formData.is_available as boolean}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="rounded bg-[#1a0f08] border-amber-800/50"
                    />
                    <Label htmlFor="addon_available" className="text-amber-200">Disponivel</Label>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1 bg-transparent border-amber-700/50 text-amber-400 hover:bg-amber-900/30"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
