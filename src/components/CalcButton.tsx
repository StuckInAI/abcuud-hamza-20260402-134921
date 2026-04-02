'use client'

import { useState } from 'react'

interface CalcButtonProps {
  label: string
  type: 'number' | 'operator' | 'function' | 'equals'
  onClick: () => void
  disabled?: boolean
  span?: number
}

const typeStyles: Record<string, string> = {
  number: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white',
  operator: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-white',
  function: 'bg-slate-600 hover:bg-slate-500 active:bg-slate-400 text-slate-100',
  equals: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white',
}

export default function CalcButton({
  label,
  type,
  onClick,
  disabled = false,
}: CalcButtonProps) {
  const [pressed, setPressed] = useState(false)

  const handleClick = () => {
    if (disabled) return
    setPressed(true)
    setTimeout(() => setPressed(false), 100)
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative flex items-center justify-center
        h-16 text-xl font-medium
        transition-all duration-75 select-none
        ${typeStyles[type]}
        ${disabled && label !== 'AC' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${pressed ? 'scale-95' : 'scale-100'}
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20
      `}
      aria-label={label}
    >
      <span className="relative z-10">{label}</span>
    </button>
  )
}
