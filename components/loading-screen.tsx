"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [textIndex, setTextIndex] = useState(0)

  const loadingTexts = [
    "Acendendo a churrasqueira...",
    "Preparando os ingredientes...", 
    "Temperando a carne...",
    "Montando seu pedido...",
    "Quase pronto..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % loadingTexts.length)
    }, 600)
    return () => clearInterval(textInterval)
  }, [])

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('/images/bg-loading.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay with vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 250px 80px rgba(0,0,0,0.95)' }} />
      
      {/* Animated background rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full border border-amber-600/10"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse-ring 3s ease-out infinite',
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full border border-amber-500/15"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse-ring 3s ease-out infinite 0.5s',
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full border border-amber-400/20"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse-ring 3s ease-out infinite 1s',
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div 
        className="absolute w-32 h-32 rounded-full opacity-30"
        style={{
          top: '20%',
          left: '15%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute w-24 h-24 rounded-full opacity-25"
        style={{
          bottom: '25%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)',
          filter: 'blur(25px)',
          animation: 'float 5s ease-in-out infinite 1s',
        }}
      />
      <div 
        className="absolute w-20 h-20 rounded-full opacity-20"
        style={{
          top: '60%',
          left: '8%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.5) 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'float 7s ease-in-out infinite 2s',
        }}
      />

      {/* Spark particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400"
          style={{
            left: `${15 + (i * 6)}%`,
            bottom: '10%',
            opacity: 0.6,
            animation: `spark ${2 + (i % 3)}s ease-out infinite ${i * 0.2}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        
        {/* Logo with rotating ring */}
        <div className="relative mb-10">
          {/* Outer rotating ring */}
          <div 
            className="absolute inset-0 w-44 h-44 sm:w-52 sm:h-52 -m-4 sm:-m-6"
            style={{
              animation: 'spin 20s linear infinite',
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle 
                cx="100" cy="100" r="95" 
                fill="none" 
                stroke="url(#gold-gradient)" 
                strokeWidth="1"
                strokeDasharray="8 12"
                opacity="0.4"
              />
              <defs>
                <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Inner counter-rotating ring */}
          <div 
            className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 -m-2 sm:-m-4"
            style={{
              animation: 'spin 15s linear infinite reverse',
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle 
                cx="100" cy="100" r="95" 
                fill="none" 
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 20"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Glowing background behind logo */}
          <div 
            className="absolute inset-0 w-36 h-36 sm:w-40 sm:h-40 m-auto rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }}
          />

          {/* Logo */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40">
            <Image
              src="/images/logo.png"
              alt="Capitao Burguer"
              fill
              className="object-contain"
              style={{ 
                filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.6))',
                animation: 'logo-float 3s ease-in-out infinite',
              }}
              priority
            />
          </div>
        </div>

        {/* Title with animated text */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl sm:text-5xl font-bold tracking-widest mb-3"
            style={{ 
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(251,191,36,0.5)',
              animation: 'text-shimmer 3s ease-in-out infinite',
            }}
          >
            PREPARANDO
          </h1>
          
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/60" />
            <p 
              className="text-amber-400 text-sm sm:text-base tracking-[0.3em] uppercase"
              style={{ textShadow: '0 0 15px rgba(251,191,36,0.4)' }}
            >
              O Cardapio
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/60" />
          </div>
        </div>

        {/* Modern progress bar */}
        <div className="w-72 sm:w-80">
          {/* Bar container */}
          <div 
            className="relative h-3 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(30,20,10,0.8) 100%)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), 0 1px 0 rgba(255,200,100,0.1)',
              border: '1px solid rgba(139,90,43,0.3)',
            }}
          >
            {/* Progress fill with animated gradient */}
            <div 
              className="h-full rounded-full relative overflow-hidden transition-all duration-100 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24, #f59e0b)',
                backgroundSize: '200% 100%',
                animation: 'gradient-move 2s linear infinite',
                boxShadow: '0 0 20px rgba(251,191,36,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              {/* Shine effect */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  animation: 'shine 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>
          
          {/* Progress info */}
          <div className="flex justify-between items-center mt-4">
            <span 
              className="text-amber-500/90 text-xs sm:text-sm transition-all duration-300"
              style={{ 
                textShadow: '0 0 10px rgba(251,191,36,0.3)',
                animation: 'fade-text 0.5s ease-in-out',
              }}
              key={textIndex}
            >
              {loadingTexts[textIndex]}
            </span>
            <span 
              className="text-amber-300 text-base sm:text-lg font-bold tabular-nums"
              style={{ 
                textShadow: '0 0 15px rgba(251,191,36,0.5)',
              }}
            >
              {progress}%
            </span>
          </div>
        </div>

        {/* Animated hamburger icon building effect */}
        <div className="mt-10 flex items-end gap-1">
          {['bg-amber-800', 'bg-green-600', 'bg-red-500', 'bg-amber-400', 'bg-amber-800'].map((color, i) => (
            <div
              key={i}
              className={`rounded-sm ${color}`}
              style={{
                width: i === 0 || i === 4 ? '40px' : '36px',
                height: i === 0 || i === 4 ? '10px' : '6px',
                opacity: progress > (i * 20) ? 1 : 0.2,
                transform: progress > (i * 20) ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.8)',
                transition: `all 0.4s ease-out ${i * 0.1}s`,
                boxShadow: progress > (i * 20) ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p 
          className="text-amber-600/50 text-xs tracking-wider"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
        >
          @{new Date().getFullYear()} GVSoftware - Todos os direitos reservados
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        @keyframes spark {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes logo-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes text-shimmer {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }
        
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        
        @keyframes fade-text {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
