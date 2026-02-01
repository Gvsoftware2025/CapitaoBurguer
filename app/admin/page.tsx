"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Pencil, Trash2, Upload, X, Save, LogOut, Eye, EyeOff } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  display_order: number
}

interface Product {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string
  display_order: number
  is_active: boolean
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"categories" | "products">("categories")
  
  // Form states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategorySlug, setNewCategorySlug] = useState("")
  
  // Product form
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
  })
  const [uploading, setUploading] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      console.log("[v0] Fetching categories...")
      const res = await fetch("/api/admin/categories")
      console.log("[v0] Categories response status:", res.status)
      const data = await res.json()
      console.log("[v0] Categories data:", data)
      if (data.categories) {
        setCategories(data.categories)
        console.log("[v0] Categories set:", data.categories.length)
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar categorias:", error)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      console.log("[v0] Fetching products, selectedCategory:", selectedCategory)
      const url = selectedCategory 
        ? `/api/admin/products?category_id=${selectedCategory}`
        : "/api/admin/products"
      const res = await fetch(url)
      console.log("[v0] Products response status:", res.status)
      const data = await res.json()
      console.log("[v0] Products data:", data)
      if (data.products) {
        setProducts(data.products)
        console.log("[v0] Products set:", data.products.length)
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar produtos:", error)
    }
  }, [selectedCategory])

  useEffect(() => {
    console.log("[v0] isAuthenticated changed:", isAuthenticated)
    if (isAuthenticated) {
      console.log("[v0] Calling fetchCategories and fetchProducts...")
      fetchCategories()
      fetchProducts()
    }
  }, [isAuthenticated, fetchCategories, fetchProducts])

  useEffect(() => {
    if (isAuthenticated && selectedCategory) {
      fetchProducts()
    }
  }, [selectedCategory, isAuthenticated, fetchProducts])

  const handleLogin = async () => {
    setLoading(true)
    setLoginError("")
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem("admin_token", data.token)
      } else {
        setLoginError("Senha incorreta")
      }
    } catch {
      setLoginError("Erro ao fazer login")
    }
    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_token")
  }

  // Check stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    console.log("[v0] Checking stored token:", token ? "exists" : "none")
    if (token) {
      // Verify token
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).then(res => res.json()).then(data => {
        console.log("[v0] Token verification:", data)
        if (data.success) {
          setIsAuthenticated(true)
        }
      })
    }
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setProductForm(prev => ({ ...prev, image_url: data.url }))
      }
    } catch (error) {
      console.error("Erro no upload:", error)
    }
    setUploading(false)
  }

  // Category CRUD
  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return
    
    const slug = newCategorySlug || newCategoryName.toLowerCase().replace(/\s+/g, "_")
    
    try {
      if (editingCategory) {
        await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, name: newCategoryName, slug }),
        })
      } else {
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategoryName, slug, order_index: categories.length }),
        })
      }
      setNewCategoryName("")
      setNewCategorySlug("")
      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria? Todos os produtos dela serao excluidos tambem!")) return
    
    try {
      await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      fetchCategories()
      fetchProducts()
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
    }
  }

  // Product CRUD
  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.category_id) return
    
    try {
      if (editingProduct) {
        await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id: editingProduct.id, 
            ...productForm,
            price: parseFloat(productForm.price) || 0,
          }),
        })
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            ...productForm,
            price: parseFloat(productForm.price) || 0,
            order_index: products.length,
          }),
        })
      }
      setProductForm({ name: "", description: "", price: "", image_url: "", category_id: selectedCategory || "" })
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    
    try {
      await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      fetchProducts()
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      category_id: product.category_id,
    })
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a0f08] flex items-center justify-center p-4">
        <div className="bg-[#2a1a10] p-8 rounded-2xl border-2 border-amber-700/50 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-100 mb-2">Painel Admin</h1>
            <p className="text-amber-500">Capitao Burguer</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-amber-300 text-sm block mb-2">Senha de Acesso</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-[#1a0f08] border-amber-700/50 text-amber-100 pr-10"
                  placeholder="Digite a senha..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Admin Panel
  return (
    <div className="min-h-screen bg-[#1a0f08]">
      {/* Header */}
      <header className="bg-[#2a1a10] border-b border-amber-700/50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-amber-500 hover:text-amber-400">
              <ArrowLeft size={24} />
            </a>
            <h1 className="text-xl font-bold text-amber-100">Painel Admin</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-amber-700/50 text-amber-400 hover:bg-amber-900/30 bg-transparent"
          >
            <LogOut size={18} className="mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab("categories")}
            className={`${activeTab === "categories" ? "bg-amber-600 text-white" : "bg-[#2a1a10] text-amber-400"}`}
          >
            Categorias
          </Button>
          <Button
            onClick={() => setActiveTab("products")}
            className={`${activeTab === "products" ? "bg-amber-600 text-white" : "bg-[#2a1a10] text-amber-400"}`}
          >
            Produtos
          </Button>
        </div>

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Add/Edit Category Form */}
            <div className="bg-[#2a1a10] p-6 rounded-xl border border-amber-700/50">
              <h2 className="text-lg font-bold text-amber-100 mb-4">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-amber-300 text-sm block mb-2">Nome</label>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-[#1a0f08] border-amber-700/50 text-amber-100"
                    placeholder="Ex: Hamburgueres"
                  />
                </div>
                <div>
                  <label className="text-amber-300 text-sm block mb-2">Slug (opcional)</label>
                  <Input
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                    className="bg-[#1a0f08] border-amber-700/50 text-amber-100"
                    placeholder="Ex: hamburgueres"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSaveCategory} className="bg-green-600 hover:bg-green-500 text-white">
                  <Save size={18} className="mr-2" />
                  {editingCategory ? "Salvar" : "Adicionar"}
                </Button>
                {editingCategory && (
                  <Button 
                    onClick={() => { setEditingCategory(null); setNewCategoryName(""); setNewCategorySlug(""); }}
                    variant="outline"
                    className="border-amber-700/50 text-amber-400"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-[#2a1a10] p-6 rounded-xl border border-amber-700/50">
              <h2 className="text-lg font-bold text-amber-100 mb-4">Categorias</h2>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-4 bg-[#1a0f08] rounded-lg border border-amber-900/30">
                    <div>
                      <p className="text-amber-100 font-semibold">{cat.name}</p>
                      <p className="text-amber-600 text-sm">{cat.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => { setEditingCategory(cat); setNewCategoryName(cat.name); setNewCategorySlug(cat.slug); }}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-500"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCategory(cat.id)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-amber-500 text-center py-8">Nenhuma categoria cadastrada</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setSelectedCategory(null)}
                size="sm"
                className={`${!selectedCategory ? "bg-amber-600 text-white" : "bg-[#2a1a10] text-amber-400"}`}
              >
                Todos
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  size="sm"
                  className={`${selectedCategory === cat.id ? "bg-amber-600 text-white" : "bg-[#2a1a10] text-amber-400"}`}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Add/Edit Product Form */}
            <div className="bg-[#2a1a10] p-6 rounded-xl border border-amber-700/50">
              <h2 className="text-lg font-bold text-amber-100 mb-4">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-amber-300 text-sm block mb-2">Nome</label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#1a0f08] border-amber-700/50 text-amber-100"
                    placeholder="Ex: Capitao Bacon"
                  />
                </div>
                <div>
                  <label className="text-amber-300 text-sm block mb-2">Preco (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="bg-[#1a0f08] border-amber-700/50 text-amber-100"
                    placeholder="Ex: 29.90"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-amber-300 text-sm block mb-2">Descricao</label>
                  <Input
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-[#1a0f08] border-amber-700/50 text-amber-100"
                    placeholder="Ex: Hamburguer artesanal com bacon crocante..."
                  />
                </div>
                <div>
                  <label className="text-amber-300 text-sm block mb-2">Categoria</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full bg-[#1a0f08] border border-amber-700/50 text-amber-100 rounded-md p-2"
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-amber-300 text-sm block mb-2">Imagem</label>
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="bg-[#1a0f08] border border-amber-700/50 border-dashed rounded-md p-3 text-center hover:border-amber-500 transition-colors">
                        <Upload size={20} className="mx-auto mb-1 text-amber-500" />
                        <span className="text-amber-400 text-sm">
                          {uploading ? "Enviando..." : "Enviar foto"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                {productForm.image_url && (
                  <div className="md:col-span-2">
                    <label className="text-amber-300 text-sm block mb-2">Preview</label>
                    <div className="relative w-32 h-32">
                      <Image
                        src={productForm.image_url || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setProductForm(prev => ({ ...prev, image_url: "" }))}
                        className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSaveProduct} className="bg-green-600 hover:bg-green-500 text-white">
                  <Save size={18} className="mr-2" />
                  {editingProduct ? "Salvar" : "Adicionar"}
                </Button>
                {editingProduct && (
                  <Button 
                    onClick={() => { 
                      setEditingProduct(null); 
                      setProductForm({ name: "", description: "", price: "", image_url: "", category_id: selectedCategory || "" }); 
                    }}
                    variant="outline"
                    className="border-amber-700/50 text-amber-400"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>

            {/* Products List */}
            <div className="bg-[#2a1a10] p-6 rounded-xl border border-amber-700/50">
              <h2 className="text-lg font-bold text-amber-100 mb-4">Produtos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-[#1a0f08] rounded-lg border border-amber-900/30 overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={product.image_url || "/images/burger-bacon.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-amber-100 font-semibold">{product.name}</h3>
                      <p className="text-amber-500 text-sm line-clamp-2">{product.description}</p>
                      <p className="text-green-500 font-bold mt-2">R$ {product.price.toFixed(2)}</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => handleEditProduct(product)}
                          size="sm"
                          className="flex-1 bg-amber-600 hover:bg-amber-500"
                        >
                          <Pencil size={16} className="mr-1" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="md:col-span-3 text-amber-500 text-center py-8">
                    <Plus size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Nenhum produto cadastrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
