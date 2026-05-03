'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Gauge, Search, ShoppingCart, SlidersHorizontal, Star } from 'lucide-react'

import { trackMarketingEvent } from '@/lib/tracking'
import { useCart } from '@/lib/cart'

type Product = {
  id: number
  name: string
  product_type: 'bike' | 'spare_part'
  category: string
  brand: string
  price: string
  compare_at_price?: string | null
  status: string
  image_url: string
  power_score: number
  short_description: string
  specs: Record<string, string>
  is_featured: boolean
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

const fallbackSpareParts: Product[] = [
  {
    id: 4,
    name: 'Carbon Apex Exhaust System',
    product_type: 'spare_part',
    category: 'Performance Exhaust',
    brand: 'Apex Works',
    price: '68000.00',
    compare_at_price: '76000.00',
    status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1400&q=85',
    power_score: 84,
    short_description: 'Lightweight carbon exhaust tuned for deeper tone and improved throttle response.',
    specs: { fitment: '250cc-650cc', material: 'Carbon fiber', install: 'Service center', warranty: '6 months' },
    is_featured: true,
  },
  {
    id: 5,
    name: 'Racing Brake Armor Kit',
    product_type: 'spare_part',
    category: 'Brake System',
    brand: 'Brembo Style',
    price: '42500.00',
    compare_at_price: null,
    status: 'limited',
    image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1400&q=85',
    power_score: 89,
    short_description: 'Premium brake upgrade bundle for confident high-speed control and heat resistance.',
    specs: { fitment: 'Sport / Naked', includes: 'Pads, lines, rotors', install: '90 min', warranty: '1 year' },
    is_featured: false,
  },
  {
    id: 6,
    name: 'VoltCore Chain And Sprocket Pack',
    product_type: 'spare_part',
    category: 'Drivetrain',
    brand: 'VoltCore',
    price: '22500.00',
    compare_at_price: '25500.00',
    status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1400&q=85',
    power_score: 81,
    short_description: 'Street performance chain kit with clean acceleration feel and reinforced durability.',
    specs: { fitment: '150cc-400cc', includes: 'Chain, front sprocket, rear sprocket', install: '45 min', warranty: '3 months' },
    is_featured: false,
  },
]

const categories = ['All', 'Performance Exhaust', 'Brake System', 'Drivetrain']

export default function SparePartsPage() {
  const [parts, setParts] = useState<Product[]>(fallbackSpareParts)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const { addItem } = useCart()

  useEffect(() => {
    trackMarketingEvent('ViewContent', { section: 'spare_parts' })

    async function loadParts() {
      try {
        const response = await fetch(`${apiBaseUrl}/products/?type=spare_part&page_size=50`, { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Unable to load spare parts')
        }

        const data = await response.json()
        const loadedParts = Array.isArray(data.results) ? data.results : data
        setParts(loadedParts.length ? loadedParts : fallbackSpareParts)
      } catch {
        setParts(fallbackSpareParts)
      }
    }

    loadParts()
  }, [])

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      const matchesCategory = category === 'All' || part.category === category
      const searchText = `${part.name} ${part.brand} ${part.category}`.toLowerCase()
      return matchesCategory && searchText.includes(query.toLowerCase())
    })
  }, [category, parts, query])

  const [addedIds, setAddedIds] = useState<Set<number>>(new Set())

  async function addToCart(part: Product) {
    addItem({
      id: part.id,
      name: part.name,
      product_type: part.product_type,
      price: Number(part.price),
      image_url: part.image_url,
    })
    setAddedIds((prev) => new Set(prev).add(part.id))
    setTimeout(() => setAddedIds((prev) => { const next = new Set(prev); next.delete(part.id); return next }), 2000)
    await trackMarketingEvent('AddToCart', {
      content_name: part.name,
      content_type: 'spare_part',
      value: Number(part.price),
      currency: 'BDT',
    })
  }

  return (
    <main className="min-h-screen bg-asphalt text-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-4 border border-white/10 bg-white/[0.04] p-4 clip-panel lg:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 border border-white/10 bg-black/25 px-4 py-3 clip-panel">
            <Search className="h-5 w-5 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search spare parts" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500"><SlidersHorizontal className="h-4 w-4" /> Filter</span>
            {categories.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`px-3 py-2 text-xs font-black uppercase clip-panel ${category === item ? 'bg-volt text-asphalt' : 'border border-white/10 text-slate-300'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredParts.map((part) => (
            <article key={part.id} className="group border border-white/10 bg-white/[0.04] p-3 shadow-hud transition hover:border-volt/50 clip-panel">
              <Link href={`/products/${part.id}`} className="relative block overflow-hidden clip-panel" aria-label={`View ${part.name} details`}>
                <img src={part.image_url} alt={part.name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 bg-black/75 px-3 py-1 text-[11px] font-black uppercase text-boost clip-panel">{part.status.replace('_', ' ')}</span>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-volt px-3 py-1 text-xs font-black text-asphalt clip-panel"><Gauge className="h-3 w-3" /> {part.power_score}</span>
              </Link>
              <div className="p-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{part.brand}</p>
                <Link href={`/products/${part.id}`} className="mt-2 block text-xl font-black uppercase leading-tight text-white transition hover:text-volt">
                  {part.name}
                </Link>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-300">{part.short_description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(part.specs).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="border border-white/10 bg-black/25 px-3 py-2 clip-panel">
                      <span className="block uppercase text-slate-500">{key}</span>
                      <span className="font-bold text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-2xl font-black text-volt">{formatMoney(Number(part.price))}</p>
                    {part.compare_at_price ? <p className="text-xs text-slate-500 line-through">{formatMoney(Number(part.compare_at_price))}</p> : null}
                  </div>
                  <button type="button" onClick={() => addToCart(part)} className="inline-flex items-center gap-2 bg-ignition px-4 py-3 text-xs font-black uppercase text-white clip-panel active:scale-95 transition-transform">
                    <ShoppingCart className="h-4 w-4" /> {addedIds.has(part.id) ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredParts.length === 0 ? (
          <div className="mt-8 border border-white/10 bg-white/[0.04] px-5 py-10 text-center clip-panel">
            <Star className="mx-auto h-8 w-8 text-boost" />
            <p className="mt-3 text-lg font-black uppercase text-white">No spare parts matched</p>
            <p className="mt-2 text-sm text-slate-400">Try another category or search term.</p>
          </div>
        ) : null}
      </section>
    </main>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value)
}