import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { FaDog, FaCat, FaChild } from 'react-icons/fa';
import { FaMars, FaVenus, FaSearch } from 'react-icons/fa';
import AnimalForm from './animalForm';

function ListeAnimals() {

  const [animaux, setAnimaux] = useState([]);   // animaux = liste des animaux 
   const [showForm, setShowForm] = useState(false); // gère la modal
  const [showFilters, setShowFilters] = useState(false); // gère l'ouverture du paneau filtre 
   const [rechercheNom, setRechercheNom] = useState(''); // va gérer la recherche par nom 
   const [role, setRole] = useState(null); // gère le role de l'utilisateur modi ou fa

   // filtre 
   const [filtreEspece, setFiltreEspece] = useState('all'); // gère l'espèce
const [filtreGenre, setFiltreGenre] = useState('all'); // gère le genre 
const [filtreSterilise, setFiltreSterilise] = useState('all'); // gère si stérilisé
const optionsSterilise = [ // gère le booléen de la stérilisation
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
  { label: 'Inconnu', value: null }
];

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

 
  const correspondNom = animal.name.toLowerCase().includes(rechercheNom.toLowerCase());

   const correspondEspece = filtreEspece === 'all' || animal.type === filtreEspece;
  const correspondGenre = filtreGenre === 'all' || animal.sexe === filtreGenre;
 const correspondSterilise =
  filtreSterilise === 'all' || animal.sterilisation === filtreSterilise;

  return correspondNom  && correspondEspece && correspondGenre && correspondSterilise;

  
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
   <div className="flex flex-col items-start px-12 py-8 bg-bgBlue">
  <div className="flex flex-wrap justify-between items-center gap-4 w-full mb-6 ">
    {/* Bouton Ajouter un animal */}
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-2 bg-primaryYellow text-black px-4 py-2 rounded-full hover:bg-white hover:text-black hover:border hover:border-black transition"
    >
      Ajouter un animal
      <span className="text-sm">{'>'}</span>
    </button>

    {/* Champ de recherche */}
    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm flex-grow max-w-md">
      <input
        type="text"
        placeholder="Rechercher"
        value={rechercheNom}
        onChange={(e) => setRechercheNom(e.target.value)}
        className="outline-none border-none bg-transparent flex-grow"
      />
      
      <FaSearch />
    </div>

   <div className="relative">
  {/* Bouton Filtres */}
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="bg-primaryYellow text-black px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition"
  >
    Filtres (3) <span className="ml-1">{showFilters ? '▲' : '▼'}</span>
  </button>

  {/* Panneau déroulant filtres */}
  {showFilters && (
  <div className="absolute right-0 mt-2 w-[320px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
    {/* Header */}
    <div className="px-4 py-3 border-b bg-primaryYellow rounded-t-lg font-semibold flex items-center justify-between">
      <span>Filtres</span>
    </div>

    {/* Contenu filtres */}
    <div className="p-4 space-y-6 text-sm text-gray-800">

      {/* Espèce */}
      <div>
        <p className="font-semibold mb-2">Espèce</p>
       <div className="flex gap-4">
  {['Chien', 'Chat', 'NAC'].map((espece) => (
    <label
      key={espece}
      className="flex items-center gap-2 text-sm cursor-pointer"
    >
      <input
        type="checkbox"
        checked={filtreEspece === espece}
        onChange={() =>
          setFiltreEspece(filtreEspece === espece ? 'all' : espece)
        }
        className="peer hidden"
      />
      <span className="relative w-5 h-5 border-2 border-primaryYellow rounded-md flex items-center justify-center
        before:content-[''] before:w-3 before:h-3
        before:rounded-sm before:bg-primaryYellow
        before:scale-0 peer-checked:before:scale-100
        transition-all duration-150"
      />
      {espece}
    </label>
  ))}
</div>

      </div>

      {/* Genre */}
      <div>
        <p className="font-semibold mb-2">Genre</p>
        <div className="flex gap-4">
          {['Mâle', 'Femelle'].map((genre) => (
            <label key={genre} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="genre"
                checked={filtreGenre === genre}
                onChange={() =>
                  setFiltreGenre(filtreGenre === genre ? 'all' : genre)
                }
                className="peer hidden"
              />
              <span className="relative w-5 h-5 border-2 border-primaryYellow rounded-md flex items-center justify-center
        before:content-[''] before:w-3 before:h-3
        before:rounded-sm before:bg-primaryYellow
        before:scale-0 peer-checked:before:scale-100
        transition-all duration-150"
      />
              {genre}
            </label>
          ))}
        </div>
      </div>

      {/* Stérilisé */}
      <div>
        <p className="font-semibold mb-2">Stérilisé</p>
        <div className="flex gap-4">
          {optionsSterilise.map(({ label, value }) => (
            <label key={label} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="sterilise"
                checked={filtreSterilise === value}
                onChange={() =>
                  setFiltreSterilise(filtreSterilise === value ? 'all' : value)
                }
               className="peer hidden"
              />
               <span className="relative w-5 h-5 border-2 border-primaryYellow rounded-md flex items-center justify-center
        before:content-[''] before:w-3 before:h-3
        before:rounded-sm before:bg-primaryYellow
        before:scale-0 peer-checked:before:scale-100
        transition-all duration-150"
      />
              {label}
            </label>
          ))}
        </div>
      </div>

    </div>
  </div>
)}

</div>
  </div>


  {/* card animal*/ }
      
      <ul className='flex md:flex-row md:flex-wrap md:gap-6'>
        
        {animauxFiltres.map((item) => (
          <li key={item.id} className="w-[20em] h-[26em] rounded-[16px] bg-white overflow-hidden shadow-md">
  <div className="relative">
    <img
      src={`https://cyrvizynjvgblsmyntmc.supabase.co/storage/v1/object/public/photos/${item.img}`}
      alt={item.name}
      className="w-full h-[231px] object-cover rounded-[16px]"
    />

    {/* Badge Recherche FA */}
    {item.rechercheFa && (
      <span className="absolute top-2 left-2 translate-y-[5px] bg-white text-black text-xs font-bold px-2 py-1 rounded-xl shadow">
        Recherche FA
      </span>
    )}
    
  

  </div>
            <div className='p-6 flex flex-col gap-4' >
          
          <div className='flex flex-row gap-4'>
            <h2 className='' >{item.name}</h2>
            <div className="flex items-center gap-2">
  {item.sexe === 'Femelle' && (
  <FaVenus
    className="text-white bg-pink-500 text-lg p-[1.5px] rounded-sm shadow-md "
    title="Femelle"
  />
)}
  {item.sexe === 'Mâle' && (
    <FaMars className="text-white bg-blue-500 text-lg p-[1.5px] rounded-sm shadow-md" title="Mâle" />
  )}
</div>
            </div>
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
        className={`flex items-center gap-1 px-2 py-1 rounded-[4px] text-sm font-medium shadow-md ${couleurs[valeur === null ? 'null' : valeur]}`}
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