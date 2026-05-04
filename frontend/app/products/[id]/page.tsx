'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Award,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Fuel,
  Gauge,
  Package,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'

import { trackMarketingEvent } from '@/lib/tracking'
import { useCart } from '@/lib/cart'
import BookingModal, { type BookingItem } from '@/components/BookingModal'

// -- Type -------------------------------------------------------------------
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
  // Bike-specific
  engine_cc?: number | null
  max_power?: string
  max_torque?: string
  transmission?: string
  fuel_capacity_l?: string | null
  seat_height_mm?: number | null
  weight_kg?: number | null
  mileage_kmpl?: string | null
  abs?: boolean | null
  color_options?: string[]
  gallery_images?: string[]
  // Spare-part-specific
  part_number?: string
  material?: string
  compatible_bikes?: string[]
  warranty_months?: number | null
  fitment_note?: string
}

// -- Constants --------------------------------------------------------------
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

const STATUS_COLORS: Record<string, string> = {
  in_stock: 'bg-volt/10 text-volt border-volt/30',
  limited: 'bg-boost/10 text-boost border-boost/30',
  preorder: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  out_of_stock: 'bg-ignition/10 text-ignition border-ignition/30',
}

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
    specs: { mode: 'Track / Street', stock: '2 units' },
    is_featured: true,
    engine_cc: 998,
    max_power: '189 bhp @ 13500 rpm',
    max_torque: '113 Nm @ 11000 rpm',
    transmission: '6-speed quick-shift',
    fuel_capacity_l: '17.0',
    seat_height_mm: 825,
    weight_kg: 193,
    mileage_kmpl: '14.5',
    abs: true,
    color_options: ['Matte Asphalt', 'Racing Red', 'Stealth Black'],
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
    specs: { mode: 'City Boost', stock: '6 units' },
    is_featured: true,
    engine_cc: 321,
    max_power: '42 bhp @ 10750 rpm',
    max_torque: '29.6 Nm @ 9000 rpm',
    transmission: '6-speed manual',
    fuel_capacity_l: '14.0',
    seat_height_mm: 780,
    weight_kg: 167,
    mileage_kmpl: '24.0',
    abs: true,
    color_options: ['Neon Lime', 'Midnight Blue', 'Gunmetal Grey'],
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
    specs: { mode: 'Touring', stock: 'preorder' },
    is_featured: false,
    engine_cc: 745,
    max_power: '77 bhp @ 8750 rpm',
    max_torque: '72 Nm @ 6500 rpm',
    transmission: '6-speed manual',
    fuel_capacity_l: '21.0',
    seat_height_mm: 800,
    weight_kg: 221,
    mileage_kmpl: '20.0',
    abs: true,
    color_options: ['Pearl White', 'Graphite Silver', 'Deep Ocean Blue'],
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
    specs: { weight: '2.1 kg', db_reduction: '3 dB', power_gain: '+4 bhp' },
    is_featured: true,
    part_number: 'APX-EX-250650',
    material: 'Carbon fiber sleeve, stainless steel core',
    compatible_bikes: ['Yamaha R3', 'KTM Duke 390', 'Honda CB300R', 'Kawasaki Z400'],
    warranty_months: 12,
    fitment_note: 'Requires professional fitting at service center. OEM header retained.',
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
    specs: { includes: 'Pads + Lines + Rotors', install_time: '90 min', temp_rating: '650 C' },
    is_featured: false,
    part_number: 'BRM-BRK-SPORT-KIT',
    material: 'Sintered metal pads, braided steel lines, slotted rotors',
    compatible_bikes: ['Yamaha MT-09', 'Kawasaki Z650', 'Honda CB650R', 'Suzuki GSX-S750'],
    warranty_months: 6,
    fitment_note: 'Bleed brakes after installation. Bed-in period: 200 km recommended.',
  },
]

// -- Shared helpers ---------------------------------------------------------
function formatMoney(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value)
}

