'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarClock, CheckCircle2, Loader2, X } from 'lucide-react'

export type BookingItem = {
  name: string
  product_type: 'bike' | 'spare_part' | 'service' | string
}

type Props = {
  open: boolean
  item: BookingItem | null
  onClose: () => void
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

const intentMap: Record<string, string> = {
  bike: 'buy_bike',
  spare_part: 'buy_part',
  service: 'service',
}

export default function BookingModal({ open, item, onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName('')
      setPhone('')
      setEmail('')
      setMessage('')
      setStatus('idle')
      setErrorMsg('')
      setTimeout(() => nameRef.current?.focus(), 100)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !item) return null

  const intent = intentMap[item.product_type] ?? 'buy_bike'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`${apiBaseUrl}/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          intent,
          message: message.trim(),
          source: item.name,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Book this item"
        className="fixed inset-x-4 top-1/2 z-[90] mx-auto max-w-lg -translate-y-1/2 border border-white/10 bg-[#0d1117] shadow-hud clip-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-volt/30 bg-volt/10 text-volt clip-panel">
              <CalendarClock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Book Now</p>
              <p className="text-sm font-black uppercase text-white leading-tight">{item.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border border-white/10 text-slate-400 clip-panel hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {status === 'success' ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-volt" />
              <p className="mt-4 text-lg font-black uppercase text-white">Booking Received!</p>
              <p className="mt-2 text-sm text-slate-400">
                আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-300 clip-panel hover:border-volt/40 hover:text-volt"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected item chip */}
              <div className="flex items-center gap-2 border border-volt/20 bg-volt/5 px-3 py-2 clip-panel">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Item:</span>
                <span className="text-xs font-black uppercase text-volt">{item.name}</span>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Name <span className="text-ignition">*</span>
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="আপনার নাম"
                  className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-volt/50 clip-panel"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Phone <span className="text-ignition">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-volt/50 clip-panel"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Email <span className="text-slate-600">(optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-volt/50 clip-panel"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Message <span className="text-slate-600">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="কোনো বিশেষ প্রশ্ন বা নোট থাকলে লিখুন..."
                  className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-volt/50 clip-panel resize-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-ignition">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex w-full items-center justify-center gap-2 bg-volt px-5 py-4 text-sm font-black uppercase text-asphalt clip-panel disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                ) : (
                  <><CalendarClock className="h-4 w-4" /> Confirm Booking</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
