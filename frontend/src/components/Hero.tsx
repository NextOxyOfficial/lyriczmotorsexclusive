const Hero = () => {
  return (
    <section id="home" className="relative bg-cover bg-center text-white overflow-hidden" style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920&q=80)',
      minHeight: '450px'
    }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="max-w-2xl">
          <div className="mb-4">
            <span className="text-red-600 text-sm font-bold tracking-wider uppercase">Welcome to Lyricz Motors</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight uppercase tracking-wider">
            INVENTORY
          </h1>
        </div>
      </div>

      {/* Diagonal Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L1440 120L1440 0L0 80L0 120Z" fill="white"/>
        </svg>
      </div>

      {/* Breadcrumb */}
      <div className="absolute bottom-12 right-8 text-sm hidden md:block">
        <span className="text-red-600 font-semibold">Home</span>
        <span className="mx-2">/</span>
        <span>Inventory</span>
      </div>
    </section>
  )
}

export default Hero