// -- Page ------------------------------------------------------------------
export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>()
  const productId = params.id
  const [product, setProduct] = useState<Product | null>(
    fallbackProducts.find((p) => String(p.id) === productId) || null
  )
  const [related, setRelated] = useState<Product[]>([])
  const [cartAdded, setCartAdded] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    setCartAdded(false)
    async function loadProduct() {
      try {
        const res = await fetch(`${apiBaseUrl}/products/${productId}/`, { cache: 'no-store' })
        if (!res.ok) throw new Error()
        const data: Product = await res.json()
        setProduct(data)
        trackMarketingEvent('ViewContent', {
          content_name: data.name,
          content_type: data.product_type,
          value: Number(data.price),
          currency: 'BDT',
        })
        const relRes = await fetch(`${apiBaseUrl}/products/?type=${data.product_type}&page_size=10`, { cache: 'no-store' })
        if (relRes.ok) {
          const relData = await relRes.json()
          const list: Product[] = Array.isArray(relData.results) ? relData.results : relData
          setRelated(list.filter((p) => String(p.id) !== productId).slice(0, 4))
        }
      } catch {
        const fallback = fallbackProducts.find((p) => String(p.id) === productId) || null
        setProduct(fallback)
        setRelated(
          fallbackProducts
            .filter((p) => p.product_type === fallback?.product_type && String(p.id) !== productId)
            .slice(0, 4)
        )
      }
    }
    loadProduct()
  }, [productId])

  function handleBookNow() {
    if (!product) return
    setBookingItem({ name: product.name, product_type: product.product_type })
    setBookingOpen(true)
  }

  async function handleAddToCart() {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      product_type: product.product_type,
      price: Number(product.price),
      image_url: product.image_url,
    })
    setCartAdded(true)
    trackMarketingEvent('AddToCart', {
      content_name: product.name,
      content_type: product.product_type,
      value: Number(product.price),
      currency: 'BDT',
    })
  }

  if (!product) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-asphalt px-4 text-center text-white">
        <div className="border border-white/10 bg-white/[0.04] p-10 clip-panel">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-ignition">Not Found</p>
          <h1 className="mt-3 text-3xl font-black uppercase">Product not available</h1>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 bg-volt px-5 py-3 text-sm font-black uppercase text-asphalt clip-panel">
            <ArrowLeft className="h-4 w-4" /> Back Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {product.product_type === 'bike'
        ? <BikeDetailView product={product} related={related} cartAdded={cartAdded} onAddToCart={handleAddToCart} onBookNow={handleBookNow} />
        : <SparePartDetailView product={product} related={related} cartAdded={cartAdded} onAddToCart={handleAddToCart} onBookNow={handleBookNow} />}
      <BookingModal open={bookingOpen} item={bookingItem} onClose={() => setBookingOpen(false)} />
    </>
  )
}

