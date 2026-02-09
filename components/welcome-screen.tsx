"use client"

// Capitao Burguer - Tela de Boas Vindas
import Image from "next/image"
import { useState, useEffect } from "react"

interface WelcomeScreenProps {
  onViewMenu: () => void
}

function useIsOpen() {
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date()
      const hours = now.getHours()
      const dayOfWeek = now.getDay() // 0 = Domingo, 1 = Segunda
      // Fechado na segunda-feira (dia 1). Aberto de terca a domingo das 18h ate 00:00
      const isMonday = dayOfWeek === 1
      const open = !isMonday && hours >= 18
      setIsOpen(open)
    }
    
    checkIfOpen()
    const interval = setInterval(checkIfOpen, 60000)
    return () => clearInterval(interval)
  }, [])
  
  return isOpen
}

export function WelcomeScreen({ onViewMenu }: WelcomeScreenProps) {
  const isOpen = useIsOpen()
  
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background */}
      <Image
        src="/images/bg-pirate-deck.jpg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-transparent to-amber-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(255,180,80,0.35)_0%,_transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,100,0,0.2)_0%,_transparent_50%)]" />

      {/* Ember particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${3 + (i % 4)}px`,
              height: `${3 + (i % 4)}px`,
              background: `radial-gradient(circle, rgba(255,${180 + (i * 3)},80,1) 0%, rgba(255,120,0,0.8) 50%, transparent 70%)`,
              left: `${3 + (i * 4.5)}%`,
              top: `${8 + (i * 4)}%`,
              boxShadow: `0 0 ${8 + (i % 5)}px rgba(255,150,50,0.9), 0 0 ${15 + (i % 5)}px rgba(255,100,0,0.5)`,
              animation: `float ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Smoke bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 via-amber-900/10 to-transparent pointer-events-none" />

      {/* Main content - fill entire screen, distribute vertically */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Top section: Logo */}
        <div className="relative mt-4 sm:mt-6">
          <div className="absolute inset-0 bg-amber-400/30 blur-[60px] rounded-full scale-[1.8]" />
          <div className="absolute inset-0 bg-yellow-500/20 blur-[40px] rounded-full scale-150" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52">
            <Image
              src="/images/logo.png"
              alt="Capitao Burguer Logo"
              fill
              className="object-contain"
              style={{
                filter: 'drop-shadow(0 0 25px rgba(255,200,100,0.7)) drop-shadow(0 0 50px rgba(212,175,55,0.5)) drop-shadow(0 0 80px rgba(255,150,50,0.3))'
              }}
              priority
            />
          </div>
        </div>

        {/* Middle section: Texts + Status + Button */}
        <div className="flex flex-col items-center">
          {/* Welcome text */}
          <p 
            className="text-base sm:text-xl md:text-2xl tracking-[0.2em] font-bold mb-1 text-center"
            style={{ 
              color: '#D4AF37',
              textShadow: '0 0 30px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4), 0 3px 6px rgba(0,0,0,0.9)'
            }}
          >
            BEM-VINDO A BORDO
          </p>

          {/* Title */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-1 tracking-wide"
            style={{ 
              background: 'linear-gradient(180deg, #DC2626 0%, #B91C1C 40%, #991B1B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(220,38,38,0.8)) drop-shadow(0 0 30px rgba(220,38,38,0.5))',
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            <span style={{
              textShadow: '0 0 20px rgba(212,175,55,0.6), 0 4px 0 #7F1D1D, 0 5px 0 #5C0A0A, 0 6px 0 #3D0606, 0 10px 20px rgba(0,0,0,0.9)',
              WebkitTextFillColor: '#DC2626'
            }}>
              CAPITAO BURGUER
            </span>
          </h1>

          {/* Tagline */}
          <p 
            className="text-sm sm:text-lg md:text-xl text-center mb-5 italic"
            style={{ 
              color: '#F5E6C8',
              textShadow: '0 0 20px rgba(245,230,200,0.5), 0 2px 10px rgba(0,0,0,0.9)'
            }}
          >
            O hamburguer que domina os sete mares
          </p>

          {/* Status Card */}
          <div 
            className="relative rounded-xl px-5 py-2.5 mb-5"
            style={{
              background: 'linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.95) 100%)',
              border: `3px solid ${isOpen ? '#22C55E' : '#EF4444'}`,
              boxShadow: isOpen 
                ? '0 0 20px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.2)' 
                : '0 0 20px rgba(239,68,68,0.4), 0 0 40px rgba(239,68,68,0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                style={{
                  boxShadow: isOpen 
                    ? '0 0 10px rgba(34,197,94,0.8), 0 0 20px rgba(34,197,94,0.5)' 
                    : '0 0 10px rgba(239,68,68,0.8), 0 0 20px rgba(239,68,68,0.5)',
                  animation: 'pulse-dot 2s ease-in-out infinite'
                }}
              />
              <div className="flex flex-col">
                <span 
                  className={`text-sm sm:text-base font-bold ${isOpen ? 'text-green-400' : 'text-red-400'}`}
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {isOpen ? 'ABERTO' : 'FECHADO'}
                </span>
                <span className="text-xs sm:text-sm text-amber-200/80">
                  Ter a Dom - A partir das 18h
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onViewMenu}
            className="relative rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
            style={{
              padding: '14px 44px',
              background: 'linear-gradient(180deg, #A63A00 0%, #8B2500 30%, #6B1A00 70%, #4A1200 100%)',
              border: '4px solid #D4AF37',
              boxShadow: '0 0 20px rgba(212,175,55,0.6), 0 8px 25px rgba(0,0,0,0.7)',
              color: '#FFE4B5',
              textShadow: '0 3px 6px rgba(0,0,0,0.7)',
              animationDuration: '2s'
            }}
          >
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-amber-400" />
            
            <span className="relative z-10 flex items-center gap-2">
              <span role="img" aria-label="hamburguer">🍔</span>
              <span>Ver Cardapio</span>
            </span>
          </button>
        </div>

        {/* Bottom section: Social icons */}
        <div className="flex flex-row items-center justify-center gap-6 sm:gap-8 mb-2">
          {/* WhatsApp */}
          <button
            onClick={() => window.open("https://wa.me/5517997173099", "_blank")}
            className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
            aria-label="WhatsApp"
          >
            <div 
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center icon-glow-green"
              style={{
                background: 'linear-gradient(145deg, #5A5A5A 0%, #3A3A3A 40%, #252525 100%)',
                border: '3px solid #D4AF37',
              }}
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#25D366]" style={{ filter: 'drop-shadow(0 0 10px rgba(37,211,102,1))' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <span className="text-amber-100 text-xs sm:text-sm font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>WhatsApp</span>
          </button>

          {/* Instagram */}
          <button
            onClick={() => window.open("https://www.instagram.com/_capitaoburguer/", "_blank")}
            className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
          >
            <div 
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center icon-glow-pink"
              style={{
                background: 'linear-gradient(145deg, #5A5A5A 0%, #3A3A3A 40%, #252525 100%)',
                border: '3px solid #D4AF37',
              }}
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8" style={{ filter: 'drop-shadow(0 0 10px rgba(228,64,95,1))' }} fill="url(#ig-gradient)" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFDC80" />
                    <stop offset="25%" stopColor="#F77737" />
                    <stop offset="50%" stopColor="#E4405F" />
                    <stop offset="75%" stopColor="#833AB4" />
                    <stop offset="100%" stopColor="#5B51D8" />
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span className="text-amber-100 text-xs sm:text-sm font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>Instagram</span>
          </button>

          {/* Localizacao */}
          <button
            onClick={() => window.open("https://www.google.com/maps/search/R.+Antenor+Brand%C3%A3o+365+para%C3%ADso+sp", "_blank")}
            className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
            aria-label="Localizacao"
          >
            <div 
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center icon-glow-red"
              style={{
                background: 'linear-gradient(145deg, #5A5A5A 0%, #3A3A3A 40%, #252525 100%)',
                border: '3px solid #D4AF37',
              }}
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#EA4335]" style={{ filter: 'drop-shadow(0 0 10px rgba(234,67,53,1))' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="text-amber-100 text-xs sm:text-sm font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>Localizacao</span>
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7; }
          50% { transform: translateY(-20px) translateX(5px); opacity: 1; }
        }
        @keyframes glow-green {
          0%, 100% { box-shadow: 0 0 15px rgba(37,211,102,0.5), 0 0 30px rgba(37,211,102,0.3), inset 0 3px 8px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 25px rgba(37,211,102,0.8), 0 0 50px rgba(37,211,102,0.5), inset 0 3px 8px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.5); }
        }
        @keyframes glow-pink {
          0%, 100% { box-shadow: 0 0 15px rgba(228,64,95,0.5), 0 0 30px rgba(131,58,180,0.3), inset 0 3px 8px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 25px rgba(228,64,95,0.8), 0 0 50px rgba(131,58,180,0.5), inset 0 3px 8px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.5); }
        }
        @keyframes glow-red {
          0%, 100% { box-shadow: 0 0 15px rgba(234,67,53,0.5), 0 0 30px rgba(234,67,53,0.3), inset 0 3px 8px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 25px rgba(234,67,53,0.8), 0 0 50px rgba(234,67,53,0.5), inset 0 3px 8px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.5); }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .icon-glow-green { animation: glow-green 2s ease-in-out infinite; }
        .icon-glow-pink { animation: glow-pink 2s ease-in-out infinite 0.3s; }
        .icon-glow-red { animation: glow-red 2s ease-in-out infinite 0.6s; }
      `}</style>
    </div>
  )
}
