import { ArrowRight } from 'lucide-react'

const Newsletter = () => {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-red-600 text-sm font-bold uppercase tracking-wider">
            Get Every Single Update
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase mt-4 mb-6">
            SUBSCRIBE FOR UPDATED
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-1 px-6 py-4 bg-white text-black placeholder-gray-500 text-sm"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold uppercase text-sm transition flex items-center justify-center gap-2">
              <span>Subscribe</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
