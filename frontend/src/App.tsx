import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BikeInventory from './components/BikeInventory'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <BikeInventory />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default App
