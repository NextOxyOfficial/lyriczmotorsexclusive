'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Home, Package } from 'lucide-react'

function OrderConfirmationContent() {
  const params = useSearchParams()
  const orderRef = params.get('ref') || 'N/A'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-asphalt px-4 text-center text-white">
      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 hud-grid opacity-10" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        {/* Success badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex h-20 w-20 items-center justify-center border border-volt/40 bg-volt/10 clip-panel">
            <CheckCircle2 className="h-10 w-10 text-volt" />
          </span>
        </div>

        <p className="mb-2 text-xs font-black uppercase tracking-[0.4em] text-volt">Order Placed</p>
        <h1 className="mb-3 text-3xl font-black uppercase tracking-tight">Thank You!</h1>
        <p className="mb-1 text-sm text-slate-400">
          Your order has been received. We will contact you shortly to confirm.
        </p>

        {/* Order number */}
        <div className="my-8 border border-volt/20 bg-volt/[0.04] px-6 py-5 clip-panel">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Order Reference</p>
          <p className="mt-1 font-mono text-2xl font-black text-volt tracking-widest">#{orderRef}</p>
        </div>

        {/* What's next */}
        <div className="mb-8 border border-white/10 bg-white/[0.03] p-5 text-left clip-panel">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-slate-500">What Happens Next?</p>
          <ul className="space-y-2">
            {[
              'Our team will call you within 24 hours to confirm your order.',
              'Payment will be collected at pickup or on delivery.',
              'We will share an estimated timeline for availability.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border border-volt/30 bg-volt/10 text-[10px] font-black text-volt clip-panel">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-white/10 px-6 py-4 text-xs font-black uppercase tracking-[0.25em] text-slate-400 hover:text-white clip-panel"
          >
            <Home className="h-4 w-4" />
            Back to Garage
          </Link>
          <Link
            href="/spare-parts"
            className="flex items-center justify-center gap-2 bg-volt px-6 py-4 text-xs font-black uppercase tracking-[0.25em] text-asphalt clip-panel"
          >
            <Package className="h-4 w-4" />
            Shop More Parts
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center bg-asphalt">
        <div className="h-8 w-8 animate-spin border-2 border-volt border-t-transparent clip-panel" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
