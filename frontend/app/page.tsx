'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import Link from 'next/link'
import {
  Bike,
  Check,
  ChevronRight,
  Cpu,
  Gauge,
  Headphones,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  ShoppingCart,
  Timer,
  Wrench,
  Zap,
} from 'lucide-react'

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

type ServicePackage = {
  id: number
  title: string
  tier: string
  price: string
  duration: string
  description: string
  perks: string[]
  is_featured: boolean
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'Shadowblade R9 Hyper Sport',
    product_type: 'bike',
    category: 'Hyper Sport',
    brand: 'Lyricz Motors',
    price: '1450000.00',
    compare_at_price: '1580000.00',
    status: 'limited',
    image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1400&q=85',
    power_score: 96,
    short_description: 'Track-ready premium sport bike with aggressive street tuning and elite braking setup.',
    specs: { engine: '998cc', mode: 'Track / Street', stock: '2 units', warranty: '2 years' },
    is_featured: true,
  },
  {
    id: 2,
    name: 'Neon Raider 300 Street Kit',
    product_type: 'bike',
    category: 'Street Fighter',
    brand: 'Yamaha',
    price: '520000.00',
    compare_at_price: null,
    status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1400&q=85',
    power_score: 88,
    short_description: 'Urban performance build for fast commutes, weekend rides, and sharp night presence.',
    specs: { engine: '321cc', mode: 'City Boost', stock: '6 units', warranty: '1 year' },
    is_featured: true,
  },
  {
    id: 3,
    name: 'Titan Touring GT-X',
    product_type: 'bike',
    category: 'Touring',
    brand: 'Honda',
    price: '875000.00',
    compare_at_price: '910000.00',
    status: 'preorder',
    image_url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1400&q=85',
    power_score: 91,
    short_description: 'Long-distance comfort package with loaded luggage support and premium road protection.',
    specs: { engine: '745cc', mode: 'Touring', stock: 'preorder', warranty: '2 years' },
    is_featured: false,
  },
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
    specs: { fitment: '250cc-650cc', material: 'Carbon fiber', install: 'Service center' },
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
    specs: { fitment: 'Sport / Naked', includes: 'Pads, lines, rotors', install: '90 min' },
    is_featured: false,
  },
]

