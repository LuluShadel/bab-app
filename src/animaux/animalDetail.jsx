import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from '../supabaseClient'

// import pour les onglet 
import AnimalProfil from './animalDetails/animalProfil'
import AnimalHistoire from './animalDetails/animalHistoire'
import AnimalSante from './animalDetails/animalSante'
import AnimalDoc from './animalDetails/animalDoc'
import AnimalHistorique from './animalDetails/animalHistorique'
import ConfirmationModal from '../components/modalConfirm'

// Import des svg
import { ReactComponent as MaleIcon } from '../svg/Male.svg'
import { ReactComponent as FemelleIcon } from '../svg/Femelle.svg'
import { ReactComponent as CatIcon } from '../svg/Cat.svg';
import { ReactComponent as DogIcon } from '../svg/Dog.svg';
import { ReactComponent as ChildIcon } from '../svg/Child.svg';
import { ReactComponent as ArrowRight } from '../svg/Arrow-Right.svg';


const onglets = ['Profil', 'Histoire', 'Santé', 'Documents', 'Historique']; // gère les onglets de la nav






export default function AnimalDetails() {
  const { id } = useParams()
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null) // stock les données animal
  const [ongletActif, setOngletActif] = useState('Profil'); // gère l'onglet de la sous nav

  //gère la modal archive
const [showModal, setShowModal] = useState(false);

// fonction pour passer archive de false à true 
const archiverAnimal = async (animalId) => {
  const { error } = await supabase
    .from('animaux')
    .update({ archive: true })
    .eq('id', animalId);

    setShowModal(false);

  if (error) {
    console.error('Erreur lors de l’archivage :', error);
  } else {
    navigate('/animaux/AnimauxArchive'); //  redirection après succès
  }
};



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
      <div className='flex flex-row gap-2 mb-2'>
      <Link to="/animaux/listeAnimals" className='text-gray-600'>Animaux</Link>
      <p><ArrowRight/></p>
      <p>{animal.name}</p>
      </div>
        {/* Titre + bouton modifier */}
        <div className="flex justify-between items-center mb-4 mt-2">
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
<div className="flex gap-6">
  <button
    onClick={() => setShowModal(true)}
    className="underline px-4 py-2 flex items-center gap-2 text-sm font-medium"
  >
    Archiver
  </button>

  <button className="bg-primaryYellow px-4 py-2 rounded-full flex items-center gap-2 shadow text-sm font-medium">
    Modifier
  </button>
</div>

<ConfirmationModal
  isOpen={showModal}
  message="Êtes-vous sûr de vouloir archiver cet animal ?"
  confirmText="Archiver"
  cancelText="Annuler"
 onConfirm={() => archiverAnimal(animal.id)} 
  onCancel={() => setShowModal(false)}
/>

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

   {ongletActif === 'Histoire' && <AnimalHistoire animal={animal} />}

 
   {ongletActif === 'Santé' && <AnimalSante animal={animal} />}
  {ongletActif === 'Documents' && <AnimalDoc animal={animal} />}
  {ongletActif === 'Historique' && <AnimalHistorique animal={animal} />}

        </div>
      </div>

     {/* Colonne droite - Photo + tags */}
<div className="w-1/3 flex flex-col gap-4">

  {/* Image avec badges en haut à gauche */}
  <div className="relative rounded-2xl overflow-hidden shadow">
    {/* Badges positionnés en haut à gauche */}
    <div className="absolute top-2 left-2 flex flex-wrap gap-2 z-10">
      {animal.pension && (
        <span className="bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow">
          En pension
        </span>
      )}
      {animal.rechercheFa && (
        <span className="bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow">
          En recherche FA
        </span>
      )}
      {animal.adoption && (
        <span className="bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow">
          À l’adoption
        </span>
      )}
    </div>

    <img
      src={`https://cyrvizynjvgblsmyntmc.supabase.co/storage/v1/object/public/photos/${animal.img}`}
      alt={animal.name}
      className="w-full h-[350px] object-cover"
    />
  </div>

  {/* Ententes */}
  <div className="flex flex-wrap gap-2 mt-2">
  {['okChien', 'okChat', 'okChild'].map((cle) => {
    const valeur = animal[cle];

    const couleurs = {
      true: 'bg-[#217a4b] text-white',
      false: 'bg-[#ca3405] text-white',
      null: 'bg-[#db7c00] text-white',
    };

       const textes = {
      true: 'Oui',
      false: 'Non',
      null: 'Inconnu',
    };

    const icones = {
      okChien: <DogIcon />,
      okChat: <CatIcon />,
      okChild: <ChildIcon />,
    };

    return (
      <span
        key={cle}
        className={`flex items-center gap-1 px-2 py-1 rounded-[4px] text-sm font-medium shadow-md ${couleurs[valeur === null ? 'null' : valeur]}`}
      >
        {icones[cle]}  {textes[valeur === null ? 'null' : valeur]}
      </span>
    );
  })}
</div>

  {/* Modérateur / Localisation */}
  <div className="text-sm mt-2 flex flex-col gap-6 ">
    <p><strong className='text-primaryBlue font-bold'>Modérateur :</strong> {animal.suivi}</p>
    <p><strong className='text-primaryBlue  font-bold'>Localisation :</strong> {animal.localisation}</p>
  </div>
</div>

    </div>
  )
}
