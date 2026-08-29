import React, { useState, useEffect, useRef } from 'react'

export default function OtpInput({ value, onChange, error, onResend, resendDisabled }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  useEffect(() => {
    if (value && value.length === 6) {
      setDigits(value.split(''))
    }
  }, [value])

  const handleChange = (index, val) => {
    if (!/^\d*$/.test(val)) return
    const newDigits = [...digits]
    newDigits[index] = val.slice(-1)
    setDigits(newDigits)
    onChange(newDigits.join(''))
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted) {
      const newDigits = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
      setDigits(newDigits)
      onChange(newDigits.join(''))
      inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-3">Enter OTP</label>
      <div className="flex gap-2 justify-center">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`w-12 h-14 text-center text-xl font-bold input-field ${
              digit ? 'border-sky-500 bg-sky-600' : ''
            } ${error ? 'error' : ''}`}
          />
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-2 text-center" role="alert">
          {error.message}
        </p>
      )}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onResend}
          disabled={resendDisabled}
          className={`text-sm font-medium ${
            resendDisabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-sky-600 hover:text-sky-700 cursor-pointer'
          }`}
        >
          {resendDisabled ? `Resend OTP in ${60}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  )
}