const fallbackServices: ServicePackage[] = [
  {
    id: 1,
    title: 'Pit Boss Premium Tune',
    tier: 'Performance',
    price: '12500.00',
    duration: '3 hours',
    description: 'Full diagnostic, oil, chain, brake, throttle, and ride-mode calibration for premium bikes.',
    perks: ['Digital inspection report', 'Priority bay', 'Road test', 'Service reminder'],
    is_featured: true,
  },
  {
    id: 2,
    title: 'Armor Wash and Ceramic Shield',
    tier: 'Detailing',
    price: '8500.00',
    duration: '2 hours',
    description: 'Premium wash, degrease, polish, and ceramic shield for showroom-level delivery.',
    perks: ['Ceramic finish', 'Chain clean', 'Photo-ready delivery', 'Pickup slot'],
    is_featured: false,
  },
  {
    id: 3,
    title: 'Track Day Readiness Check',
    tier: 'Race Prep',
    price: '18500.00',
    duration: 'Half day',
    description: 'Suspension, brake, tire, cooling, and safety inspection for aggressive performance riding.',
    perks: ['Torque audit', 'Suspension baseline', 'Brake heat check', 'Mechanic notes'],
    is_featured: true,
  },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [services, setServices] = useState<ServicePackage[]>(fallbackServices)
  const [activeType, setActiveType] = useState<'all' | 'bike' | 'spare_part'>('all')
  const [query, setQuery] = useState('')
  const { count: cartCount, openDrawer, addItem } = useCart()
  const [leadStatus, setLeadStatus] = useState('')
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    trackMarketingEvent('ViewContent', { section: 'home' })

    async function loadCommerce() {
      try {
        const [productResponse, serviceResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/products/?page_size=50`, { cache: 'no-store' }),
          fetch(`${apiBaseUrl}/services/?page_size=50`, { cache: 'no-store' }),
        ])

        if (productResponse.ok) {
          const data = await productResponse.json()
          setProducts(Array.isArray(data.results) ? data.results : data)
        }

        if (serviceResponse.ok) {
          const data = await serviceResponse.json()
          setServices(Array.isArray(data.results) ? data.results : data)
        }
      } catch {
        setProducts(fallbackProducts)
        setServices(fallbackServices)
      }
    }

    loadCommerce()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesType = activeType === 'all' || product.product_type === activeType
      const searchText = `${product.name} ${product.brand} ${product.category}`.toLowerCase()
      return matchesType && searchText.includes(query.toLowerCase())
    })
  }, [activeType, products, query])

  const featuredProduct = products.find((product) => product.is_featured) || products[0]
  const totalGarageValue = products.reduce((sum, product) => sum + Number(product.price || 0), 0)

  async function addToCart(product: Product) {
    addItem({
      id: product.id,
      name: product.name,
      product_type: product.product_type,
      price: Number(product.price),
      image_url: product.image_url,
    })
    setAddedIds((prev) => new Set(prev).add(product.id))
    setTimeout(() => setAddedIds((prev) => { const next = new Set(prev); next.delete(product.id); return next }), 2000)
    await trackMarketingEvent('AddToCart', {
      content_name: product.name,
      content_type: product.product_type,
      value: Number(product.price),
      currency: 'BDT',
    })
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLeadStatus('Sending request...')
    const formData = new FormData(event.currentTarget)
    const payload = {
      name: String(formData.get('name') || ''),
      phone: String(formData.get('phone') || ''),
      email: String(formData.get('email') || ''),
      intent: String(formData.get('intent') || 'buy_bike'),
      message: String(formData.get('message') || ''),
      source: 'website',
      utm_source: getParam('utm_source'),
      utm_medium: getParam('utm_medium'),
      utm_campaign: getParam('utm_campaign'),
    }

    try {
      const response = await fetch(`${apiBaseUrl}/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Lead request failed')
      }

      await trackMarketingEvent('Lead', { intent: payload.intent, value: 1, currency: 'BDT' })
      setLeadStatus('Request locked. Lyricz Motors will contact you soon.')
      event.currentTarget.reset()
    } catch {
      setLeadStatus('Saved locally in your browser session. Backend is not reachable right now.')
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-asphalt text-slate-50">

      {/* ── Hero ── */}
      <section id="top" className="relative flex min-h-[calc(100vh-200px)] flex-col justify-start pb-10 sm:pb-0">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=2200&q=85" alt="Premium sport motorcycle" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,16,0.55)_0%,rgba(9,11,16,0.97)_100%)] sm:bg-[linear-gradient(90deg,rgba(9,11,16,0.97),rgba(9,11,16,0.75),rgba(9,11,16,0.25))]" />
          <div className="absolute inset-0 hud-grid opacity-60" />
          <div className="absolute inset-0 scanline opacity-25" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:px-8 lg:pb-14 lg:pt-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-volt/30 bg-volt/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-volt clip-panel sm:px-4 sm:py-2 sm:text-xs">
              <Cpu className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Premium Garage Console
            </div>
            <h1 className="text-[1.85rem] font-black uppercase leading-[1.06] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Bikes, Spare Parts, Service. Built Like A Loadout.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              A performance ecommerce hub for riders who want the machine, the upgrade path, and the premium service bay in one high-intensity buying experience.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-row">
              <a href="/bikes" className="inline-flex items-center justify-center gap-2 bg-volt px-4 py-3.5 text-xs font-black uppercase text-asphalt clip-panel sm:px-6 sm:py-4 sm:text-sm">
                <Bike className="h-4 w-4" /> Browse Bikes
              </a>
              <a href="/service" className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/[0.08] px-4 py-3.5 text-xs font-black uppercase text-white clip-panel sm:px-6 sm:py-4 sm:text-sm">
                <Wrench className="h-4 w-4" /> Service Center
              </a>
            </div>
          </div>

          {featuredProduct ? (
            <div className="mt-6 border border-white/10 bg-black/40 shadow-hud backdrop-blur-md clip-panel sm:mt-0 sm:p-4 lg:mt-0">
              <div className="relative overflow-hidden clip-panel">
                <img src={featuredProduct.image_url} alt={featuredProduct.name} className="h-40 w-full object-cover sm:h-72 lg:h-80" />
                <div className="absolute left-3 top-3 border border-boost/50 bg-boost px-2 py-1 text-[10px] font-black uppercase text-asphalt clip-panel">
                  Boss Drop
                </div>
              </div>
              <div className="flex items-start justify-between gap-3 p-1 pt-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-volt">{featuredProduct.category}</p>
                  <h2 className="mt-1 truncate text-base font-black uppercase text-white sm:text-2xl">{featuredProduct.name}</h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">{featuredProduct.short_description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Power</p>
                  <p className="text-3xl font-black text-volt sm:text-4xl">{featuredProduct.power_score}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-white/10 bg-pitlane py-3 sm:py-5">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 sm:gap-3 sm:px-6 lg:grid-cols-4 lg:px-8">
          <Stat icon={<Gauge className="h-4 w-4 sm:h-5 sm:w-5" />} label="Catalog Value" value={formatMoney(totalGarageValue)} />
          <Stat icon={<PackageCheck className="h-4 w-4 sm:h-5 sm:w-5" />} label="Live Drops" value={`${products.length} Units`} />
          <Stat icon={<ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />} label="Service Tiers" value={`${services.length} Bays`} />
          <Stat icon={<Headphones className="h-4 w-4 sm:h-5 sm:w-5" />} label="Priority Line" value="24/7" />
        </div>
      </section>

      {/* ── Garage ── */}
      <section id="garage" className="bg-asphalt py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-ignition sm:text-sm">Garage Market</p>
              <h2 className="mt-1 text-2xl font-black uppercase text-white sm:mt-2 sm:text-4xl lg:text-5xl">Choose Your Loadout</h2>
            </div>
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto] sm:gap-3">
              <label className="flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2.5 clip-panel">
                <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bike or spare part" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
              </label>
              <div className="flex gap-1.5">
                {(['all', 'bike', 'spare_part'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] clip-panel transition sm:flex-none sm:px-4 sm:text-xs ${
                      activeType === type ? 'bg-volt text-asphalt' : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    {type === 'spare_part' ? 'Parts' : type === 'all' ? 'All' : 'Bikes'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:mt-10 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="group border border-white/10 bg-white/[0.04] shadow-hud transition hover:border-volt/45 clip-panel">
                <Link href={`/products/${product.id}`} className="relative block overflow-hidden clip-panel" aria-label={`View ${product.name} details`}>
                  <img src={product.image_url} alt={product.name} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56" />
                  <div className="absolute left-3 top-3 bg-black/75 px-2.5 py-1 text-[10px] font-black uppercase text-boost clip-panel">
                    {product.status.replace('_', ' ')}
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-volt px-2.5 py-1 text-[10px] font-black text-asphalt clip-panel">
                    <Star className="h-3 w-3 fill-current" /> {product.power_score}
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{product.brand}</p>
                      <Link href={`/products/${product.id}`} className="mt-1 block text-base font-black uppercase leading-tight text-white transition hover:text-volt sm:text-lg">
                        {product.name}
                      </Link>
                    </div>
                    <span className="flex-shrink-0 border border-white/10 px-2 py-1 text-[9px] font-black uppercase text-slate-400 clip-panel">
                      {product.product_type === 'bike' ? 'Bike' : 'Part'}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">{product.short_description}</p>
                  <div className="mt-3 hidden grid-cols-2 gap-2 text-xs sm:grid">
                    {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="border border-white/10 bg-black/20 px-3 py-2 clip-panel">
                        <span className="block text-[10px] uppercase text-slate-500">{key}</span>
                        <span className="font-bold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xl font-black text-volt sm:text-2xl">{formatMoney(Number(product.price))}</p>
                      {product.compare_at_price ? (
                        <p className="text-[10px] text-slate-500 line-through">{formatMoney(Number(product.compare_at_price))}</p>
                      ) : null}
                    </div>
                    <button type="button" onClick={() => addToCart(product)} className="inline-flex items-center gap-2 bg-ignition px-4 py-2.5 text-xs font-black uppercase text-white clip-panel active:scale-95 transition-transform">
                      <ShoppingCart className="h-3.5 w-3.5" /> {addedIds.has(product.id) ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service ── */}
      <section id="service" className="bg-[#f4f7f2] py-12 text-slate-950 sm:py-20">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-ignition sm:text-sm">Premium Service Center</p>
              <h2 className="mt-1 text-2xl font-black uppercase sm:mt-2 sm:text-4xl lg:text-5xl">Your Machine Gets A Pit Crew</h2>
              <p className="mt-4 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
                Service packages are shaped like performance missions: diagnostics, detailing, race prep, and delivery polish under one premium workflow.
              </p>
              <div className="mt-5 grid gap-2 sm:mt-8 sm:gap-3">
                {['Genuine spare parts sourcing', 'Priority booking queue', 'Digital inspection report'].map((item) => (
                  <div key={item} className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3 clip-panel">
                    <Check className="h-4 w-4 flex-shrink-0 text-ignition sm:h-5 sm:w-5" />
                    <span className="text-sm font-bold sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {services.map((service) => (
                <article key={service.id} className={`border p-4 clip-panel sm:p-5 ${service.is_featured ? 'border-ignition bg-slate-950 text-white shadow-hud' : 'border-slate-200 bg-white text-slate-950'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-ignition sm:text-xs">{service.tier}</span>
                    <Timer className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-lg font-black uppercase leading-tight sm:mt-4 sm:text-2xl">{service.title}</h3>
                  <p className={`mt-2 text-xs leading-5 sm:mt-3 sm:text-sm sm:leading-6 ${service.is_featured ? 'text-slate-300' : 'text-slate-600'}`}>{service.description}</p>
                  <p className="mt-4 text-2xl font-black sm:mt-5 sm:text-3xl">{formatMoney(Number(service.price))}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">{service.duration}</p>
                  <div className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
                    {service.perks.map((perk) => (
                      <p key={perk} className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
                        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-boost sm:h-4 sm:w-4" /> {perk}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Book ── */}
      <section id="book" className="relative bg-pitlane py-12 sm:py-20">
        <div className="absolute inset-0 hud-grid opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-5 px-2 sm:gap-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="border border-white/10 bg-black/35 p-5 clip-panel sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-volt sm:text-sm">Rider Request</p>
            <h2 className="mt-1 text-2xl font-black uppercase text-white sm:mt-2 sm:text-4xl">Lock A Deal, Part, Or Service Slot</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:mt-4">
              Tell us your target machine, upgrade path, or service slot and the pit desk will line up the next move.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
              <MiniMetric label="Response Mode" value="Priority" />
              <MiniMetric label="Cart Units" value={String(cartCount)} />
              <MiniMetric label="Garage Items" value={String(products.length)} />
              <MiniMetric label="Service Bays" value={String(services.length)} />
            </div>
          </div>

          <form onSubmit={submitLead} className="border border-white/10 bg-white/[0.05] p-5 shadow-hud clip-panel">
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <Field label="Name" name="name" placeholder="Your name" required />
              <Field label="Phone" name="phone" placeholder="01XXXXXXXXX" required />
              <Field label="Email" name="email" placeholder="you@example.com" type="email" />
              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
                Intent
                <select name="intent" className="border border-white/10 bg-asphalt px-4 py-3 text-sm text-white outline-none clip-panel">
                  <option value="buy_bike">Buy Bike</option>
                  <option value="buy_part">Buy Spare Part</option>
                  <option value="service">Book Service</option>
                  <option value="finance">Finance</option>
                </select>
              </label>
            </div>
            <label className="mt-3 grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-300 sm:mt-4">
              Message
              <textarea name="message" rows={3} placeholder="Tell us what you want to build or buy" className="resize-none border border-white/10 bg-asphalt px-4 py-3 text-sm text-white outline-none clip-panel" />
            </label>
            <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-volt px-6 py-4 text-sm font-black uppercase text-asphalt clip-panel sm:mt-5">
              Send Request <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            {leadStatus ? (
              <p className="mt-3 border border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold text-volt clip-panel sm:mt-4 sm:text-sm">{leadStatus}</p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border border-white/10 bg-white/[0.04] px-3 py-3 clip-panel sm:gap-4 sm:px-4 sm:py-4">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-volt/10 text-volt clip-panel sm:h-11 sm:w-11">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-slate-500 sm:text-xs">{label}</span>
        <span className="block truncate text-sm font-black text-white sm:text-lg">{value}</span>
      </span>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.04] px-3 py-3 clip-panel sm:px-4 sm:py-4">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500 sm:text-xs">{label}</p>
      <p className="mt-1 text-xl font-black text-white sm:text-2xl">{value}</p>
    </div>
  )
}

function Field({ label, name, placeholder, type = 'text', required = false }: { label: string; name: string; placeholder: string; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
      {label}
      <input name={name} type={type} placeholder={placeholder} required={required} className="border border-white/10 bg-asphalt px-4 py-3 text-sm text-white outline-none clip-panel" />
    </label>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value)
}

function getParam(name: string) {
  if (typeof window === 'undefined') {
    return ''
  }

  return new URLSearchParams(window.location.search).get(name) || ''
}