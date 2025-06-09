import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <header className="bg-blue-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <img src='/images/logoBAB.webp' alt='logo bab' className='w-20 h-20'/>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 text-blue-700 font-medium">
          <li><Link to="/" className="hover:text-blue-900 transition">Accueil</Link></li>
          <li><Link to="animaux/listeAnimals" className="hover:text-blue-900 transition">Animaux</Link></li>
          <li><Link to="*" className="hover:text-blue-900 transition">Signalement</Link></li>
          <li><Link to="*" className="hover:text-blue-900 transition">Trésorerie</Link></li>
          <li><Link to="*" className="hover:text-blue-900 transition">Communication</Link></li>
        </ul>

        {/* Bouton mobile */}
        <button onClick={toggleMenu} className="md:hidden text-blue-800">
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <ul className="md:hidden bg-blue-50 px-4 py-4 space-y-3 text-blue-700 font-medium">
          <li><Link to="/" onClick={toggleMenu}>Accueil</Link></li>
          <li><Link to="animaux/listeAnimals" onClick={toggleMenu}>Animaux</Link></li>
          <li><Link to="*" onClick={toggleMenu}>Signalement</Link></li>
          <li><Link to="*" onClick={toggleMenu}>Trésorerie</Link></li>
          <li><Link to="*" onClick={toggleMenu}>Communication</Link></li>
        </ul>
      )}
    </header>
  )
}
