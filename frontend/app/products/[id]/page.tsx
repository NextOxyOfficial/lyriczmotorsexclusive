'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  Gauge,
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
]

const STATUS_COLORS: Record<string, string> = {
  in_stock: 'bg-volt/10 text-volt border-volt/30',
  limited: 'bg-boost/10 text-boost border-boost/30',
  preorder: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  out_of_stock: 'bg-ignition/10 text-ignition border-ignition/30',
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>()
  const productId = params.id
  const [product, setProduct] = useState<Product | null>(
    fallbackProducts.find((p) => String(p.id) === productId) || null
  )
  const [related, setRelated] = useState<Product[]>([])
  const [cartAdded, setCartAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem, openDrawer } = useCart()

  useEffect(() => {
    setCartAdded(false)
    setActiveImage(0)

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
    openDrawer()
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

  const backLink = product.product_type === 'spare_part' ? '/spare-parts' : '/#garage'
  const backLabel = product.product_type === 'spare_part' ? 'Spare Parts' : 'Garage'
  const savings = product.compare_at_price
    ? Number(product.compare_at_price) - Number(product.price)
    : 0
  const specEntries = Object.entries(product.specs)
  const images = [product.image_url]

  return (
    <div className="min-h-screen bg-asphalt text-slate-50">

      {/* Breadcrumb */}
      <div className="border-b border-white/10 bg-pitlane/50">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 hover:text-volt transition">Home</Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <Link href={backLink} className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 hover:text-volt transition">{backLabel}</Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="max-w-xs truncate text-xs font-bold uppercase tracking-[0.12em] text-volt">{product.name}</span>
        </div>
      </div>

      {/* Hero: Image + Info */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 hud-grid opacity-15" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[1fr_440px] lg:gap-10 lg:px-8 lg:py-14 xl:grid-cols-[1fr_480px]">

          {/* Image column */}
          <div className="mb-8 lg:mb-0">
            <div className="relative overflow-hidden border border-white/10 bg-black/40 shadow-hud clip-panel">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-[320px] w-full object-cover sm:h-[460px] lg:h-[520px]"
              />
              <span className={`absolute left-4 top-4 border px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] clip-panel ${STATUS_COLORS[product.status] ?? 'bg-white/10 text-white border-white/20'}`}>
                {product.status.replace(/_/g, ' ')}
              </span>
              {product.is_featured && (
                <span className="absolute right-4 top-4 flex items-center gap-1.5 border border-boost/40 bg-boost/10 px-3 py-1.5 text-xs font-black uppercase text-boost clip-panel">
                  <Award className="h-3.5 w-3.5" /> Featured
                </span>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-24 overflow-hidden border clip-panel transition ${activeImage === idx ? 'border-volt/60' : 'border-white/10 opacity-50 hover:opacity-80'}`}
                  aria-label={`Image ${idx + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info column */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 border border-volt/30 bg-volt/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-volt clip-panel">
                <Zap className="h-3.5 w-3.5" /> {product.product_type === 'spare_part' ? 'Spare Part' : 'Bike'}
              </span>
              <span className="border border-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] text-slate-400 clip-panel">
                {product.category}
              </span>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">{product.brand}</p>
              <h1 className="mt-1 text-3xl font-black uppercase leading-tight text-white sm:text-4xl">{product.name}</h1>
            </div>

            {/* Power score + description */}
            <div className="flex items-start gap-4">
              <div className="flex flex-shrink-0 flex-col items-center border border-white/10 bg-white/[0.04] px-4 py-3 clip-panel">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Power</span>
                <span className={`text-3xl font-black ${product.power_score >= 90 ? 'text-volt' : product.power_score >= 75 ? 'text-boost' : 'text-ignition'}`}>{product.power_score}</span>
                <div className="mt-1 h-1.5 w-14 overflow-hidden bg-white/10 clip-panel">
                  <div
                    className={`h-full ${product.power_score >= 90 ? 'bg-volt' : product.power_score >= 75 ? 'bg-boost' : 'bg-ignition'}`}
                    style={{ width: `${product.power_score}%` }}
                  />
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-300">{product.short_description}</p>
            </div>

            {/* Price */}
            <div className="border border-white/10 bg-white/[0.03] p-4 clip-panel">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Selling Price</p>
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <p className="text-4xl font-black text-volt">{formatMoney(Number(product.price))}</p>
                {product.compare_at_price && (
                  <div className="flex flex-col pb-0.5">
                    <span className="text-sm font-bold text-slate-500 line-through">{formatMoney(Number(product.compare_at_price))}</span>
                    <span className="text-xs font-black text-boost">Save {formatMoney(savings)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`inline-flex flex-1 items-center justify-center gap-2 px-5 py-4 text-sm font-black uppercase clip-panel transition ${
                  cartAdded ? 'border border-volt bg-volt/20 text-volt' : 'bg-ignition text-white hover:bg-ignition/90'
                }`}
              >
                {cartAdded
                  ? <><CheckCircle2 className="h-5 w-5" /> Added to Cart</>
                  : <><ShoppingCart className="h-5 w-5" /> Add to Cart</>}
              </button>
              <Link
                href="/#book"
                className="inline-flex flex-1 items-center justify-center gap-2 bg-volt px-5 py-4 text-sm font-black uppercase text-asphalt clip-panel hover:bg-volt/90 transition"
              >
                <Wrench className="h-5 w-5" /> Request Deal
              </Link>
            </div>

            {/* Call */}
            <a
              href="tel:+8801700000000"
              className="flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3 clip-panel hover:border-volt/30 transition"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-volt/30 bg-volt/10 text-volt clip-panel">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Call / WhatsApp</p>
                <p className="text-sm font-black text-white">+880 17XX-XXXXXX</p>
              </div>
            </a>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <ShieldCheck className="h-4 w-4" />, text: 'Genuine Product' },
                { icon: <Truck className="h-4 w-4" />, text: 'Delivery Available' },
                { icon: <PackageCheck className="h-4 w-4" />, text: 'Verified Stock' },
                { icon: <Tag className="h-4 w-4" />, text: 'Best Price' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2.5 clip-panel">
                  <span className="text-volt">{icon}</span>
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-slate-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specs & Details */}
      <section className="border-t border-white/10 bg-pitlane/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

            {/* Specs table */}
            <div>
              <h2 className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-volt">
                <Gauge className="h-4 w-4" /> Technical Specifications
              </h2>
              <div className="overflow-hidden border border-white/10 clip-panel">
                {specEntries.map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between gap-6 px-5 py-4 ${i % 2 === 0 ? 'bg-graphite' : 'bg-pitlane/70'}`}
                  >
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 shrink-0 w-28">{key}</span>
                    <span className="text-right text-sm font-black text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights + delivery */}
            <div className="space-y-5">
              <div className="border border-white/10 bg-graphite p-5 clip-panel">
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-volt">What You Get</h3>
                <ul className="space-y-3">
                  {(product.product_type === 'bike'
                    ? [
                        'Full PDI (Pre-Delivery Inspection)',
                        "Owner's manual & warranty card",
                        'First free service reminder',
                        'Registration assistance available',
                      ]
                    : [
                        'Fitment guide & install support',
                        'Quality-checked before dispatch',
                        'Service center installation available',
                        'Replacement warranty included',
                      ]
                  ).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-volt" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-volt/20 bg-volt/[0.04] p-5 clip-panel">
                <h3 className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-volt">Delivery & Payment</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-volt" /> Showroom pickup or home delivery</li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-volt" /> bKash · Nagad · Cash on Delivery</li>
                  <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-volt" /> Confirm via call or WhatsApp</li>
                </ul>
              </div>

              {savings > 0 && (
                <div className="border border-boost/20 bg-boost/[0.05] p-5 clip-panel">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-boost">Limited Time Offer</p>
                  <p className="mt-2 text-2xl font-black text-white">Save {formatMoney(savings)}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Original: <span className="line-through">{formatMoney(Number(product.compare_at_price))}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-white/10 bg-asphalt">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black uppercase text-white sm:text-3xl">Related Products</h2>
              <Link
                href={backLink}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-volt hover:text-volt/80 transition"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group border border-white/10 bg-white/[0.03] p-3 shadow-hud clip-panel hover:border-volt/40 transition"
                >
                  <div className="relative overflow-hidden clip-panel">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-volt px-2 py-1 text-[10px] font-black text-asphalt clip-panel">
                      <Star className="h-3 w-3 fill-current" /> {item.power_score}
                    </span>
                  </div>
                  <div className="p-2 pt-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{item.brand}</p>
                    <p className="mt-1 text-sm font-black uppercase leading-tight text-white transition group-hover:text-volt">{item.name}</p>
                    <p className="mt-2 text-lg font-black text-volt">{formatMoney(Number(item.price))}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value)
}
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
]

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>()
  const productId = params.id
  const [product, setProduct] = useState<Product | null>(fallbackProducts.find((item) => String(item.id) === productId) || null)
  const [cartAdded, setCartAdded] = useState(false)
  const { addItem, openDrawer } = useCart()

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`${apiBaseUrl}/products/${productId}/`, { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Unable to load product')
        }

        const data = await response.json()
        setProduct(data)
        await trackMarketingEvent('ViewContent', {
          content_name: data.name,
          content_type: data.product_type,
          value: Number(data.price),
          currency: 'BDT',
        })
      } catch {
        const fallback = fallbackProducts.find((item) => String(item.id) === productId) || null
        setProduct(fallback)
      }
    }

    loadProduct()
  }, [productId])

  const relatedBackLink = useMemo(() => {
    return product?.product_type === 'spare_part' ? '/spare-parts' : '/#garage'
  }, [product?.product_type])

  async function addToCart() {
    if (!product) {
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      product_type: product.product_type,
      price: Number(product.price),
      image_url: product.image_url,
    })
    setCartAdded(true)
    openDrawer()
    await trackMarketingEvent('AddToCart', {
      content_name: product.name,
      content_type: product.product_type,
      value: Number(product.price),
      currency: 'BDT',
    })
  }

  if (!product) {
    return (
      <main className="grid min-h-screen place-items-center bg-asphalt px-4 text-center text-white">
        <div className="border border-white/10 bg-white/[0.04] p-8 clip-panel">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-ignition">Product Missing</p>
          <h1 className="mt-3 text-3xl font-black uppercase">This item is not available</h1>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 bg-volt px-5 py-3 text-sm font-black uppercase text-asphalt clip-panel">
            <ArrowLeft className="h-4 w-4" /> Back Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-asphalt text-slate-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-asphalt/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={relatedBackLink} className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-volt">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-3">
            <button type="button" onClick={openDrawer} className="flex items-center gap-2 border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-bold clip-panel hover:border-volt/30">
              <ShoppingCart className="h-4 w-4 text-boost" />
            </button>
            <Link href="/#book" className="inline-flex items-center gap-2 bg-ignition px-4 py-2 text-sm font-black uppercase text-white clip-panel">
              <CalendarClock className="h-4 w-4" /> Book
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 hud-grid opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(9,11,16,1),rgba(17,24,39,0.86),rgba(40,242,156,0.16))]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-16">
          <div className="overflow-hidden border border-white/10 bg-black/35 p-3 shadow-hud clip-panel">
            <img src={product.image_url} alt={product.name} className="h-[360px] w-full object-cover sm:h-[520px] clip-panel" />
          </div>

          <div className="self-center">
            <p className="inline-flex items-center gap-2 border border-volt/30 bg-volt/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-volt clip-panel">
              <Zap className="h-4 w-4" /> {product.product_type === 'spare_part' ? 'Spare Part' : 'Bike'} Details
            </p>
            <h1 className="mt-5 text-4xl font-black uppercase leading-tight text-white sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{product.short_description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Badge icon={<Star className="h-4 w-4 fill-current" />} label={`${product.power_score} Power`} />
              <Badge icon={<PackageCheck className="h-4 w-4" />} label={product.status.replace('_', ' ')} />
              <Badge icon={<ShieldCheck className="h-4 w-4" />} label={product.category} />
            </div>

            <div className="mt-8 border border-white/10 bg-white/[0.04] p-5 clip-panel">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Price</p>
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <p className="text-4xl font-black text-volt">{formatMoney(Number(product.price))}</p>
                {product.compare_at_price ? <p className="pb-1 text-sm font-bold text-slate-500 line-through">{formatMoney(Number(product.compare_at_price))}</p> : null}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={addToCart} className="inline-flex flex-1 items-center justify-center gap-2 bg-ignition px-5 py-4 text-sm font-black uppercase text-white clip-panel">
                  <ShoppingCart className="h-5 w-5" /> {cartAdded ? 'Added' : 'Add To Cart'}
                </button>
                <Link href="/#book" className="inline-flex flex-1 items-center justify-center gap-2 bg-volt px-5 py-4 text-sm font-black uppercase text-asphalt clip-panel">
                  <Wrench className="h-5 w-5" /> Request Deal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="border border-white/10 bg-white/[0.04] p-5 clip-panel">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{key}</p>
              <p className="mt-2 text-lg font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {['Verified stock and fitment', 'Premium service-center install support', 'Ad campaign lead tracking ready'].map((item) => (
            <div key={item} className="flex items-center gap-3 border border-white/10 bg-white/[0.04] p-5 clip-panel">
              <Check className="h-5 w-5 text-volt" />
              <span className="font-bold text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black uppercase text-slate-200 clip-panel">
      {icon} {label}
    </span>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value)
}