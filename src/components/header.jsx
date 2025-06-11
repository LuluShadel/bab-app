import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import supabase from '../supabaseClient'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false) // responsive
  const [role, setRole] = useState(null); // gère le role de l'utilisateur ( modo ou fa) 

  const toggleMenu = () => setMenuOpen(!menuOpen)

  // deconnexion 
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // gère le role 
   useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
  
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('roles')
          .eq('id', user.id)
          .single();
  
        if (!error && data) {
          setRole(data.roles);
        }
      }
    };
  
    fetchRole();
  }, []);

  return (
    <header className="bg-blue-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <img src='/images/logoBAB.webp' alt='logo bab' className='w-20 h-20'/>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 text-blue-700 font-medium">
          <li><Link to="/" className="hover:text-blue-900 transition">Accueil</Link></li>
          <li><Link to="animaux/listeAnimals" className="hover:text-blue-900 transition">Animaux</Link></li>
           {(role === 'modo') && (
          <li><Link to="*" className="hover:text-blue-900 transition">Signalement</Link></li>
           )}
            {(role === 'modo') && (
          <li><Link to="*" className="hover:text-blue-900 transition">Trésorerie</Link></li>
            )}
             {(role === 'modo') && (
          <li><Link to="*" className="hover:text-blue-900 transition">Communication</Link></li>
             )}
           
          <button onClick={handleLogout}>Déconnexion</button>
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
