import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaDog, FaHome, FaCog, FaSignOutAlt,
  FaClipboardList, FaUserFriends, FaUserMd, FaBook, FaTimes, FaBars, FaHandshake
} from 'react-icons/fa'
import supabase from '../supabaseClient'

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [role, setRole] = useState(null)
  const location = useLocation()

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const handleLogout = async () => await supabase.auth.signOut()

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('roles')
          .eq('id', user.id)
          .single()
        if (!error && data) setRole(data.roles)
      }
    }
    fetchRole()
  }, [])

  const links = [
    { to: '/', label: 'Tableau de board', icon: <FaHome /> },
    { to: '/animaux/listeAnimals', label: 'Animaux', icon: <FaDog /> },
       { to: '/fa', label: 'Familles d’accueil', icon: <FaUserFriends /> },
    { to: '/benevole', label: 'Bénévole', icon:  <FaHandshake /> },
    { to: '/veterinaires', label: 'Vétérinaires', icon: <FaUserMd /> },
    { to: '/referentiel', label: 'Référentiel', icon: <FaBook /> },
    
  ]

  return (
    <>
      {/* Sidebar compact + hover desktop */}
      <aside className="hidden md:block fixed top-0 left-0 h-screen z-40 group">
        <div className="bg-blue-900 text-white w-16 group-hover:w-64 transition-all duration-300 h-full flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="h-20 flex items-center justify-center border-b border-blue-800">
            <img src="/images/logoBAB.webp" alt="logo" className="w-10 h-10" />
          </div>

          {/* Nav links */}
          <nav className="flex-1 py-4">
            {links.map(link => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`flex items-center px-4 py-3 space-x-4 hover:bg-blue-800 transition-all ${
                    isActive ? 'bg-yellow-400 text-blue-900 font-semibold' : ''
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="whitespace-nowrap overflow-hidden group-hover:inline-block hidden">
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </nav>

         

          {/* Déconnexion et réglage  */}
          <div className="p-4">

             {/* Réglage*/ }
          <Link
  to="/reglages"
  className={`flex items-center space-x-3 text-left hover:bg-blue-800 w-full px-4 py-2 rounded-lg ${
    location.pathname === '/reglages' ? 'bg-yellow-400 text-blue-900 font-semibold' : ''
  }`}
>
  <FaCog />
  <span className="whitespace-nowrap overflow-hidden group-hover:inline-block hidden">
    Réglages
  </span>
</Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-left hover:bg-blue-800 w-full px-4 py-2 rounded-lg"
            >
              <FaSignOutAlt />
              <span className="whitespace-nowrap overflow-hidden group-hover:inline-block hidden">
                Déconnexion
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleMenu} className="text-blue-800 bg-white p-2 rounded-md shadow">
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed top-0 left-0 h-full w-[260px] bg-blue-900 text-white z-40 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="flex items-center justify-center h-20 border-b border-blue-800">
          <img src="/images/logoBAB.webp" alt="logo" className="w-16 h-16" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map(link => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-blue-800 rounded-lg">
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </div>
    </>
  )
}
