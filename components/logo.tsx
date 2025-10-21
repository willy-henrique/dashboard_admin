"use client"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "h-8", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Ícone A com swoosh */}
      <div className="relative">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Letra A estilizada */}
          <path 
            d="M12 32 L20 12 L28 32 M15 25 L25 25" 
            stroke="#1e3a8a" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Swoosh laranja */}
          <path 
            d="M28 32 Q30 30 33 32" 
            stroke="#f97316" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Texto */}
      {showText && (
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold text-blue-900">Aqui</span>
          <span className="text-xl font-bold text-orange-500">Resolve</span>
        </div>
      )}
    </div>
  )
}
