"use client"

import { useState } from "react"
import { ArrowLeft, Search, X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import { CheckoutScreen, type OrderData } from "./checkout-screen"

interface MenuScreenProps {
  onBack: () => void
}

type Category = "burgueres" | "super_burgueres" | "porcoes" | "bebidas" | "combos" | "espetos" | "jantinha" | "churros"

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

const maionesesOptions: Maionese[] = [
  { id: "maio1", name: "Maionese de Bacon" },
  { id: "maio2", name: "Maionese de Rucula" },
  { id: "maio3", name: "Maionese de Picles" },
]

const addOnsOptions: AddOn[] = [
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

const menuData: Record<Category, MenuItem[]> = {
  burgueres: [
    { id: "1", name: "Capitao Classico", description: "O tradicional que conquistou os mares", price: 25, image: "/images/capitao-classico.jpg", ingredients: ["Hamburguer 150g", "Queijo Prato", "Tomate"], addOns: addOnsOptions },
    { id: "2", name: "Capitao Bacon", description: "Para os amantes de bacon", price: 28, image: "/images/capitao-bacon.jpg", ingredients: ["Hamburguer 150g", "Queijo Prato", "Bacon", "Cebola Caramelizada"], addOns: addOnsOptions },
    { id: "3", name: "Capitao Cheddar", description: "Explosao de cheddar cremoso", price: 28, image: "/images/capitao-cheddar.jpg", ingredients: ["Hamburguer 150g", "Cheddar Cremoso", "Bacon Crocante"], addOns: addOnsOptions },
    { id: "4", name: "Capitao Salada", description: "Fresquinho e saboroso", price: 28, image: "/images/capitao-salada.jpg", ingredients: ["Hamburguer 150g", "Queijo Prato", "Picles", "Tomate", "Cebola Roxa"], addOns: addOnsOptions },
    { id: "5", name: "Capitao Onion", description: "Com onions crocantes", price: 30, image: "/images/capitao-onion.jpg", ingredients: ["Hamburguer 150g", "Queijo Prato", "Bacon Crocante", "Molho Barbecue", "Onions"], addOns: addOnsOptions },
    { id: "6", name: "Capitao Gorgonzola", description: "Sabor sofisticado", price: 30, image: "/images/capitao-gorgonzola.jpg", ingredients: ["Hamburguer 150g", "Queijo Gorgonzola", "Mel", "Rucula"], addOns: addOnsOptions },
    { id: "7", name: "Capitao Harry", description: "Magico e delicioso", price: 30, image: "/images/capitao-harry.jpg", ingredients: ["Hamburguer 150g", "Queijo Mussarela", "Catupiry", "Alho Frito", "Bacon Crocante"], addOns: addOnsOptions },
    { id: "8", name: "Capitao Cheese", description: "Queijo por todos os lados", price: 30, image: "/images/capitao-cheese.jpg", ingredients: ["Hamburguer 150g", "Cream Cheese", "Cebola Crispy"], addOns: addOnsOptions },
    { id: "9", name: "Capitao Pig", description: "Suino especial", price: 30, image: "/images/capitao-pig.jpg", ingredients: ["Hamburguer de Pernil Suino", "Queijo Mussarela", "Bacon Crocante", "Molho Barbecue", "Alface Fresca"], addOns: addOnsOptions },
    { id: "10", name: "Capitao Vegetariano", description: "Sem carne, muito sabor", price: 30, image: "/images/capitao-vegetariano.jpg", ingredients: ["Queijo Empanado", "Cream Cheese", "Tomates Secos", "Rucula Fresca"], addOns: addOnsOptions },
    { id: "19", name: "Capitao Kids", description: "Para os pequenos piratas", price: 28, image: "/images/capitao-kids.jpg", ingredients: ["Hamburguer 100g", "Queijo Prato", "Cheddar", "Bacon Crocante", "Batata Frita"], addOns: addOnsOptions },
    { id: "20", name: "Capitao Rucula", description: "Fresquinho com rucula", price: 28, image: "/images/capitao-rucula.jpg", ingredients: ["Hamburguer 150g", "Queijo Prato", "Bacon Crocante", "Cebola Caramelizada", "Rucula Fresca"], addOns: addOnsOptions },
    { id: "21", name: "Capitao Nacho", description: "Com doritos crocante", price: 28, image: "/images/capitao_nacho.jpg", ingredients: ["Hamburguer 150g", "Queijo Prato", "Cheddar Cremoso", "Doritos"], addOns: addOnsOptions },
  ],
  super_burgueres: [
    { id: "11", name: "Capitao Chicken", description: "Frango empanado especial", price: 38, image: "/images/capitao_chicken.jpg", ingredients: ["Hamburguer de Frango", "Queijo Prato", "Catupiry", "Bacon Crocante"], addOns: addOnsOptions },
    { id: "12", name: "Capitao Hulk", description: "Para os famintos de verdade", price: 38, image: "/images/capitao_hulk.jpg", ingredients: ["Hamburguer 150g", "Queijo Prato", "Hamburguer de Pernil", "Bacon Crocante", "Requeijao Cremoso", "Alface Fresca", "Tomate", "Cebola"], addOns: addOnsOptions },
    { id: "13", name: "Capitao Nordestino", description: "Sabor do sertao", price: 38, image: "/images/capitao-nordestino.jpg", ingredients: ["Hamburguer 150g", "Queijo Mussarela", "Catupiry", "Carne Seca"], addOns: addOnsOptions },
    { id: "14", name: "Capitao Empoderado", description: "Costela suculenta", price: 38, image: "/images/capitao-empoderado.jpg", ingredients: ["Hamburguer de Costela 180g", "Barbecue na Base", "Muito Queijo", "Muito Bacon", "Onions"], addOns: addOnsOptions },
    { id: "15", name: "Capitao Duca", description: "Completo e irresistivel", price: 38, image: "/images/capitao-duca.jpg", ingredients: ["Hamburguer 150g", "Queijo Empanado", "Ovo", "Alface", "Tomate", "Cebola Roxa"], addOns: addOnsOptions },
    { id: "16", name: "Capitao da Casa", description: "O monstro da casa", price: 38, image: "/images/capitao-casa.jpg", ingredients: ["Hamburguer 300g", "Queijo Mussarela", "Bacon", "Ovo", "Catupiry", "Rucula Fresca"], addOns: addOnsOptions },
    { id: "17", name: "Capitao Eclipse", description: "Triplo poder", price: 38, image: "/images/capitao-eclipse.jpg", ingredients: ["3x Hamburguer 100g", "Maionese da Casa", "Muito Queijo", "Bacon Crocante", "Cebola Caramelizada", "Alface Fresca"], addOns: addOnsOptions },
    { id: "18", name: "Capitao America", description: "O lendario recheado", price: 38, image: "/images/capitao-america.jpg", ingredients: ["Hamburguer 200g Recheado com Mussarela", "Queijo Mussarela", "Maionese da Casa", "Bacon Crocante", "Alface Fresca", "Tomate", "Cebola Roxa"], addOns: addOnsOptions },
    { id: "22", name: "Capitao Costela", description: "Com costela desfiada", price: 38, image: "/images/capitao-costela.jpg", ingredients: ["Hamburguer 150g", "Queijo Mussarela", "Catupiry", "Alho Frito", "Costela Desfiada", "Rucula"], addOns: addOnsOptions },
    { id: "23", name: "Capitao Bauru", description: "Contra-file especial", price: 38, image: "/images/capitao-bauru.jpg", ingredients: ["Hamburguer 200g de Contra-File", "Queijo Mussarela", "Catupiry", "Tomate", "Rucula Fresca"], addOns: addOnsOptions },
    { id: "24", name: "Capitao Supremo", description: "O premium de fraldinha", price: 40, image: "/images/capitao-supremo.jpg", ingredients: ["Hamburguer 180g de Fraldinha", "Queijo Mussarela", "Catupiry", "Mostarda", "Tomate", "Alface"], addOns: addOnsOptions },
  ],
  porcoes: [
    { id: "p1", name: "Batata Frita", description: "Batatas fritas crocantes com tempero especial", price: 10, image: "/images/porcao-batata.jpg", ingredients: ["Batata Frita", "Tempero Especial"], addOns: [], variations: [{ id: "bat-ind", name: "Individual", price: 10 }, { id: "bat-meia", name: "Meia", price: 22 }, { id: "bat-int", name: "Inteira", price: 32 }] },
    { id: "p2", name: "Kibe", description: "Kibes bem temperados", price: 40, image: "/images/porcao-kibe.jpg", ingredients: ["Kibe", "Tempero Especial"], addOns: [], variations: [{ id: "kib-trad", name: "Tradicional", price: 40 }, { id: "kib-cat", name: "Catupiry", price: 40 }, { id: "kib-queij", name: "Coalhada", price: 40 }] },
    { id: "p3", name: "Anel de Cebola", description: "Aneis de cebola empanados e crocantes", price: 30, image: "/images/porcao-onion.jpg", ingredients: ["Cebola Empanada"], addOns: [] },
    { id: "p4", name: "Tilapia", description: "Porcao de tilapia empanada", price: 50, image: "/images/porcao-tilapia.jpg", ingredients: ["Tilapia Empanada"], addOns: [] },
    { id: "p5", name: "Pastelzinho", description: "Pastelzinhos fritos variados", price: 42, image: "/images/porcao-pastelzinho.jpg", ingredients: ["Pastelzinho Frito"], addOns: [] },
    { id: "p6", name: "Dadinho de Tapioca", description: "Dadinhos de tapioca com queijo coalho", price: 45, image: "/images/porcao-dadinho.jpg", ingredients: ["Tapioca", "Queijo Coalho"], addOns: [] },
    { id: "p7", name: "Coxinha Cremosa", description: "Coxinhas cremosas de frango", price: 45, image: "/images/porcao-coxinha.jpg", ingredients: ["Coxinha de Frango"], addOns: [] },
    { id: "p8", name: "Calabresa Acebolada", description: "Calabresa fatiada com cebola", price: 40, image: "/images/porcao-calabresa.jpg", ingredients: ["Calabresa", "Cebola"], addOns: [] },
    { id: "p9", name: "Contra File", description: "Porcao de contra file grelhado", price: 70, image: "/images/porcao-contra.jpg", ingredients: ["Contra File Grelhado"], addOns: [] },
    { id: "p10", name: "Fraldinha na Mostarda", description: "Fraldinha ao molho de mostarda", price: 60, image: "/images/porcao-fraldinha.jpg", ingredients: ["Fraldinha", "Molho Mostarda"], addOns: [] },
    { id: "p12", name: "Salame", description: "Porcao de salame fatiado", price: 30, image: "/images/porcao-salame.jpg", ingredients: ["Salame Fatiado"], addOns: [] },
    { id: "p13", name: "Palmito", description: "Porcao de palmito", price: 32, image: "/images/porcao-palmito.jpg", ingredients: ["Palmito"], addOns: [] },
    { id: "p14", name: "Azeitona", description: "Porcao de azeitonas", price: 10, image: "/images/porcao-azeitona.jpg", ingredients: ["Azeitonas"], addOns: [] },
    { id: "p15", name: "Ovo de Codorna", description: "Unidade de ovo de codorna", price: 0.5, image: "/images/porcao-ovodecodorna.jpg", ingredients: ["Ovo de Codorna"], addOns: [] },
    { id: "p17", name: "Bolinho de Costela com Catupiry", description: "Porcao inteira com 12 bolinhos de costela recheados com catupiry", price: 50, image: "/images/porcao-bolinho-costela.png", ingredients: ["12 Bolinhos de Costela", "Catupiry"], addOns: [] },
    { id: "p16", name: "Tabua de Frios", description: "Salame, Presunto, Mussarela, Ovo de Codorna, Azeitona, Palmito, Tomate", price: 80.00, image: "/images/tabuadefrios.jpg", ingredients: ["Salame", "Presunto", "Mussarela", "Ovo de Codorna", "Azeitona", "Palmito", "Tomate"], addOns: [] },
  ],
  bebidas: [
    // Cervejas
    { id: "b1", name: "Antarctica 600ml", description: "Cerveja Garrafa", price: 10, image: "/images/antartica600.png", ingredients: ["600ml"], addOns: [], subcategory: "Cervejas" },
    { id: "b2", name: "Skol 600ml", description: "Cerveja Garrafa", price: 12, image: "/images/skol600.png", ingredients: ["600ml"], addOns: [], subcategory: "Cervejas" },
    { id: "b3", name: "Original 600ml", description: "Cerveja Garrafa", price: 13, image: "/images/originalgarrafa.png", ingredients: ["600ml"], addOns: [], subcategory: "Cervejas" },
    { id: "b4", name: "Heineken 600ml", description: "Cerveja Garrafa", price: 16, image: "/images/heineken600.jpg", ingredients: ["600ml"], addOns: [], subcategory: "Cervejas" },
    { id: "b42", name: "Eisenbahn 600", description: "Cerveja Garrafa", price: 14, image: "/images/eisenbahn600.png", ingredients: ["600ml"], addOns: [], subcategory: "Cervejas" },
    { id: "b43", name: "Spaten 600ml", description: "Cerveja Garrafa", price: 14, image: "/images/spaten600.png", ingredients: ["600ml"], addOns: [], subcategory: "Cervejas" },
    { id: "b5", name: "Brahma Lata", description: "Cerveja Lata", price: 6, image: "/images/brahmalata.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Cervejas" },
    { id: "b6", name: "Antarctica Lata", description: "Cerveja Lata", price: 6, image: "/images/antartica-lata.png", ingredients: ["Lata"], addOns: [], subcategory: "Cervejas" },
    { id: "b7", name: "Skol Lata", description: "Cerveja Lata", price: 6, image: "/images/skol-lata.png", ingredients: ["Lata"], addOns: [], subcategory: "Cervejas" },
    { id: "b8", name: "Original Lata", description: "Cerveja Lata", price: 8, image: "/images/original-lata.png", ingredients: ["Lata"], addOns: [], subcategory: "Cervejas" },
    // Long Necks
    { id: "b10", name: "Heineken", description: "Long Neck", price: 10, image: "/images/heiniken-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b9", name: "Heineken Zero", description: "Long Neck", price: 10, image: "/images/heiniken-long-zero.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b44", name: "Eisenbahn", description: "Long Neck", price: 9, image: "/images/eisenbahn-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b11", name: "Spaten", description: "Long Neck", price: 9, image: "/images/spaten-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b12", name: "Corona", description: "Long Neck", price: 10, image: "/images/corona-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b13", name: "Budweiser", description: "Long Neck", price: 9, image: "/images/budweiser-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b14", name: "Imperio", description: "Long Neck", price: 6, image: "/images/imperio-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b15", name: "Smirnoff Ice", description: "Long Neck", price: 9, image: "/images/smirnoff-ice-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b16", name: "Ice Cabare", description: "Long Neck", price: 9, image: "/images/ice-cabare-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    { id: "b17", name: "Ice 51", description: "Long Neck", price: 9, image: "/images/ice-51-long.png", ingredients: ["Long Neck"], addOns: [], subcategory: "Long Necks" },
    // Aguas
    { id: "b18", name: "Agua Mineral sem Gas", description: "Garrafa", price: 3, image: "/images/aguasemgas.png", ingredients: ["Garrafa"], addOns: [], subcategory: "Aguas" },
    { id: "b19", name: "Agua Mineral com Gas", description: "Garrafa", price: 4, image: "/images/aguacomgas.png", ingredients: ["Garrafa"], addOns: [], subcategory: "Aguas" },
    { id: "b20", name: "Agua Tonica", description: "Garrafa", price: 6, image: "/images/agua-tonica.png", ingredients: ["Garrafa"], addOns: [], subcategory: "Aguas" },
    { id: "b24", name: "H2O", description: "Agua Saborizada", price: 6, image: "/images/h2o.png", ingredients: ["Garrafa"], addOns: [], subcategory: "Aguas" },
    // Sucos
    { id: "b21", name: "Suco Del Valle", description: "Lata", price: 7, image: "/images/suco-delvalle-lata.png", ingredients: ["Caixa"], addOns: [], subcategory: "Sucos" },
    // Energeticos
    { id: "b22", name: "Red Bull", description: "Lata", price: 15, image: "/images/redbull.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Energeticos" },
    { id: "b23", name: "Monster", description: "Lata", price: 12, image: "/images/monster.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Energeticos" },
    // Refrigerantes
    { id: "b25", name: "Coca-Cola Lata", description: "Lata", price: 6, image: "/images/cocalata.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b26", name: "Coca-Cola Zero Lata", description: "Lata", price: 6, image: "/images/cocazero-lata.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b27", name: "Guarana Lata", description: "Lata", price: 6, image: "/images/guarana-lata.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b28", name: "Sprite Lata", description: "Lata", price: 6, image: "/images/sprite-lata.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b29", name: "Schweppes Lata", description: "Lata", price: 6, image: "/images/Schweppes-lata.png", ingredients: ["Lata"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b30", name: "Fanta Laranja Lata", description: "Lata", price: 6, image: "/images/fantalaranja-lata.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b31", name: "Fanta Uva Lata", description: "Lata", price: 6, image: "/images/fantauva-lata.jpg", ingredients: ["Lata"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b32", name: "Coca-Cola 290ml", description: "Garrafa", price: 5, image: "/images/coca-290.png", ingredients: ["290ml"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b33", name: "Coca-Cola 600ml", description: "Garrafa", price: 8, image: "/images/coca600.jpg", ingredients: ["600ml"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b34", name: "Guarana 600ml", description: "Garrafa", price: 8, image: "/images/guarana600.jpg", ingredients: ["600ml"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b35", name: "Sprite 600ml", description: "Garrafa", price: 8, image: "/images/sprite600.jpg", ingredients: ["600ml"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b36", name: "Coca-Cola 1L", description: "Garrafa", price: 10, image: "/images/coca1l.png", ingredients: ["1 Litro"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b37", name: "Guarana 1L", description: "Garrafa", price: 10, image: "/images/guarana1l.png", ingredients: ["1 Litro"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b38", name: "Coca-Cola 2L", description: "Garrafa", price: 15, image: "/images/coca2l.jpg", ingredients: ["2 Litros"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b39", name: "Sprite 2L", description: "Garrafa", price: 12, image: "/images/sprite2l.jpg", ingredients: ["2 Litros"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b40", name: "Fanta Laranja 2L", description: "Garrafa", price: 12, image: "/images/fanta-laranja2l.jpg", ingredients: ["2 Litros"], addOns: [], subcategory: "Refrigerantes" },
    { id: "b41", name: "Guarana 2L", description: "Garrafa", price: 12, image: "/images/guarana2l.jpg", ingredients: ["2 Litros"], addOns: [], subcategory: "Refrigerantes" },
  ],
  combos: [
    { id: "c1", name: "Barca do Capitao", description: "1 Capitao Salada, 1 Capitao Bacon, 1/2 Batata, 8 Aneis de Cebola", price: 84.90, image: "/images/barca-capitao.jpg", ingredients: ["Capitao Salada", "Capitao Bacon", "1/2 Batata", "8 Aneis de Cebola"], addOns: [], comboChoices: [{ id: "cc-bat-c1", label: "Batata com:", options: [{ id: "cat", name: "Catupiry" }, { id: "ched", name: "Cheddar" }] }] },
    { id: "c2", name: "Barca de Porcoes", description: "7 Pasteizinhos, 1/2 Kibe, 1/2 Batata, 5 Coxinhas", price: 84.90, image: "/images/barca-porcoes.jpg", ingredients: ["7 Pasteizinhos Mistos", "1/2 Kibe", "1/2 Batata", "5 Coxinhas Cremosas"], addOns: [], comboChoices: [{ id: "cc-bat-c2", label: "Batata com:", options: [{ id: "cat", name: "Catupiry" }, { id: "ched", name: "Cheddar" }] }, { id: "cc-kib-c2", label: "Kibe:", options: [{ id: "trad", name: "Tradicional" }, { id: "cat", name: "Catupiry" }, { id: "coal", name: "Coalhada" }] }] },
    { id: "c3", name: "Barca Mista", description: "1 Capitao Salada, 1 Capitao Bacon, 1/2 Kibe, 1/2 Batata, 5 Coxinhas", price: 109.90, image: "/images/barca-mista.jpg", ingredients: ["Capitao Salada", "Capitao Bacon", "1/2 Kibe", "1/2 Batata", "5 Coxinhas Cremosas"], addOns: [], comboChoices: [{ id: "cc-bat-c3", label: "Batata com:", options: [{ id: "cat", name: "Catupiry" }, { id: "ched", name: "Cheddar" }] }, { id: "cc-kib-c3", label: "Kibe:", options: [{ id: "trad", name: "Tradicional" }, { id: "cat", name: "Catupiry" }, { id: "coal", name: "Coalhada" }] }] },
    { id: "c4", name: "Mini Rodizio", description: "5 sabores variados de hamburgueres + Batata Frita", price: 84.90, image: "/images/mini-rodizio.jpg", ingredients: ["Capitao Salada", "Capitao Bacon", "Capitao Classico", "Capitao Harry", "Capitao Empoderado", "Batata Frita"], addOns: [] },
  ],
  espetos: [
    { id: "e1", name: "Espeto Pedaco", description: "Espeto de carne em pedacos", price: 8, image: "/images/espeto-pedaco.jpg", ingredients: ["Carne em Pedacos"], addOns: [] },
    { id: "e2", name: "Espeto Kafta", description: "Espeto de kafta temperada", price: 8, image: "/images/espeto-kafita.jpg", ingredients: ["Kafta Temperada"], addOns: [] },
    { id: "e3", name: "Espeto Linguica", description: "Espeto de linguica", price: 8, image: "/images/espeto-linguica.jpg", ingredients: ["Linguica"], addOns: [] },
    { id: "e4", name: "Espeto Medalhao", description: "Espeto de medalhao de carne", price: 12, image: "/images/espeto-medalhao.jpg", ingredients: ["Medalhao de Carne"], addOns: [] },
    { id: "e5", name: "Espeto Coracao", description: "Espeto de coracao de frango", price: 12, image: "/images/espeto-coracao.jpg", ingredients: ["Coracao de Frango"], addOns: [] },
    { id: "e6", name: "Espeto Queijinho", description: "Espeto de queijo coalho", price: 10, image: "/images/espeto-queijinho.jpg", ingredients: ["Queijo Coalho"], addOns: [] },
    { id: "e7", name: "Pao de Alho", description: "Pao de alho na brasa", price: 6, image: "/images/espeto-paodealho.jpg", ingredients: ["Pao de Alho"], addOns: [] },
  ],
jantinha: [
  { id: "j1", name: "Jantinha Completa", description: "Acompanha arroz, vinagrete, mandioca e farofa", price: 15, image: "/images/jantinha.jpg", ingredients: ["Arroz", "Vinagrete", "Mandioca", "Farofa"], addOns: [] },
  ],
  churros: [
  { id: "ch1", name: "Mini Porcao de Churros", description: "30 mini churros deliciosos com acucar e canela", price: 42, image: "/images/churros.jpg", ingredients: ["30 Mini Churros", "Acucar", "Canela"], addOns: [] },
  ],
  }
  
  const categories: { key: Category; label: string }[] = [
  { key: "burgueres", label: "BURGUERES" },
  { key: "super_burgueres", label: "SUPER" },
  { key: "porcoes", label: "PORCOES" },
  { key: "bebidas", label: "BEBIDAS" },
  { key: "combos", label: "COMBOS E BARCAS" },
  { key: "espetos", label: "ESPETOS" },
  { key: "jantinha", label: "JANTINHA" },
  { key: "churros", label: "CHURROS" },
]

export function MenuScreen({ onBack }: MenuScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("burgueres")
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

// Pegar subcategorias disponiveis para bebidas
  const availableSubcategories = selectedCategory === "bebidas" 
    ? ["Todos", ...Array.from(new Set(menuData.bebidas.map(item => item.subcategory).filter(Boolean)))]
    : []

  const filteredItems = menuData[selectedCategory].filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubcategory = selectedCategory !== "bebidas" || 
      selectedSubcategory === "Todos" || 
      item.subcategory === selectedSubcategory
    return matchesSearch && matchesSubcategory
  })

const calculateItemTotal = () => {
  if (!selectedItem) return 0
  // Usa o preco da variacao selecionada ou o preco base do item
  const basePrice = selectedVariation ? selectedVariation.price : selectedItem.price
  let total = basePrice * itemQuantity
  Object.entries(selectedAddOns).forEach(([addOnId, qty]) => {
  const addOn = selectedItem.addOns.find((a) => a.id === addOnId)
  if (addOn && qty > 0) {
  total += addOn.price * qty
  }
  })
  // Adiciona R$2 por cada maionese extra
  total += extraMaioneses.length * 2
  return total
  }
  
  // Verifica se o item eh um lanche (burguer ou super_burguer)
  const isLanche = (item: MenuItem) => {
    return menuData.burgueres.some(b => b.id === item.id) || 
           menuData.super_burgueres.some(b => b.id === item.id)
  }

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
  addOn: selectedItem.addOns.find((a) => a.id === addOnId)!,
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

  const handleConfirmOrder = (orderData: OrderData) => {
    const deliveryFee = orderData.deliveryType === "entregar" ? 2 : 0
    const finalTotal = cartTotal + deliveryFee
    
    let message = `*CAPITAO BURGUER*\n`
    message += `Novo pedido recebido!\n\n`
    
    // Cliente e entrega em uma linha
    if (orderData.name) {
      message += `*Cliente:* ${orderData.name}\n`
    }
    if (orderData.deliveryType === "retirar") {
      message += `*Retirada no local*\n\n`
    } else {
      message += `*Entregar em:* ${orderData.address || "A combinar"}\n\n`
    }
    
    // Itens do pedido - formato compacto
    message += `*Pedido:*\n`
    cart.forEach((cartItem) => {
      const itemTotal = cartItem.item.price * cartItem.quantity
      message += `> ${cartItem.quantity}x ${cartItem.item.name} - R$${itemTotal.toFixed(2)}\n`
      
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
    
    window.open(`https://wa.me/5517997173099?text=${encodeURIComponent(message)}`, "_blank")
    
    // Limpar carrinho apos finalizar
    setCart([])
    setShowCheckout(false)
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

  {/* Subcategories bar for bebidas */}
  {selectedCategory === "bebidas" && (
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
  {selectedCategory === "bebidas" && selectedSubcategory === "Todos" ? (
  // Bebidas mostrando todas agrupadas por subcategoria
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
                        <div className="absolute bottom-2 right-2 bg-gradient-to-r from-red-700 to-red-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg border border-red-500/30"
                          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          R$ {item.price.toFixed(2)}
                        </div>
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
                  <div className="absolute bottom-2 right-2 bg-gradient-to-r from-red-700 to-red-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg border border-red-500/30"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    R$ {item.price.toFixed(2)}
                  </div>
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
  {maionesesOptions.map((maio) => (
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
  {maionesesOptions.map((maio) => {
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
  {selectedItem.addOns.length > 0 && (
  <div className="border-b border-amber-900/30 pb-4 mb-4">
  <div className="flex items-center justify-between mb-3">
  <h3 className="text-amber-100 font-bold">ACRESCIMOS</h3>
  <span className="text-amber-600 text-xs">(Opcional)</span>
  </div>
  
  <div className="space-y-3">
  {selectedItem.addOns.map((addOn) => (
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
