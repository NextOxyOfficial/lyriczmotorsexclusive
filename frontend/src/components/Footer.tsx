import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About RevMoto */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">About RevMoto</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted partner for premium motorcycles. We offer new and used bikes, expert repairs, and custom modifications.
            </p>
            <p className="text-sm text-gray-400">
              <strong>Address:</strong><br />
              123 Motor Street, City, State 12345
            </p>
          </div>

          {/* Latest News */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Latest News</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=80&q=80" 
                  alt="News" 
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <h4 className="text-sm font-semibold hover:text-red-600 cursor-pointer mb-1">
                    An Exclusive Bike Show You Won't Believe
                  </h4>
                  <p className="text-xs text-gray-500">November 15, 2024</p>
                </div>
              </div>
              <div className="flex gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=80&q=80" 
                  alt="News" 
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <h4 className="text-sm font-semibold hover:text-red-600 cursor-pointer mb-1">
                    Motorcycle Road Trip: Looking for Inspiration
                  </h4>
                  <p className="text-xs text-gray-500">November 12, 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dealer Information */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Dealer Information</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-red-600 cursor-pointer transition">
                <a href="#">Lyricz Motors</a>
              </li>
              <li className="hover:text-red-600 cursor-pointer transition">
                <a href="#">Certified Dealers</a>
              </li>
              <li className="hover:text-red-600 cursor-pointer transition">
                <a href="#">Warranty Information</a>
              </li>
              <li className="hover:text-red-600 cursor-pointer transition">
                <a href="#">Service Centers</a>
              </li>
              <li className="hover:text-red-600 cursor-pointer transition">
                <a href="#">Contact Support</a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <p>
                <strong className="text-white">Phone:</strong><br />
                +1 (360) 555 0168
              </p>
              <p>
                <strong className="text-white">Email:</strong><br />
                info@lyriczmotors.com
              </p>
              <p>
                <strong className="text-white">Hours:</strong><br />
                Monday - Saturday: 9AM - 6PM<br />
                Sunday: Closed
              </p>
            </div>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2024 Lyricz Motors Exclusive. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-red-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-red-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-red-600 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
