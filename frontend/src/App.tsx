import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Lyricz Motors Exclusive
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Premium Automotive Experience
          </p>
          
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Count is {count}
            </button>
            <p className="mt-4 text-gray-400">
              Edit <code className="bg-gray-700 px-2 py-1 rounded">src/App.tsx</code> to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
