import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Animaux */}
        <Link
          to="animaux/listeAnimals"
          className="bg-blue-600 text-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition transform duration-200 col-span-2"
        >
          <div className="h-60 bg-blue-400 flex items-center justify-center">
            <img src="/images/chienetchat.webp" alt="Animaux" className="h-full w-full object-cover" />
          </div>
          <div className="p-4 text-center text-xl font-bold">Animaux</div>
        </Link>

        {/* Card Signalement */}
        <Link
          to="*"
          className="bg-red-600 text-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition transform duration-200"
        >
          <div className="h-60 bg-red-400 flex items-center justify-center">
            <img src="/images/signalement.avif" alt="Signalement" className="h-full w-full object-cover" />
          </div>
          <div className="p-4 text-center text-xl font-bold">Signalement</div>
        </Link>

        {/* Card Trésorerie */}
        <Link
          to="*"
          className="bg-green-600 text-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition transform duration-200"
        >
          <div className="h-32 bg-green-400 flex items-center justify-center">
            <img src="/images/billet.webp" alt="Trésorerie" className="h-full w-full object-cover" />
          </div>
          <div className="p-3 text-center font-semibold">Trésorerie</div>
        </Link>

        {/* Card Planning */}
        <Link
          to="*"
          className="bg-orange-500 text-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition transform duration-200"
        >
          <div className="h-32 bg-orange-400 flex items-center justify-center">
            <img src="/images/planning.webp" alt="Planning" className="h-full w-full object-cover" />
          </div>
          <div className="p-3 text-center font-semibold">Planning</div>
        </Link>
        {/* Card Comm */}
        <Link
          to="*"
          className="bg-yellow-500 text-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition transform duration-200"
        >
          <div className="h-32 bg-yellow-400 flex items-center justify-center">
            <img src="/images/communication.avif" alt="Communication" className="h-full w-full object-cover" />
          </div>
          <div className="p-3 text-center font-semibold">Communication</div>
        </Link>
      </div>
    </div>
  )
}
