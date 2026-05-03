'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Gauge, Search, ShoppingCart, SlidersHorizontal, Star, Zap } from 'lucide-react'

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
  engine_cc?: number | null
  max_power?: string
  transmission?: string
  weight_kg?: number | null
  abs?: boolean | null
  color_options?: string[]
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

const fallbackBikes: Product[] = [
  {
    id: 1,
    name: 'GPX Demon 150GR',
    product_type: 'bike',
    category: 'Sport',
    brand: 'GPX',
    price: '295000.00',
    compare_at_price: '315000.00',
    status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1400&q=85',
    power_score: 82,
    short_description: 'Aggressive sport fairing, twin exhaust, and track-tuned suspension in a lightweight 150cc package.',
    specs: { engine: '150cc', power: '15 bhp', weight: '131 kg', transmission: '6-speed' },
    is_featured: true,
    engine_cc: 150,
    max_power: '15 bhp @ 9500 rpm',
    transmission: '6-speed manual',
    weight_kg: 131,
    abs: false,
    color_options: ['Racing Red', 'Matte Black', 'White Gold'],
  },
  {
    id: 2,
    name: 'GPX Demon 150FK',
    product_type: 'bike',
    category: 'Sport',
    brand: 'GPX',
    price: '310000.00',
    compare_at_price: null,
    status: 'limited',
    image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1400&q=85',
    power_score: 85,
    short_description: 'Racing-spec livery, slipper clutch, and twin-cylinder feel packed into a class-leading 150 naked.',
    specs: { engine: '150cc', power: '16 bhp', weight: '128 kg', transmission: '6-speed' },
    is_featured: true,
    engine_cc: 150,
    max_power: '16 bhp @ 10000 rpm',
    transmission: '6-speed manual',
    weight_kg: 128,
    abs: false,
    color_options: ['Carbon Black', 'Neon Blue', 'Race Yellow'],
  },
  {
    id: 3,
    name: 'GPX Demon 220R',
    product_type: 'bike',
    category: 'Naked',
    brand: 'GPX',
    price: '420000.00',
    compare_at_price: '445000.00',
    status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1400&q=85',
    power_score: 88,
    short_description: 'Street-naked aggression with 220cc muscle, inverted forks, and full LED premium package.',
    specs: { engine: '220cc', power: '22 bhp', weight: '139 kg', transmission: '6-speed' },
    is_featured: false,
    engine_cc: 220,
    max_power: '22 bhp @ 9000 rpm',
    transmission: '6-speed manual',
    weight_kg: 139,
    abs: true,
    color_options: ['Matte Grey', 'Stealth Black', 'Burnt Orange'],
  },
]

const categories = ['All', 'Sport', 'Naked', 'Street Fighter', 'Hyper Sport', 'Touring']

