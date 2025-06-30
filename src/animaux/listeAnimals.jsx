import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { FaDog, FaCat, FaChild } from 'react-icons/fa';
import AnimalForm from './animalForm';

function ListeAnimals() {

  const [animaux, setAnimaux] = useState([]);   // animaux = liste des animaux 
   const [showForm, setShowForm] = useState(false); // gère la modal
   const [filtreStatut, setFiltreStatut] = useState('all'); // va gérer le filtre par statut ( adoption, fa...)
   const [rechercheNom, setRechercheNom] = useState(''); // va gérer la recherche par nom 
   const [rechercheSuivi, setRechercheSuivi] = useState(''); // va gérer la recherche par modo ' suivi' 
   const [role, setRole] = useState(null); // gère le role de l'utilisateur modi ou fa

  useEffect(() => {
    async function fetchAnimaux() {
      const { data, error } = await supabase.from('animaux').select('*');
      console.log(data)

      if (error) {
        console.error('Erreur:', error);
      } else {
        setAnimaux(data);
      }
    }

    fetchAnimaux();
  }, []);

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

 const handleAddAnimal = async (newAnimal) => {
  console.log('NOUVEL ANIMAL :', newAnimal);
  const { data, error } = await supabase
    .from('animaux')
    .insert([newAnimal]);

  if (error) {
    console.error('Erreur ajout:', error);
  } else if (data) {
    setAnimaux([...animaux, data[0]]);
  }
};

const animauxFiltres = animaux.filter((animal) => {
  const correspondFiltre =
    filtreStatut === 'all' ||
    (filtreStatut === 'adoption' && animal.adoption) ||
    (filtreStatut === 'rechercheFa' && animal.rechercheFa) ||
    (filtreStatut === 'panierRetraite' && animal.panierRetraite) ||
    (filtreStatut === 'requisition' && animal.requisition);

  const correspondNom = animal.name.toLowerCase().includes(rechercheNom.toLowerCase());
  const correspondSuivi = animal.suivi?.toLowerCase().includes(rechercheSuivi.toLowerCase());

  return correspondFiltre && correspondNom && correspondSuivi;
});


// calcule age 
function calculerAge(ddn) {
  if (!ddn) return 'Inconnu';

  const naissance = new Date(ddn);
  if (isNaN(naissance)) return 'Inconnu'; // Si la date est invalide

  const aujourdHui = new Date();
  let age = aujourdHui.getFullYear() - naissance.getFullYear();
  const mois = aujourdHui.getMonth() - naissance.getMonth();

  if (mois < 0 || (mois === 0 && aujourdHui.getDate() < naissance.getDate())) {
    age--;
  }

  return age + ' ans';
}


  return (
    <div className='flex flex-col items-start m-12 bg-bgBlue'>
      <h1 className='text-blue-600 font-bold mb-8 text-xl'>Liste des animaux</h1>
      {(role === 'modo') && (
  <button
    onClick={() => setShowForm(true)}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-12"
  >
    Ajouter un nouvel animal
  </button>
)}
 {(role === 'modo') && (
      <div className="flex flex-row flex-wrap gap-2 mb-4 justify-center">
        <p>Filtrer par statut :</p>
  <button onClick={() => setFiltreStatut('all')} className="px-3 py-1 bg-gray-300 rounded">Tous</button>
  <button onClick={() => setFiltreStatut('adoption')} className="px-3 py-1 bg-green-300 rounded">À l'adoption</button>
  <button onClick={() => setFiltreStatut('rechercheFa')} className="px-3 py-1 bg-pink-300 rounded">Recherche FA</button>
  <button onClick={() => setFiltreStatut('panierRetraite')} className="px-3 py-1 bg-gray-300 rounded">Panier retraite</button>
  <button onClick={() => setFiltreStatut('requisition')} className="px-3 py-1 bg-red-300 rounded">Sous réquisition</button>
</div>
 )}
  {(role === 'modo') && (
<div className="mb-4 flex flex-col md:flex-row gap-4 w-full">
  <input
    type="text"
    placeholder="Rechercher un animal par nom"
    value={rechercheNom}
    onChange={(e) => setRechercheNom(e.target.value)}
    className="border border-gray-300 rounded px-3 py-1 w-full md:w-1/2"
  />
  <input
    type="text"
    placeholder="Rechercher par modérateur (suivi)"
    value={rechercheSuivi}
    onChange={(e) => setRechercheSuivi(e.target.value)}
    className="border border-gray-300 rounded px-3 py-1 w-full md:w-1/2"
  />
</div>
  )}
      
      <ul className='flex md:flex-row md:flex-wrap md:gap-[40px]'>
        
        {animauxFiltres.map((item) => (
          <li key={item.id} className='w-[20em] h-[26em] rounded-[16px] bg-white'>
            <img src={`https://cyrvizynjvgblsmyntmc.supabase.co/storage/v1/object/public/photos/${item.img}
`} alt={item.name} className='w-[330px] h-[231px] object-cover rounded-[16px]' />
            <div className='p-6 flex flex-col gap-4' >
          
            <h2 className='' >{item.name}</h2>
            <div className='flex fles-row gap-4'>
            <p>{item.race}</p>
            <p>{calculerAge(item.ddn)}</p>
            </div>
           <div className="flex flex-wrap gap-2 mt-2">
  {['okChien', 'okChat', 'okChild'].map((cle) => {
    const valeur = item[cle];

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
      okChien: <FaDog className="inline mr-1" />,
      okChat: <FaCat className="inline mr-1" />,
      okChild: <FaChild className="inline mr-1" />,
    };

    return (
      <span
        key={cle}
        className={`flex items-center gap-1 px-2 py-1 rounded-[4px] text-sm font-medium ${couleurs[valeur === null ? 'null' : valeur]}`}
      >
        {icones[cle]}  {textes[valeur === null ? 'null' : valeur]}
      </span>
    );
  })}
</div>
      
            </div>
            </li> 
        ))}
      </ul>
      
        {showForm && (
        <AnimalForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddAnimal}
        />
      )}
     
    </div>
  );
}

export default ListeAnimals;