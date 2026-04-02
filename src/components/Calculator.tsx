'use client'

import { useState, useCallback, useEffect } from 'react'
import Display from './Display'
import ButtonGrid from './ButtonGrid'

export type CalculatorState = {
  currentValue: string
  previousValue: string
  operator: string | null
  waitingForOperand: boolean
  expression: string
  hasError: boolean
}

const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: '',
  operator: null,
  waitingForOperand: false,
  expression: '',
  hasError: false,
}

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>(initialState)

  const handleDigit = useCallback((digit: string) => {
    setState((prev) => {
      if (prev.hasError) return prev
      if (prev.waitingForOperand) {
        return {
          ...prev,
          currentValue: digit,
          waitingForOperand: false,
        }
      }
      if (prev.currentValue === '0' && digit !== '.') {
        return { ...prev, currentValue: digit }
      }
      if (digit === '.' && prev.currentValue.includes('.')) {
        return prev
      }
      if (prev.currentValue.length >= 15) return prev
      return { ...prev, currentValue: prev.currentValue + digit }
    })
  }, [])

  const handleOperator = useCallback((op: string) => {
    setState((prev) => {
      if (prev.hasError) return prev
      const current = parseFloat(prev.currentValue)

      if (prev.operator && !prev.waitingForOperand) {
        const previous = parseFloat(prev.previousValue)
        let result: number
        switch (prev.operator) {
          case '+':
            result = previous + current
            break
          case '-':
            result = previous - current
            break
          case '×':
            result = previous * current
            break
          case '÷':
            if (current === 0) {
              return {
                ...prev,
                currentValue: 'Error',
                expression: 'Cannot divide by zero',
                hasError: true,
                waitingForOperand: false,
              }
            }
            result = previous / current
            break
          default:
            result = current
        }
        const resultStr = formatResult(result)
        return {
          ...prev,
          currentValue: resultStr,
          previousValue: resultStr,
          operator: op,
          waitingForOperand: true,
          expression: `${resultStr} ${op}`,
        }
      }

      return {
        ...prev,
        previousValue: prev.currentValue,
        operator: op,
        waitingForOperand: true,
        expression: `${prev.currentValue} ${op}`,
      }
    })
  }, [])

  const handleEquals = useCallback(() => {
    setState((prev) => {
      if (prev.hasError || !prev.operator || prev.waitingForOperand) return prev
      const current = parseFloat(prev.currentValue)
      const previous = parseFloat(prev.previousValue)
      let result: number

      switch (prev.operator) {
        case '+':
          result = previous + current
          break
        case '-':
          result = previous - current
          break
        case '×':
          result = previous * current
          break
        case '÷':
          if (current === 0) {
            return {
              ...prev,
              currentValue: 'Error',
              expression: 'Cannot divide by zero',
              hasError: true,
            }
          }
          result = previous / current
          break
        default:
          return prev
      }

      const resultStr = formatResult(result)
      return {
        ...prev,
        currentValue: resultStr,
        previousValue: '',
        operator: null,
        waitingForOperand: true,
        expression: `${prev.previousValue} ${prev.operator} ${prev.currentValue} =`,
      }
    })
  }, [])

  const handleClear = useCallback(() => {
    setState(initialState)
  }, [])

  const handleClearEntry = useCallback(() => {
    setState((prev) => {
      if (prev.hasError) return initialState
      return { ...prev, currentValue: '0' }
    })
  }, [])

  const handleToggleSign = useCallback(() => {
    setState((prev) => {
      if (prev.hasError || prev.currentValue === '0') return prev
      const value = parseFloat(prev.currentValue)
      return { ...prev, currentValue: formatResult(-value) }
    })
  }, [])

  const handlePercent = useCallback(() => {
    setState((prev) => {
      if (prev.hasError) return prev
      const value = parseFloat(prev.currentValue)
      return { ...prev, currentValue: formatResult(value / 100) }
    })
  }, [])

  const handleBackspace = useCallback(() => {
    setState((prev) => {
      if (prev.hasError) return initialState
      if (prev.waitingForOperand) return prev
      if (prev.currentValue.length === 1 || (prev.currentValue.length === 2 && prev.currentValue.startsWith('-'))) {
        return { ...prev, currentValue: '0' }
      }
      return { ...prev, currentValue: prev.currentValue.slice(0, -1) }
    })
  }, [])

  const handleButton = useCallback(
    (value: string) => {
      switch (value) {
        case 'AC':
          handleClear()
          break
        case 'CE':
          handleClearEntry()
          break
        case '⌫':
          handleBackspace()
          break
        case '+/-':
          handleToggleSign()
          break
        case '%':
          handlePercent()
          break
        case '=':
          handleEquals()
          break
        case '+':
        case '-':
        case '×':
        case '÷':
          handleOperator(value)
          break
        default:
          handleDigit(value)
      }
    },
    [handleClear, handleClearEntry, handleBackspace, handleToggleSign, handlePercent, handleEquals, handleOperator, handleDigit]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      const key = e.key
      if (key >= '0' && key <= '9') handleButton(key)
      else if (key === '.') handleButton('.')
      else if (key === '+') handleButton('+')
      else if (key === '-') handleButton('-')
      else if (key === '*') handleButton('×')
      else if (key === '/') handleButton('÷')
      else if (key === 'Enter' || key === '=') handleButton('=')
      else if (key === 'Backspace') handleButton('⌫')
      else if (key === 'Escape') handleButton('AC')
      else if (key === '%') handleButton('%')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleButton])

  return (
    <div className="w-full max-w-sm">
      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        <Display state={state} />
        <ButtonGrid onButton={handleButton} hasError={state.hasError} />
      </div>
    </div>
  )
}

function formatResult(value: number): string {
  if (!isFinite(value)) return 'Error'
  if (Number.isInteger(value)) {
    const str = value.toString()
    if (str.length > 15) return value.toExponential(6)
    return str
  }
  const str = parseFloat(value.toPrecision(12)).toString()
  if (str.length > 15) return value.toExponential(6)
  return str
}
