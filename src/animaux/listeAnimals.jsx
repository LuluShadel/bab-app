import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { Link } from 'react-router-dom';
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


  return (
    <div className='flex flex-col items-start mx-auto w-full max-w-4xl px-4 mt-12'>
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
      
      <ul>
        
        {animauxFiltres.map((item) => (
          <li key={item.id} className='border-t-4 border-blue-500 p-4 flex flex-row items-center'>
            <img src={`https://cyrvizynjvgblsmyntmc.supabase.co/storage/v1/object/public/photos/${item.img}
`} alt={item.name} className='w-20 h-20 object-cover rounded-full shadow-md ' />
            <div className='ml-4' >
            <div className='flex flex-col gap-6'>
            <div className='flex flex-col' >{item.name} {item.ddn}
              <div className="inline-flex flex-wrap items-center gap-2 whitespace-nowrap">
      {item.adoption && (
        <span className='bg-green-300 rounded-xl p-1 mr-2'>A l'adoption</span>
      )}
      {item.rechercheFa && (
        <span className='bg-pink-300 rounded-xl p-1 mr-2'>Recherche FA</span>
      )}
      {item.panierRetraite && (
        <span className='bg-gray-300 rounded-xl p-1 mr-2'>Panier Retraite</span>
      )}
      {item.requisition && (
        <span className='bg-red-300 rounded-xl p-1 mr-2'>Sous réquisition</span>
      )}
      </div>
      </div>
            </div>
             <div className='flex flex-row gap-3'>
      <p> <span className='font-bold'>Icad :</span> {item.icad}</p>
      <p><span className='font-bold'>Type :</span> {item.type}</p>
      <p><span className='font-bold'>Race :</span>  {item.race}</p>
             </div>
             
            <p className='border border-dotted border-blue-500 p-1'>Suivi effectué par : {item.suivi}</p>
            <Link to={`/animal/${item.id}`}>
  <button className="bg-blue-500 text-white px-4 py-1 rounded mt-2 hover:bg-blue-600">
    Voir la fiche
  </button>
</Link>
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