// ===========================================================================
// BIKE DETAIL -- hero landing-page style
// ===========================================================================
function BikeDetailView({
  product,
  related,
  cartAdded,
  onAddToCart,
  onBookNow,
}: {
  product: Product
  related: Product[]
  cartAdded: boolean
  onAddToCart: () => void
  onBookNow: () => void
}) {
  const savings = product.compare_at_price ? Number(product.compare_at_price) - Number(product.price) : 0
  const specEntries = Object.entries(product.specs)
  const images = [product.image_url, ...(product.gallery_images ?? [])].filter(Boolean)
  const [slideIdx, setSlideIdx] = useState(0)
  const goTo = (i: number) => setSlideIdx((i + images.length) % images.length)

  return (
    <div className="min-h-screen bg-asphalt text-slate-50">

      {/* ── HERO: image background with slider, content anchored at bottom ── */}
      <section className="relative flex min-h-[76vh] flex-col justify-end sm:min-h-[82vh]">
        {/* Background images — stacked, fade between slides */}
        <div className="absolute inset-0 overflow-hidden">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={i === 0 ? product.name : `${product.name} view ${i + 1}`}
              className={"absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 " + (i === slideIdx ? 'opacity-100' : 'opacity-0')}
            />
          ))}
          {/* Lighter overlay so the bike image shows through clearly */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,16,0.08)_0%,rgba(9,11,16,0.22)_40%,rgba(9,11,16,0.76)_68%,rgba(9,11,16,0.97)_100%)]" />
          <div className="absolute inset-0 hud-grid opacity-25" />
          <div className="absolute inset-0 scanline opacity-15" />
        </div>

        {/* Back nav — top left */}
        <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
          <Link href="/#garage" className="inline-flex items-center gap-2 border border-white/20 bg-black/50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm clip-panel hover:border-volt/50 hover:text-volt transition sm:text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Garage
          </Link>
        </div>

        {/* Status + featured — top right */}
        <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-2 sm:right-6 sm:top-6">
          <span className={"border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] clip-panel sm:text-xs " + (STATUS_COLORS[product.status] ?? 'bg-white/10 text-white border-white/20')}>
            {product.status.replace(/_/g, ' ')}
          </span>
          {product.is_featured && (
            <span className="flex items-center gap-1.5 border border-boost/40 bg-boost/10 px-3 py-1.5 text-[10px] font-black uppercase text-boost clip-panel sm:text-xs">
              <Award className="h-3 w-3" /> Featured
            </span>
          )}
        </div>

        {/* Prev / Next arrows — only when multiple images */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(slideIdx - 1)}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/55 text-white backdrop-blur-sm clip-panel hover:border-volt/50 hover:text-volt transition sm:left-5 sm:h-11 sm:w-11"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(slideIdx + 1)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/55 text-white backdrop-blur-sm clip-panel hover:border-volt/50 hover:text-volt transition sm:right-5 sm:h-11 sm:w-11"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Hero content — anchored bottom */}
        <div className="relative z-10 px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Dot indicators + counter */}
            {images.length > 1 && (
              <div className="mb-4 flex items-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    className={"h-1.5 rounded-full transition-all duration-300 " + (i === slideIdx ? 'w-7 bg-volt' : 'w-1.5 bg-white/40 hover:bg-white/70')}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
                <span className="ml-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{slideIdx + 1} / {images.length}</span>
              </div>
            )}
            <span className="inline-flex items-center gap-1.5 border border-volt/30 bg-volt/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-volt clip-panel sm:text-xs">
              <Cpu className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {product.category}
            </span>
            <h1 className="mt-3 max-w-4xl text-[2.2rem] font-black uppercase leading-[1.04] text-white sm:text-5xl lg:text-7xl">
              {product.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">{product.short_description}</p>

            {/* Quick HUD stat row */}
            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {product.engine_cc ? <HudStat label="Engine" value={product.engine_cc + " cc"} /> : null}
              {product.max_power ? <HudStat label="Max Power" value={product.max_power} /> : null}
              {product.transmission ? <HudStat label="Gearbox" value={product.transmission} /> : null}
              {product.weight_kg ? <HudStat label="Weight" value={product.weight_kg + " kg"} /> : null}
              {product.mileage_kmpl ? <HudStat label="Mileage" value={product.mileage_kmpl + " km/l"} /> : null}
              {product.abs !== null && product.abs !== undefined ? <HudStat label="ABS" value={product.abs ? "Yes" : "No"} /> : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Price + CTA strip — immediately below hero ── */}
      <section className="border-b border-white/10 bg-pitlane">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 sm:text-xs">Selling Price</p>
            <div className="mt-1 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black text-volt sm:text-5xl">{formatMoney(Number(product.price))}</span>
              {product.compare_at_price && (
                <div className="flex flex-col pb-1">
                  <span className="text-sm font-bold text-slate-500 line-through">{formatMoney(Number(product.compare_at_price))}</span>
                  <span className="text-xs font-black text-boost">Save {formatMoney(savings)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onAddToCart}
              className={"inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-black uppercase clip-panel transition active:scale-95 " + (cartAdded ? 'border border-volt bg-volt/20 text-volt' : 'bg-ignition text-white hover:bg-ignition/90')}
            >
              {cartAdded ? <><CheckCircle2 className="h-5 w-5" /> Added to Cart</> : <><ShoppingCart className="h-5 w-5" /> Add to Cart</>}
            </button>
            <button type="button" onClick={onBookNow} className="inline-flex items-center justify-center gap-2 bg-volt px-5 py-4 text-sm font-black uppercase text-asphalt clip-panel hover:bg-volt/90 transition">
              <Wrench className="h-5 w-5" /> Book Now
            </button>
            <a href="tel:+8801700000000" className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/[0.06] px-5 py-4 text-sm font-black uppercase text-white clip-panel hover:border-volt/30 transition">
              <Phone className="h-4 w-4 text-volt" /> Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Full Specs */}
      <section className="bg-asphalt py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">

            {/* Left: Engine + key bike stats */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-volt">
                <Gauge className="h-4 w-4" /> Powertrain & Performance
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Engine', value: product.engine_cc ? product.engine_cc + " cc" : '---' },
                  { label: 'Max Power', value: product.max_power || '---' },
                  { label: 'Max Torque', value: product.max_torque || '---' },
                  { label: 'Transmission', value: product.transmission || '---' },
                  { label: 'Fuel Tank', value: product.fuel_capacity_l ? product.fuel_capacity_l + " L" : '---' },
                  { label: 'Seat Height', value: product.seat_height_mm ? product.seat_height_mm + " mm" : '---' },
                  { label: 'Kerb Weight', value: product.weight_kg ? product.weight_kg + " kg" : '---' },
                  { label: 'Mileage', value: product.mileage_kmpl ? product.mileage_kmpl + " km/l" : '---' },
                  { label: 'ABS', value: product.abs === true ? 'Standard' : product.abs === false ? 'No ABS' : '---' },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-white/10 bg-white/[0.04] px-4 py-4 clip-panel">
                    <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">{label}</span>
                    <span className="mt-1 block text-sm font-black text-white sm:text-base">{value}</span>
                  </div>
                ))}
              </div>

              {specEntries.length > 0 && (
                <div>
                  <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 sm:text-xs">More Details</h3>
                  <div className="overflow-hidden border border-white/10 clip-panel">
                    {specEntries.map(([key, value], i) => (
                      <div key={key} className={"flex items-center justify-between gap-6 px-5 py-3.5 " + (i % 2 === 0 ? 'bg-graphite' : 'bg-pitlane/70')}>
                        <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 shrink-0 w-28">{key}</span>
                        <span className="text-right text-sm font-black text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.color_options && product.color_options.length > 0 && (
                <div>
                  <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 sm:text-xs">Available Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.color_options.map((color) => (
                      <span key={color} className="border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-black text-slate-200 clip-panel">{color}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: PDI + trust */}
            <div className="space-y-5">
              <div className="border border-white/10 bg-graphite p-5 clip-panel">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 sm:text-xs">Power Score</span>
                  <span className={"text-4xl font-black " + (product.power_score >= 90 ? 'text-volt' : 'text-boost')}>{product.power_score}</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden bg-white/10 clip-panel">
                  <div className={"h-full transition-all duration-700 " + (product.power_score >= 90 ? 'bg-volt' : 'bg-boost')} style={{ width: product.power_score + "%" }} />
                </div>
                <p className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">Lyricz Motors Performance Index</p>
              </div>

              <div className="border border-white/10 bg-graphite p-5 clip-panel">
                <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-volt sm:text-xs">Pre-Delivery Includes</h3>
                <ul className="space-y-3">
                  {['Full PDI (Pre-Delivery Inspection)', "Owner's manual & warranty card", 'First free service reminder', 'Registration assistance available', 'Showroom delivery + road test'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-volt" />{item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <ShieldCheck className="h-4 w-4" />, text: 'Genuine Unit' },
                  { icon: <Truck className="h-4 w-4" />, text: 'Delivery Available' },
                  { icon: <PackageCheck className="h-4 w-4" />, text: 'Verified Stock' },
                  { icon: <Tag className="h-4 w-4" />, text: 'Best Price' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2.5 clip-panel">
                    <span className="text-volt">{icon}</span>
                    <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-300">{text}</span>
                  </div>
                ))}
              </div>

              <div className="border border-volt/20 bg-volt/[0.04] p-5 clip-panel">
                <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-volt sm:text-xs">Payment & Delivery</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4 flex-shrink-0 text-volt" /> Showroom pickup or home delivery</li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 flex-shrink-0 text-volt" /> bKash, Nagad, Cash, Bank Transfer</li>
                  <li className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0 text-volt" /> Confirm via call or WhatsApp</li>
                </ul>
              </div>

              {savings > 0 && (
                <div className="border border-boost/20 bg-boost/[0.05] p-5 clip-panel">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-boost sm:text-xs">Limited Time Offer</p>
                  <p className="mt-2 text-2xl font-black text-white">Save {formatMoney(savings)}</p>
                  <p className="mt-1 text-xs text-slate-400">Was: <span className="line-through">{formatMoney(Number(product.compare_at_price))}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedSection related={related} backLink="/#garage" backLabel="Garage" />
    </div>
  )
}

// ===========================================================================
// SPARE PART DETAIL -- technical layout
// ===========================================================================
function SparePartDetailView({
  product,
  related,
  cartAdded,
  onAddToCart,
  onBookNow,
}: {
  product: Product
  related: Product[]
  cartAdded: boolean
  onAddToCart: () => void
  onBookNow: () => void
}) {
  const savings = product.compare_at_price ? Number(product.compare_at_price) - Number(product.price) : 0
  const specEntries = Object.entries(product.specs)

  return (
    <div className="min-h-screen bg-asphalt text-slate-50">

      {/* Breadcrumb */}
      <div className="border-b border-white/10 bg-pitlane/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 hover:text-volt transition sm:text-xs">Home</Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <Link href="/spare-parts" className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 hover:text-volt transition sm:text-xs">Spare Parts</Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="max-w-[200px] truncate text-[10px] font-bold uppercase tracking-[0.12em] text-volt sm:max-w-xs sm:text-xs">{product.name}</span>
        </div>
      </div>

      {/* Main product layout */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">

          {/* ── Top: Image + buy panel side by side ── */}
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">

            {/* Image */}
            <div className="relative overflow-hidden border border-white/10 bg-black/40 shadow-hud clip-panel">
              <img src={product.image_url} alt={product.name} className="h-64 w-full object-cover sm:h-80 lg:h-[420px]" />
              <span className={"absolute left-4 top-4 border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] clip-panel sm:text-xs " + (STATUS_COLORS[product.status] ?? 'bg-white/10 text-white border-white/20')}>
                {product.status.replace(/_/g, ' ')}
              </span>
              {product.is_featured && (
                <span className="absolute right-4 top-4 flex items-center gap-1.5 border border-boost/40 bg-boost/10 px-3 py-1.5 text-[10px] font-black uppercase text-boost clip-panel sm:text-xs">
                  <Award className="h-3 w-3" /> Featured
                </span>
              )}
            </div>

            {/* Buy panel */}
            <div className="flex flex-col gap-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 border border-ignition/30 bg-ignition/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-ignition clip-panel sm:text-xs">
                  <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Spare Part
                </span>
                <span className="border border-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 clip-panel sm:text-xs">{product.category}</span>
              </div>

              {/* Title */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 sm:text-xs">{product.brand}</p>
                <h1 className="mt-1 text-2xl font-black uppercase leading-tight text-white sm:text-3xl">{product.name}</h1>
                <p className="mt-2 text-sm leading-6 text-slate-300">{product.short_description}</p>
              </div>

              {/* Part number + warranty */}
              <div className="grid grid-cols-2 gap-2">
                {product.part_number ? (
                  <div className="border border-white/10 bg-white/[0.04] px-4 py-3 clip-panel">
                    <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Part No.</span>
                    <span className="mt-1 block font-mono text-xs font-bold text-white">{product.part_number}</span>
                  </div>
                ) : null}
                {product.warranty_months != null ? (
                  <div className="border border-volt/20 bg-volt/[0.05] px-4 py-3 clip-panel">
                    <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-volt">Warranty</span>
                    <span className="mt-1 block text-xs font-black text-white">{product.warranty_months} Months</span>
                  </div>
                ) : null}
              </div>

              {/* Price */}
              <div className="border border-white/10 bg-white/[0.03] p-4 clip-panel">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Price</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-black text-volt">{formatMoney(Number(product.price))}</span>
                  {product.compare_at_price && (
                    <div className="flex flex-col pb-0.5">
                      <span className="text-sm font-bold text-slate-500 line-through">{formatMoney(Number(product.compare_at_price))}</span>
                      <span className="text-xs font-black text-boost">Save {formatMoney(savings)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onAddToCart}
                  className={"inline-flex flex-1 items-center justify-center gap-2 px-5 py-4 text-sm font-black uppercase clip-panel transition active:scale-95 " + (cartAdded ? 'border border-volt bg-volt/20 text-volt' : 'bg-ignition text-white hover:bg-ignition/90')}
                >
                  {cartAdded ? <><CheckCircle2 className="h-5 w-5" /> Added to Cart</> : <><ShoppingCart className="h-5 w-5" /> Add to Cart</>}
                </button>
                <button type="button" onClick={onBookNow} className="inline-flex flex-1 items-center justify-center gap-2 bg-volt px-5 py-4 text-sm font-black uppercase text-asphalt clip-panel hover:bg-volt/90 transition">
                  <Wrench className="h-5 w-5" /> Book Install
                </button>
              </div>

              {/* Call */}
              <a href="tel:+8801700000000" className="flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3 clip-panel hover:border-volt/30 transition">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-volt/30 bg-volt/10 text-volt clip-panel">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Call / WhatsApp</p>
                  <p className="text-sm font-black text-white">+880 17XX-XXXXXX</p>
                </div>
              </a>
            </div>
          </div>

          {/* ── Bottom: Details row ── */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Specs */}
            {specEntries.length > 0 && (
              <div className="border border-white/10 bg-white/[0.03] clip-panel">
                <div className="border-b border-white/10 px-4 py-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Technical Specs</h3>
                </div>
                {specEntries.map(([key, value], i) => (
                  <div key={key} className={"flex items-center justify-between gap-4 px-4 py-3 " + (i % 2 === 0 ? 'bg-white/[0.02]' : '')}>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{key}</span>
                    <span className="text-right text-sm font-black text-white">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* What's included */}
            <div className="border border-white/10 bg-white/[0.03] p-5 clip-panel">
              <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-volt">What's Included</h3>
              <ul className="space-y-2.5">
                {['Fitment guide & install support', 'Quality-checked before dispatch', 'Service center installation available', 'Replacement warranty included'].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-volt" />{item}
                  </li>
                ))}
              </ul>
              {product.material && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Material</span>
                  <span className="mt-1 block text-sm font-bold text-white">{product.material}</span>
                </div>
              )}
            </div>

            {/* Compatible bikes + fitment */}
            <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
              {product.compatible_bikes && product.compatible_bikes.length > 0 && (
                <div className="border border-volt/20 bg-volt/[0.04] p-5 clip-panel">
                  <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-volt">
                    <Zap className="h-3.5 w-3.5" /> Compatible Bikes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.compatible_bikes.map((bike) => (
                      <span key={bike} className="border border-volt/25 bg-volt/[0.06] px-3 py-1.5 text-xs font-bold text-volt clip-panel">{bike}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.fitment_note && (
                <div className="flex gap-3 border border-boost/20 bg-boost/[0.05] p-4 clip-panel">
                  <Wrench className="mt-0.5 h-4 w-4 flex-shrink-0 text-boost" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-boost">Fitment Note</p>
                    <p className="mt-1.5 text-sm leading-5 text-slate-300">{product.fitment_note}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      <RelatedSection related={related} backLink="/spare-parts" backLabel="Spare Parts" />
    </div>
  )
}

// ===========================================================================
// Shared sub-components
// ===========================================================================
function HudStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/15 bg-black/40 px-3 py-2.5 backdrop-blur-sm clip-panel sm:px-4 sm:py-3">
      <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[10px]">{label}</span>
      <span className="block text-sm font-black text-white sm:text-base">{value}</span>
    </div>
  )
}

function RelatedSection({ related, backLink, backLabel }: { related: Product[]; backLink: string; backLabel: string }) {
  if (related.length === 0) return null
  return (
    <section className="border-t border-white/10 bg-pitlane/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <h2 className="text-xl font-black uppercase text-white sm:text-3xl">Related Products</h2>
          <Link href={backLink} className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-volt hover:text-volt/80 transition sm:text-xs">
            View All <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {related.map((item) => (
            <Link key={item.id} href={"/products/" + item.id} className="group border border-white/10 bg-white/[0.03] shadow-hud clip-panel hover:border-volt/40 transition">
              <div className="relative overflow-hidden clip-panel">
                <img src={item.image_url} alt={item.name} className="h-40 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44" />
                <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-volt px-2 py-1 text-[10px] font-black text-asphalt clip-panel">
                  <Star className="h-3 w-3 fill-current" /> {item.power_score}
                </span>
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">{item.brand}</p>
                <p className="mt-1 text-sm font-black uppercase leading-tight text-white transition group-hover:text-volt">{item.name}</p>
                <p className="mt-2 text-lg font-black text-volt">{formatMoney(Number(item.price))}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}