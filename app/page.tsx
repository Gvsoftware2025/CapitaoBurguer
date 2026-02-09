"use client"

import { useState, useEffect, useRef } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { LoadingScreen } from "@/components/loading-screen"
import { MenuScreen } from "@/components/menu-screen"

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "loading" | "menu">("welcome")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleViewMenu = () => {
    setScreen("loading")
  }

  // Efeito separado para controlar a transicao do loading para o menu
  useEffect(() => {
    if (screen === "loading") {
      // Limpa qualquer timer anterior
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      // Define novo timer
      timerRef.current = setTimeout(() => {
        setScreen("menu")
      }, 3000)
    }

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [screen])

  const handleBackToWelcome = () => {
    setScreen("welcome")
  }

  return (
    <main className="min-h-screen">
      {screen === "welcome" && <WelcomeScreen onViewMenu={handleViewMenu} />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "menu" && <MenuScreen onBack={handleBackToWelcome} />}
    </main>
  )
}
