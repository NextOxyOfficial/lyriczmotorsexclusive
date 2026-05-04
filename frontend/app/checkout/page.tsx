'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, ChevronLeft, Loader2, ShieldCheck, Truck, Store } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { trackMarketingEvent } from '@/lib/tracking'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

type FormData = {
  customer_name: string
  customer_phone: string
  customer_email: string
  address: string
  delivery_method: 'pickup' | 'delivery'
  payment_method: 'bkash' | 'nagad' | 'cod' | 'bank'
  notes: string
}

const PAYMENT_LABELS: Record<string, string> = {
  bkash: 'bKash',
  nagad: 'Nagad',
  cod: 'Cash on Delivery',
  bank: 'Bank Transfer',
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, count } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address: '',
    delivery_method: 'pickup',
    payment_method: 'cod',
    notes: '',
  })

  useEffect(() => {
    trackMarketingEvent('InitiateCheckout', {
      value: total,
      currency: 'BDT',
      num_items: count,
      page_url: window.location.href,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleDelivery = (v: 'pickup' | 'delivery') => setForm((prev) => ({ ...prev, delivery_method: v }))
  const handlePayment = (v: FormData['payment_method']) => setForm((prev) => ({ ...prev, payment_method: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setIsSubmitting(true)
    setError(null)

    const utmSource = new URLSearchParams(window.location.search).get('utm_source') || ''
    const utmMedium = new URLSearchParams(window.location.search).get('utm_medium') || ''
    const utmCampaign = new URLSearchParams(window.location.search).get('utm_campaign') || ''

    const payload = {
      ...form,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      items: items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_type: item.product_type,
        price: item.price.toFixed(2),
        quantity: item.quantity,
        image_url: item.image_url,
      })),
    }

    try {
      const res = await fetch(`${apiBaseUrl}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail || `Server error ${res.status}`)
      }

      const order = await res.json()

      trackMarketingEvent('Purchase', {
        value: total,
        currency: 'BDT',
        order_id: order.order_number,
        page_url: window.location.href,
      })

      clearCart()
      router.push(`/order-confirmation?ref=${order.order_number}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-asphalt text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-asphalt/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-volt">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Garage</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="min-w-0 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 sm:text-xs">Secure Checkout</p>
            <p className="truncate text-sm font-black uppercase tracking-[0.2em] text-volt">Lyricz Motors</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs text-volt">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-black uppercase tracking-[0.15em]">Secure</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl gap-8 px-2 py-8 lg:grid lg:grid-cols-3 lg:items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
          {/* Contact */}
          <section className="border border-white/10 bg-white/[0.03] p-6 clip-panel">
            <h2 className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-volt">Customer Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *" name="customer_name" value={form.customer_name} onChange={handleChange} required placeholder="Your full name" />
              <Field label="Phone Number *" name="customer_phone" value={form.customer_phone} onChange={handleChange} required type="tel" placeholder="+880 17..." />
              <Field label="Email (optional)" name="customer_email" value={form.customer_email} onChange={handleChange} type="email" placeholder="you@example.com" className="sm:col-span-2" />
            </div>
          </section>

          {/* Delivery */}
          <section className="border border-white/10 bg-white/[0.03] p-6 clip-panel">
            <h2 className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-volt">Delivery Method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <DeliveryOption
                value="pickup"
                selected={form.delivery_method === 'pickup'}
                onClick={() => handleDelivery('pickup')}
                icon={<Store className="h-5 w-5" />}
                label="Showroom Pickup"
                sub="Visit us in Dhaka"
              />
              <DeliveryOption
                value="delivery"
                selected={form.delivery_method === 'delivery'}
                onClick={() => handleDelivery('delivery')}
                icon={<Truck className="h-5 w-5" />}
                label="Home Delivery"
                sub="Delivery charge may apply"
              />
            </div>
            {form.delivery_method === 'delivery' && (
              <div className="mt-4">
                <label className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required={form.delivery_method === 'delivery'}
                  rows={3}
                  placeholder="House, Road, Area, City..."
                  className="w-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-volt/40 focus:bg-white/[0.08] clip-panel resize-none"
                />
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="border border-white/10 bg-white/[0.03] p-6 clip-panel">
            <h2 className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-volt">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(['bkash', 'nagad', 'cod', 'bank'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handlePayment(method)}
                  className={`border p-4 text-center clip-panel transition-all ${
                    form.payment_method === method
                      ? 'border-volt/60 bg-volt/10 text-volt'
                      : 'border-white/10 bg-transparent text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.1em]">{PAYMENT_LABELS[method]}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className="border border-white/10 bg-white/[0.03] p-6 clip-panel">
            <h2 className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-volt">Order Notes (optional)</h2>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special instructions, preferred contact time, etc."
              className="w-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-volt/40 focus:bg-white/[0.08] clip-panel resize-none"
            />
          </section>

          {error && (
            <div className="flex items-start gap-3 border border-ignition/40 bg-ignition/10 px-4 py-3 text-sm text-ignition clip-panel">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="flex w-full items-center justify-center gap-3 bg-volt px-6 py-5 text-sm font-black uppercase tracking-[0.25em] text-asphalt clip-panel disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Place Order — {formatMoney(total)}
              </>
            )}
          </button>
        </form>

        {/* Order Summary */}
        <div className="sticky top-24 space-y-4">
          <div className="border border-white/10 bg-white/[0.03] clip-panel">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-volt">Order Summary</p>
            </div>
            <ul className="divide-y divide-white/10">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <img src={item.image_url} alt={item.name} className="h-12 w-12 flex-shrink-0 object-cover clip-panel" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-black uppercase text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-black text-volt">{formatMoney(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Total</p>
                <p className="text-xl font-black text-volt">{formatMoney(total)}</p>
              </div>
            </div>
          </div>

          <div className="border border-volt/20 bg-volt/[0.04] px-5 py-4 text-xs text-slate-400 clip-panel">
            <p className="mb-1 font-black uppercase tracking-[0.2em] text-volt">Need help?</p>
            <p>Call us or WhatsApp: <span className="font-black text-white">+880 1XXXXXXXXX</span></p>
          </div>
        </div>
      </main>
    </div>
  )
}

// ---- Helpers ----

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value)
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  className = '',
}: {
  label: string
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  type?: string
  required?: boolean
  placeholder?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-volt/40 focus:bg-white/[0.08] clip-panel"
      />
    </div>
  )
}

function DeliveryOption({
  selected,
  onClick,
  icon,
  label,
  sub,
}: {
  value: string
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 border p-4 text-left clip-panel transition-all ${
        selected
          ? 'border-volt/60 bg-volt/10 text-volt'
          : 'border-white/10 bg-transparent text-slate-400 hover:border-white/20 hover:text-white'
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>
        <p className="text-xs font-black uppercase tracking-[0.1em]">{label}</p>
        <p className={`text-[11px] ${selected ? 'text-volt/60' : 'text-slate-600'}`}>{sub}</p>
      </span>
    </button>
  )
}
