'use client'

import { CalculatorState } from './Calculator'

interface DisplayProps {
  state: CalculatorState
}

export default function Display({ state }: DisplayProps) {
  const { currentValue, expression, hasError } = state

  const getFontSize = (value: string) => {
    if (value.length > 12) return 'text-2xl'
    if (value.length > 9) return 'text-3xl'
    if (value.length > 6) return 'text-4xl'
    return 'text-5xl'
  }

  return (
    <div className="bg-slate-800 px-6 py-6 min-h-[140px] flex flex-col justify-end items-end">
      {/* Expression line */}
      <div className="text-slate-400 text-sm h-6 mb-2 truncate w-full text-right">
        {expression || '\u00A0'}
      </div>

      {/* Main display */}
      <div
        className={`font-light tracking-wider transition-all duration-150 ${
          hasError
            ? 'text-red-400 text-2xl'
            : `text-white ${getFontSize(currentValue)}`
        }`}
      >
        {hasError ? currentValue : formatDisplay(currentValue)}
      </div>
    </div>
  )
}

function formatDisplay(value: string): string {
  if (value.includes('e') || value.includes('E')) return value
  const parts = value.split('.')
  const intPart = parts[0].replace(/^-/, '')
  const sign = parts[0].startsWith('-') ? '-' : ''
  const formatted = parseInt(intPart, 10).toLocaleString()
  if (isNaN(parseInt(intPart, 10))) return value
  return parts.length > 1 ? `${sign}${formatted}.${parts[1]}` : `${sign}${formatted}`
}
