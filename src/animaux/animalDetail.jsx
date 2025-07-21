import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from '../supabaseClient'

// import pour les onglet 
import AnimalProfil from './animalDetails/animalProfil'

// Import des svg
import { ReactComponent as MaleIcon } from '../svg/Male.svg'
import { ReactComponent as FemelleIcon } from '../svg/Femelle.svg'


const onglets = ['Profil', 'Histoire', 'Santé', 'Documents', 'Historique']; // gère les onglets de la nav


export default function AnimalDetails() {
  const { id } = useParams()
  const [animal, setAnimal] = useState(null) // stock les données animal
  const [ongletActif, setOngletActif] = useState('Profil'); // gère l'onglet de la sous nav

  useEffect(() => {
    const fetchAnimal = async () => {
      const { data, error } = await supabase.from('animaux').select('*').eq('id', id).single()
      if (!error) setAnimal(data)
    }

    fetchAnimal()
  }, [id])

  if (!animal) return <p>Chargement...</p>

  return (
    <div className="flex px-12 py-8 gap-8 bg-bgBlue h-screen">
      {/* Colonne gauche - Info texte et tabs */}
      <div className="flex flex-col w-2/3 bg-[#DCEAFF] rounded-2xl p-6 shadow">
        {/* Titre + bouton modifier */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
           <div >
  {animal.sexe === 'Femelle' && (
  <FemelleIcon
    className="text-white bg-pink-500 text-lg p-[1.5px] rounded-sm shadow-md "
    title="Femelle"
  />
)}
  {animal.sexe === 'Mâle' && (
    <MaleIcon className="text-white bg-blue-500 text-lg p-[1.5px] rounded-sm shadow-md" title="Mâle" />
  )}
</div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {animal.name} 
          </h1>
          
</div>
          <button className="bg-primaryYellow px-4 py-2 rounded-full flex items-center gap-2 shadow text-sm font-medium">
            Modifier 
          </button>
        </div>

      

        {/* Contenu actif (ex: Histoire) */}
        <div className="bg-white rounded-xl p-6 flex-1 shadow-inner relative overflow-visible">
            {/* Tabs */}
         <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 bg-blue-900 p-1 rounded-full shadow">
      {onglets.map((tab) => (
        <button
          key={tab}
          onClick={() => setOngletActif(tab)}
          className={`px-4 py-1 rounded-full text-sm transition font-medium
            ${ongletActif === tab
              ? 'bg-primaryYellow text-black shadow'
              : 'text-white hover:bg-blue-800'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
         {/* Affichage dynamique selon l’onglet actif */}
  {ongletActif === 'Profil' && <AnimalProfil animal={animal} />}

  {ongletActif === 'Histoire' && (
    <>
      <h2 className="text-lg font-bold mb-2">Mon histoire</h2>
      <p className="mb-4">{animal.histoire}</p>

      <h2 className="text-lg font-bold mb-2">Mes besoins</h2>
      <p className="mb-4">{animal.besoins}</p>

      <h2 className="text-lg font-bold mb-2">Mes ententes</h2>
      <p>{animal.ententes}</p>
    </>
  )}

  {ongletActif === 'Santé' && <p>Santé à venir...</p>}
  {ongletActif === 'Documents' && <p>Documents à venir...</p>}
  {ongletActif === 'Historique' && <p>Historique à venir...</p>}

        </div>
      </div>

      {/* Colonne droite - Photo + tags */}
      <div className="w-1/3 flex flex-col gap-4">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow">
          <img src={`URL/${animal.img}`} alt={animal.name} className="w-full h-[250px] object-cover" />
        </div>

        {/* Statuts */}
        <div className="flex flex-wrap gap-2">
          {animal.enPension && <span className="badge">En pension</span>}
          {animal.rechercheFa && <span className="badge">En recherche FA</span>}
          {animal.adoption && <span className="badge">À l’adoption</span>}
        </div>

        {/* Ententes */}
        <div className="flex flex-wrap gap-2">
          {/* Exemple pour okChien */}
        </div>

        {/* Modérateur / Localisation */}
        <div className="text-sm mt-2">
          <p><strong>Modérateur :</strong> Clara</p>
          <p>
            <strong>Localisation :</strong> {animal.localisation}
          </p>
        </div>
      </div>
    </div>
  )
}
