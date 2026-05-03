import { useState } from 'react'
import { ChevronDown, MapPin, Calendar, Gauge, Settings } from 'lucide-react'

interface Bike {
  id: number
  name: string
  price: number
  image: string
  badge?: string
  make: string
  type: string
  year: number
  mileage: string
  modelName: string
  condition: string
  location: string
  dealer: string
}

const BikeInventory = () => {
  const [priceRange, setPriceRange] = useState([5000, 15000])
  const [selectedMake, setSelectedMake] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [mileageRange, setMileageRange] = useState('any')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const bikes: Bike[] = [
    {
      id: 1,
      name: 'FRANK STARR 125 MOTORBIKE',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80',
      badge: 'SPECIAL',
      make: 'FRANK',
      type: 'SPORT',
      year: 2023,
      mileage: '0 km',
      modelName: 'Starr 125',
      condition: 'New',
      location: 'Calgary, Canada',
      dealer: 'Lyricz Motors'
    },
    {
      id: 2,
      name: 'YAMAHA YZF09 R3R5',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80',
      badge: 'FEATURED',
      make: 'YAMAHA',
      type: 'SPORT',
      year: 2022,
      mileage: '5,200 km',
      modelName: 'YZF R3',
      condition: 'Used',
      location: 'Toronto, Canada',
      dealer: 'Lyricz Motors'
    },
    {
      id: 3,
      name: 'KTM RC 390 RACE',
      price: 4850,
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&q=80',
      make: 'KTM',
      type: 'RACE',
      year: 2023,
      mileage: '1,200 km',
      modelName: 'RC 390',
      condition: 'Like New',
      location: 'Vancouver, Canada',
      dealer: 'Lyricz Motors'
    },
    {
      id: 4,
      name: 'DUCATI HYPERMOTARD 950 RVE',
      price: 9200,
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&q=80',
      badge: 'SPECIAL',
      make: 'DUCATI',
      type: 'HYPERMOTARD',
      year: 2021,
      mileage: '8,500 km',
      modelName: 'Hypermotard 950',
      condition: 'Used',
      location: 'Montreal, Canada',
      dealer: 'Lyricz Motors'
    },
    {
      id: 5,
      name: 'KAWASAKI VULCAN 900',
      price: 6500,
      image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=400&q=80',
      make: 'KAWASAKI',
      type: 'CRUISER',
      year: 2020,
      mileage: '12,300 km',
      modelName: 'Vulcan 900',
      condition: 'Used',
      location: 'Ottawa, Canada',
      dealer: 'Lyricz Motors'
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            {/* Search Widget */}
            <div className="bg-red-600 text-white p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold uppercase">Search Options</h3>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-sm opacity-90">Find your dream bike with our filters</p>
            </div>

            {/* Filter: Type of Bike */}
            <div className="bg-gray-50 p-4 mb-4 border border-gray-200">
              <button className="flex items-center justify-between w-full text-left font-bold mb-3">
                <span className="uppercase text-sm">Type of Bike</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <select 
                className="w-full p-2 border border-gray-300 text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="sport">Sport</option>
                <option value="cruiser">Cruiser</option>
                <option value="touring">Touring</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>

            {/* Filter: Select Make */}
            <div className="bg-gray-50 p-4 mb-4 border border-gray-200">
              <button className="flex items-center justify-between w-full text-left font-bold mb-3">
                <span className="uppercase text-sm">Select Make</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <select 
                className="w-full p-2 border border-gray-300 text-sm"
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
              >
                <option value="all">All Makes</option>
                <option value="yamaha">Yamaha</option>
                <option value="honda">Honda</option>
                <option value="kawasaki">Kawasaki</option>
                <option value="ducati">Ducati</option>
                <option value="ktm">KTM</option>
              </select>
            </div>

            {/* Filter: Price Range */}
            <div className="bg-gray-50 p-4 mb-4 border border-gray-200">
              <button className="flex items-center justify-between w-full text-left font-bold mb-3">
                <span className="uppercase text-sm">Price Range</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="space-y-3">
                <input 
                  type="range" 
                  min="0" 
                  max="20000" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Filter: Select Mileage */}
            <div className="bg-gray-50 p-4 mb-4 border border-gray-200">
              <button className="flex items-center justify-between w-full text-left font-bold mb-3">
                <span className="uppercase text-sm">Select Mileage</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <select 
                className="w-full p-2 border border-gray-300 text-sm"
                value={mileageRange}
                onChange={(e) => setMileageRange(e.target.value)}
              >
                <option value="any">Any Mileage</option>
                <option value="0-5000">0 - 5,000 km</option>
                <option value="5000-10000">5,000 - 10,000 km</option>
                <option value="10000+">10,000+ km</option>
              </select>
            </div>

            {/* Apply Filter Button */}
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-bold uppercase text-sm transition flex items-center justify-center gap-2">
              <span>Apply Filter</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Contact Card */}
            <div className="mt-6 bg-gray-900 text-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 p-3 rounded-full">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">+1 (360) 555 0168</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Call us for any questions</p>
            </div>

            {/* Mileage Range Info */}
            <div className="mt-6 bg-gray-100 p-6 border border-gray-200">
              <h4 className="font-bold uppercase text-sm mb-3">Mileage Range</h4>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span>Min Mileage:</span>
                  <span className="font-semibold">$5000 - $1,000</span>
                </p>
                <p className="text-xs text-gray-600">
                  Mileage range starts from <span className="font-semibold">$5000 - $1,000</span>
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar & View Options */}
            <div className="bg-gray-50 p-4 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Your search for real results..." 
                    className="flex-1 px-4 py-2 border border-gray-300 text-sm"
                  />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm font-semibold">
                    SEARCH
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Sort by: <span className="font-semibold">New Arrival</span></span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 border ${viewMode === 'grid' ? 'bg-red-600 text-white border-red-600' : 'border-gray-300'}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 border ${viewMode === 'list' ? 'bg-red-600 text-white border-red-600' : 'border-gray-300'}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bike Listings */}
            <div className="space-y-6">
              {bikes.map((bike) => (
                <div key={bike.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-80 relative">
                      {bike.badge && (
                        <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 text-xs font-bold uppercase z-10">
                          {bike.badge}
                        </span>
                      )}
                      <img 
                        src={bike.image} 
                        alt={bike.name}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold uppercase mb-2 hover:text-red-600 cursor-pointer">
                            {bike.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <strong className="text-black">MAKE:</strong> {bike.make}
                            </span>
                            <span className="flex items-center gap-1">
                              <strong className="text-black">TYPE:</strong> {bike.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <strong className="text-black">YEAR:</strong> {bike.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <strong className="text-black">MODEL NAME:</strong> {bike.modelName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-red-600">${bike.price.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Icons Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-xs text-gray-500">LOCATION</p>
                            <p className="font-semibold text-xs">{bike.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-xs text-gray-500">YEAR (MODEL)</p>
                            <p className="font-semibold text-xs">{bike.year}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Gauge className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-xs text-gray-500">MILEAGE</p>
                            <p className="font-semibold text-xs">{bike.mileage}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Settings className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-xs text-gray-500">CONDITION</p>
                            <p className="font-semibold text-xs">{bike.condition}</p>
                          </div>
                        </div>
                      </div>

                      {/* Dealer Info */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                          <div>
                            <p className="text-xs text-gray-500">DEALER</p>
                            <p className="text-sm font-semibold">{bike.dealer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center bg-red-600 text-white font-bold">
                  01
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition">
                  02
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition">
                  03
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}

export default BikeInventory
