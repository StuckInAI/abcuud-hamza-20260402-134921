'use client'

import CalcButton from './CalcButton'

interface ButtonGridProps {
  onButton: (value: string) => void
  hasError: boolean
}

const buttons = [
  // Row 1
  { label: 'AC', type: 'function' as const, span: 1 },
  { label: 'CE', type: 'function' as const, span: 1 },
  { label: '%', type: 'function' as const, span: 1 },
  { label: '÷', type: 'operator' as const, span: 1 },
  // Row 2
  { label: '7', type: 'number' as const, span: 1 },
  { label: '8', type: 'number' as const, span: 1 },
  { label: '9', type: 'number' as const, span: 1 },
  { label: '×', type: 'operator' as const, span: 1 },
  // Row 3
  { label: '4', type: 'number' as const, span: 1 },
  { label: '5', type: 'number' as const, span: 1 },
  { label: '6', type: 'number' as const, span: 1 },
  { label: '-', type: 'operator' as const, span: 1 },
  // Row 4
  { label: '1', type: 'number' as const, span: 1 },
  { label: '2', type: 'number' as const, span: 1 },
  { label: '3', type: 'number' as const, span: 1 },
  { label: '+', type: 'operator' as const, span: 1 },
  // Row 5
  { label: '+/-', type: 'function' as const, span: 1 },
  { label: '0', type: 'number' as const, span: 1 },
  { label: '.', type: 'number' as const, span: 1 },
  { label: '=', type: 'equals' as const, span: 1 },
]

export default function ButtonGrid({ onButton, hasError }: ButtonGridProps) {
  return (
    <div className="grid grid-cols-4 gap-px bg-slate-700 p-px">
      {buttons.map((btn, index) => (
        <CalcButton
          key={index}
          label={btn.label}
          type={btn.type}
          onClick={() => onButton(btn.label)}
          disabled={hasError && btn.label !== 'AC'}
        />
      ))}
    </div>
  )
}
