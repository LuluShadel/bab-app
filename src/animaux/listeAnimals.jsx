import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { Link } from 'react-router-dom';

// import des svg 
import { ReactComponent as CatIcon } from '../svg/Cat.svg';
import { ReactComponent as DogIcon } from '../svg/Dog.svg';
import { ReactComponent as ChildIcon } from '../svg/Child.svg';
import { ReactComponent as FemelleIcon } from '../svg/Femelle.svg';
import { ReactComponent as MaleIcon } from '../svg/Male.svg';
import { ReactComponent as SearchIcon } from '../svg/Search.svg';


import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardArrowRight  } from 'react-icons/md';


function ListeAnimals() {

  const [animaux, setAnimaux] = useState([]);   // animaux = liste des animaux 

  const [showFilters, setShowFilters] = useState(false); // gère l'ouverture du paneau filtre 
   const [rechercheNom, setRechercheNom] = useState(''); // va gérer la recherche par nom 
  //const [role, setRole] = useState(null); // gère le role de l'utilisateur modi ou fa

   // filtre 
   const [filtreEspece, setFiltreEspece] = useState('all'); // gère l'espèce
const [filtreGenre, setFiltreGenre] = useState('all'); // gère le genre 
const [filtreSterilise, setFiltreSterilise] = useState('all'); // gère si stérilisé


// dans les filtres 
const optionsSterilise = [ // gère le booléen de la stérilisation
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
  { label: 'Inconnu', value: null }
];

const [ageMin, setAgeMin] = useState(0); // gère l'age du slider 
const [ageMax, setAgeMax] = useState(20);

const [filtreStatuts, setFiltreStatuts] = useState([]); // gère le statut actuel
const [filtreBesoins, setFiltreBesoins] = useState([]); // gère le besoin actuel


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

  



const animauxFiltres = animaux.filter((animal) => {

 
  const correspondNom = animal.name.toLowerCase().includes(rechercheNom.toLowerCase());

  // type
   const correspondEspece = filtreEspece === 'all' || animal.type === filtreEspece;
   // sexe
  const correspondGenre = filtreGenre === 'all' || animal.sexe === filtreGenre;
  //sterilisation
 const correspondSterilise =
  filtreSterilise === 'all' || animal.sterilisation === filtreSterilise;
  const ageAnimal = calculerAge(animal.ddn); // retourne un nombre
const correspondAge = ageAnimal >= ageMin && ageAnimal <= ageMax;

// filtre pour le statut actuel 
const correspondStatut =
  filtreStatuts.length === 0 ||
  filtreStatuts.every((key) => animal[key] === true);

  // filtre pour le besoin actuel 
const correspondBesoin =
  filtreBesoins.length === 0 ||
  filtreBesoins.every((key) => animal[key] === true);

  return correspondAge && correspondNom  && correspondEspece && correspondGenre && correspondSterilise &&correspondStatut && correspondBesoin;

  
});

// calcul nombre de filtre actif 
const nbFiltresActifs =
  (filtreEspece !== 'all' ? 1 : 0) +
  (filtreGenre !== 'all' ? 1 : 0) +
  (filtreSterilise !== 'all' ? 1 : 0)+
  (filtreStatuts.length > 0 ? 1 : 0)+
  (filtreBesoins.length > 0 ? 1 : 0);

  // vider les filtres 
  const handleResetFiltres = () => {
  setFiltreEspece('all');
  setFiltreGenre('all');
  setFiltreSterilise('all');
  setFiltreStatuts([]);
  setFiltreBesoins([]);
  setRechercheNom('');
};


// calcule age 
function calculerAge(ddn) {
  if (!ddn) return null;

  const naissance = new Date(ddn);
  if (isNaN(naissance)) return null;

  const aujourdHui = new Date();
  let age = aujourdHui.getFullYear() - naissance.getFullYear();
  const mois = aujourdHui.getMonth() - naissance.getMonth();

  if (mois < 0 || (mois === 0 && aujourdHui.getDate() < naissance.getDate())) {
    age--;
  }

  return age; // retourne un nombre
}

// filtre statut axtuelle 
const optionsStatut = [
  { label: 'En famille d’accueil', key: 'EnFamilleAccueil' },
  { label: 'En pension', key: 'pension' },
  { label: 'Panier retraite', key: 'panierRetraite' },
  { label: 'Sous réquisition', key: 'requisition' }
];

// filtre besoins axtuelle 
const optionsStatutBesoin = [
  { label: 'Recherche famille d\'accueil', key: 'rechercheFa' },
  { label: 'Recherche covoiturage', key: 'rechercheCovoit' },
  { label: 'Recherche adoptant ', key: 'adoption' },
];





  return (
   <div className="flex flex-col items-start px-12 py-8 bg-bgBlue">
  <div className="flex flex-wrap justify-between items-center gap-4 w-full mb-6 ">
    {/* Bouton Ajouter un animal */}
    <button
    
      className="flex items-center gap-2 bg-primaryYellow text-black px-4 py-2 rounded-full hover:bg-white hover:text-black hover:border hover:border-black transition"
    >
      Ajouter un animal
      < MdKeyboardArrowRight className='text-sm font-bold' />
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
      
      <SearchIcon/>
    </div>

   <div className="relative">



  {/* Bouton Filtres */}
  <button
    onClick={() => setShowFilters(!showFilters)}
    className=" flex flex-row items-center justify-between bg-primaryYellow text-black px-4 w-[320px] py-2 text-left rounded-lg shadow hover:bg-yellow-500 transition"
  >
    Filtres ({nbFiltresActifs}) <span className="ml-1 ">{showFilters ? <MdKeyboardArrowDown /> : < MdKeyboardArrowUp />}</span>
  </button>

  {/* Panneau déroulant filtres */}
  {showFilters && (
  <div className="absolute right-0  w-[320px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
   

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

     <div>
  <p className="font-semibold mb-2">Âge</p>

  <div className="flex justify-between text-sm text-gray-600 mb-1">
    <span>{ageMin} ans</span>
    <span>{ageMax} ans</span>
  </div>

  {/* Container */}
  <div className="relative h-6">
    {/* Barre de fond */}
    <div className="absolute top-1/2 left-0 right-0 h-2 bg-blue-100 rounded-full transform -translate-y-1/2"></div>

    {/* Barre active bleue entre les deux curseurs */}
    <div
      className="absolute top-1/2 h-2 bg-blue-400 rounded-full transform -translate-y-1/2 z-10"
      style={{
        left: `${(ageMin / 20) * 100}%`,
        width: `${((ageMax - ageMin) / 20) * 100}%`,
      }}
    />

    {/* Curseur min */}
    <input
      type="range"
      min="0"
      max="20"
      value={ageMin}
      onChange={(e) => {
        const val = Math.min(Number(e.target.value), ageMax - 1);
        setAgeMin(val);
      }}
      className="absolute w-full pointer-events-none appearance-none z-20 h-2 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primaryYellow [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto"
    />

    {/* Curseur max */}
    <input
      type="range"
      min="0"
      max="20"
      value={ageMax}
      onChange={(e) => {
        const val = Math.max(Number(e.target.value), ageMin + 1);
        setAgeMax(val);
      }}
      className="absolute w-full pointer-events-none appearance-none z-20 h-2 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primaryYellow [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto"
    />
  </div>
</div>

{/*Statut actuel*/}
<div>
  <p className="font-semibold mb-2">Statut Actuel</p>
  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
    {optionsStatut.map(({ label, key }) => (
      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filtreStatuts.includes(key)}
          onChange={() => {
            if (filtreStatuts.includes(key)) {
              setFiltreStatuts(filtreStatuts.filter((s) => s !== key));
            } else {
              setFiltreStatuts([...filtreStatuts, key]);
            }
          }}
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


{/*Besoin actuel*/}
<div>
  <p className="font-semibold mb-2">Besoins en cours</p>
  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
    {optionsStatutBesoin.map(({ label, key }) => (
      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filtreBesoins.includes(key)}
          onChange={() => {
            if (filtreBesoins.includes(key)) {
              setFiltreBesoins(filtreBesoins.filter((s) => s !== key));
            } else {
              setFiltreBesoins([...filtreBesoins, key]);
            }
          }}
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
    <div className="flex justify-between border-t px-4 py-3">
  <button
    onClick={handleResetFiltres}
    className="text-gray-500 hover:underline"
  >
    Réinitialiser
  </button>
</div>
  </div>
)}


</div>
  </div>







  {/* card animal*/ }
        
      <ul className='flex md:flex-row md:flex-wrap md:gap-6'>
        
        {animauxFiltres.map((item) => (
          <li key={item.id} className="w-[20em] h-[26em] rounded-[16px] bg-white overflow-hidden shadow-md">
            <Link to={`/animal/${item.id}`} className="block hover:opacity-90 transition">
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
  <FemelleIcon
    className="text-white bg-pink-500 text-lg p-[1.5px] rounded-sm shadow-md "
    title="Femelle"
  />
)}
  {item.sexe === 'Mâle' && (
    <MaleIcon className="text-white bg-blue-500 text-lg p-[1.5px] rounded-sm shadow-md" title="Mâle" />
  )}
</div>
            </div>
            <div className='flex fles-row gap-4'>
            <p>{item.race}</p>
            <p>{calculerAge(item.ddn)} ans</p>
            </div>
           <div className="flex flex-wrap gap-2 mt-2">
  {['okChien', 'okChat', 'okChild', ].map((cle) => {
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
      
            </div>
             </Link>
            </li> 
           
        ))}
      </ul>
      
      
        
     
    </div>
  );
}

export default ListeAnimals;