export default function BikesPage() {
  const [bikes, setBikes] = useState<Product[]>(fallbackBikes)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const { addItem } = useCart()

  useEffect(() => {
    trackMarketingEvent('ViewContent', { section: 'bikes' })

    async function loadBikes() {
      try {
        const response = await fetch(`${apiBaseUrl}/products/?type=bike&page_size=50`, { cache: 'no-store' })
        if (!response.ok) throw new Error('Unable to load bikes')
        const data = await response.json()
        const loaded = Array.isArray(data.results) ? data.results : data
        setBikes(loaded.length ? loaded : fallbackBikes)
      } catch {
        setBikes(fallbackBikes)
      }
    }

    loadBikes()
  }, [])

  const filteredBikes = useMemo(() => {
    return bikes.filter((bike) => {
      const matchesCategory = category === 'All' || bike.category === category
      const searchText = `${bike.name} ${bike.brand} ${bike.category}`.toLowerCase()
      return matchesCategory && searchText.includes(query.toLowerCase())
    })
  }, [category, bikes, query])

  const [addedIds, setAddedIds] = useState<Set<number>>(new Set())

  async function addToCart(bike: Product) {
    addItem({
      id: bike.id,
      name: bike.name,
      product_type: bike.product_type,
      price: Number(bike.price),
      image_url: bike.image_url,
    })
    setAddedIds((prev) => new Set(prev).add(bike.id))
    setTimeout(() => setAddedIds((prev) => { const next = new Set(prev); next.delete(bike.id); return next }), 2000)
    await trackMarketingEvent('AddToCart', {
      content_name: bike.name,
      content_type: 'bike',
      value: Number(bike.price),
      currency: 'BDT',
    })
  }

  return (
    <main className="min-h-screen bg-asphalt text-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="grid gap-4 border border-white/10 bg-white/[0.04] p-4 clip-panel lg:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 border border-white/10 bg-black/25 px-4 py-3 clip-panel">
            <Search className="h-5 w-5 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bikes by name or brand"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </span>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`px-3 py-2 text-xs font-black uppercase clip-panel ${
                  category === item ? 'bg-volt text-asphalt' : 'border border-white/10 text-slate-300'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredBikes.map((bike) => (
            <article
              key={bike.id}
              className="group border border-white/10 bg-white/[0.04] p-3 shadow-hud transition hover:border-volt/50 clip-panel"
            >
              <Link href={`/products/${bike.id}`} className="relative block overflow-hidden clip-panel" aria-label={`View ${bike.name}`}>
                <img
                  src={bike.image_url}
                  alt={bike.name}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 bg-black/75 px-3 py-1 text-[11px] font-black uppercase text-boost clip-panel">
                  {bike.status.replace('_', ' ')}
                </span>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-volt px-3 py-1 text-xs font-black text-asphalt clip-panel">
                  <Gauge className="h-3 w-3" /> {bike.power_score}
                </span>
                {bike.is_featured && (
                  <span className="absolute left-3 bottom-3 inline-flex items-center gap-1 border border-volt/40 bg-volt/10 px-2 py-1 text-[10px] font-black uppercase text-volt clip-panel">
                    <Zap className="h-3 w-3" /> Featured
                  </span>
                )}
              </Link>

              <div className="p-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{bike.brand}</p>
                <Link
                  href={`/products/${bike.id}`}
                  className="mt-2 block text-xl font-black uppercase leading-tight text-white transition hover:text-volt"
                >
                  {bike.name}
                </Link>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-300">{bike.short_description}</p>

                {/* Bike spec pills */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {bike.engine_cc && (
                    <div className="border border-white/10 bg-black/25 px-3 py-2 clip-panel">
                      <span className="block uppercase text-slate-500">Engine</span>
                      <span className="font-bold text-white">{bike.engine_cc}cc</span>
                    </div>
                  )}
                  {bike.max_power && (
                    <div className="border border-white/10 bg-black/25 px-3 py-2 clip-panel">
                      <span className="block uppercase text-slate-500">Power</span>
                      <span className="font-bold text-white">{bike.max_power.split(' ')[0]} {bike.max_power.split(' ')[1]}</span>
                    </div>
                  )}
                  {bike.weight_kg && (
                    <div className="border border-white/10 bg-black/25 px-3 py-2 clip-panel">
                      <span className="block uppercase text-slate-500">Weight</span>
                      <span className="font-bold text-white">{bike.weight_kg} kg</span>
                    </div>
                  )}
                  {bike.transmission && (
                    <div className="border border-white/10 bg-black/25 px-3 py-2 clip-panel">
                      <span className="block uppercase text-slate-500">Gearbox</span>
                      <span className="font-bold text-white">{bike.transmission.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                  )}
                </div>

                {/* ABS badge */}
                {bike.abs && (
                  <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-volt">✓ ABS</p>
                )}

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-2xl font-black text-volt">{formatMoney(Number(bike.price))}</p>
                    {bike.compare_at_price ? (
                      <p className="text-xs text-slate-500 line-through">{formatMoney(Number(bike.compare_at_price))}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(bike)}
                    className="inline-flex items-center gap-2 bg-ignition px-4 py-3 text-xs font-black uppercase text-white clip-panel active:scale-95 transition-transform"
                  >
                    <ShoppingCart className="h-4 w-4" /> {addedIds.has(bike.id) ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredBikes.length === 0 && (
          <div className="mt-8 border border-white/10 bg-white/[0.04] px-5 py-10 text-center clip-panel">
            <Star className="mx-auto h-8 w-8 text-boost" />
            <p className="mt-3 text-lg font-black uppercase text-white">No bikes matched</p>
            <p className="mt-2 text-sm text-slate-400">Try another category or search term.</p>
          </div>
        )}
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
