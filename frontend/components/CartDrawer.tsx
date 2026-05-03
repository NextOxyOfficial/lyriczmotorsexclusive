'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { useCart } from '@/lib/cart'

export default function CartDrawer() {
  const { items, count, total, drawerOpen, closeDrawer, removeItem, updateQty } = useCart()

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0d1117] transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
      >
        {/* Sticky top close bar — always visible on mobile, sits below fixed site header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d1117] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-volt/30 bg-volt/10 text-volt clip-panel">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <span>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Cart</p>
              <p className="text-sm font-black text-white">{count} {count === 1 ? 'item' : 'items'}</p>
            </span>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center border border-white/10 text-slate-400 hover:text-white clip-panel"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingCart className="h-12 w-12 text-slate-600" />
              <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-slate-500">Cart is empty</p>
              <p className="mt-1 text-xs text-slate-600">Add a bike or spare part to start.</p>
              <button
                type="button"
                onClick={closeDrawer}
                className="mt-8 border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400 clip-panel hover:border-volt/40 hover:text-volt"
              >
                ← Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 border border-white/10 bg-white/[0.03] p-3 clip-panel">
                  <img src={item.image_url} alt={item.name} className="h-20 w-20 flex-shrink-0 object-cover clip-panel" />
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-black uppercase leading-tight text-white">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex-shrink-0 text-slate-500 hover:text-ignition"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-white/10 clip-panel">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-3 py-2 text-slate-400 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-3 py-2 text-slate-400 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-black text-volt">{formatMoney(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Order Total</p>
              <p className="text-2xl font-black text-volt">{formatMoney(total)}</p>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="inline-flex w-full items-center justify-center gap-2 bg-volt px-5 py-4 text-sm font-black uppercase text-asphalt clip-panel"
            >
              Proceed to Checkout
            </Link>
            <button
              type="button"
              onClick={closeDrawer}
              className="mt-3 w-full py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500 hover:text-white"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value)
}
