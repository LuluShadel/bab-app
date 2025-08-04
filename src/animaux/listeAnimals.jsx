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
import { ReactComponent as Archive } from '../svg/Archive.svg';



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

const [filtreLieu, setFiltreLieu] = useState(""); // gère le lieu de vie 
const [filtreStatuts, setFiltreStatuts] = useState([]); // gère le statut actuel
const [filtreBesoins, setFiltreBesoins] = useState([]); // gère le besoin actuel
const [filtresEntente, setFiltresEntente] = useState({ // gère le filtre sur les ententes 
  chien: null,    // "ok", "non", "inconnu"
  chat: null,
  enfant: null,
});



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
  if (animal.archive) return false; // ⛔ exclure les archivés

 // recherche par nom
  const correspondNom = animal.name.toLowerCase().includes(rechercheNom.toLowerCase()) ||
                      (animal.ancienNom?.toLowerCase().includes(rechercheNom.toLowerCase()));

  // type
   const correspondEspece = filtreEspece === 'all' || animal.type === filtreEspece;
   // sexe
  const correspondGenre = filtreGenre === 'all' || animal.sexe === filtreGenre;
  //sterilisation
 const correspondSterilise =
  filtreSterilise === 'all' || animal.sterilisation === filtreSterilise;
  const ageAnimal = calculerAge(animal.ddn); // retourne un nombre
const correspondAge = ageAnimal >= ageMin && ageAnimal <= ageMax;

 // ententes 
const checkEntente = (valeurAnimal, filtre) => {
  if (!filtre) return true;
  if (filtre === "ok") return valeurAnimal === true;
  if (filtre === "non") return valeurAnimal === false;
  if (filtre === "inconnu") return valeurAnimal === null;
  return true;
};

const correspondEntente =
  checkEntente(animal.okChien, filtresEntente.chien) &&
  checkEntente(animal.okChat, filtresEntente.chat) &&
  checkEntente(animal.okChild, filtresEntente.enfant);

// filtre pour le statut actuel 
const correspondStatut =
  filtreStatuts.length === 0 ||
  filtreStatuts.every((key) => animal[key] === true);

  // filtre pour le besoin actuel 
const correspondBesoin =
  filtreBesoins.length === 0 ||
  filtreBesoins.every((key) => animal[key] === true);

  // filtre pour le lieu de vie 
  const correspondLieu =
  !filtreLieu || (filtreLieu === "EnFamilleAccueil" && animal.EnFamilleAccueil === true) || (filtreLieu === "pension" && animal.pension === true);


  return correspondLieu && correspondAge && correspondNom  && correspondEspece && correspondGenre && correspondSterilise &&correspondStatut && correspondBesoin &&  correspondEntente;

  
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
  setFiltreLieu('');
  setFiltresEntente('')
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

// filtre statut 
const optionsStatut = [
   { label: 'Panier retraite', key: 'panierRetraite' },
  { label: 'Recherche de FA', key: 'rechercheFa' },
  { label: 'Recherche de covoiturage', key: 'rechercheCovoit' },
 
  { label: 'Catégorisé', key: 'categorise' }
];

// filtre conditions d'accueil
const optionsStatutBesoin = [
  { label: 'Besoins environnement calme', key: 'endroitCalme' },
  { label: 'Suivi médical', key: 'santeFragile' },
  { label: 'Jardin ', key: 'jardin' },
  { label: 'Lieu sans escalier ', key: 'escalier' },
  { label: 'Présence congénères ', key: 'congenere' },
];


// filtre ententes 
const toggleEntente = (type, valeur) => {
  setFiltresEntente((prev) => ({
    ...prev,
    [type]: prev[type] === valeur ? null : valeur,
  }));
};

const options = [
  { key: "chien", emoji: <DogIcon/> },
  { key: "chat", emoji: <CatIcon/> },
  { key: "enfant", emoji: <ChildIcon/> },
];

const choix = [
  {
    value: "ok",
    label: "Ok",
    activeClass: "bg-[#247c4f] text-white",
    inactiveClass: "border-[#247c4f]",
  },
  {
    value: "non",
    label: "Non",
    activeClass: "bg-[#cc300f] text-white",
    inactiveClass: "border-[#cc300f]",
  },
  {
    value: "inconnu",
    label: "Inconnu",
    activeClass: "bg-[#dc7c00] text-white",
    inactiveClass: "border-[#dc7c00]",
  },
];


// toggle ententes chien chat enfant 
const renderEntenteButtons = (type, emoji) => (
  <div className="flex gap-2 items-center">
    {choix.map(({ value, label, activeClass, inactiveClass }) => {
      const isActive = filtresEntente[type] === value;
      return (
        <button
          key={value}
          onClick={() => toggleEntente(type, value)}
          className={`border px-2 py-1 rounded flex items-center gap-1 transition ${
            isActive ? activeClass : inactiveClass
          }`}
        >
          {emoji} {label}
        </button>
      );
    })}
  </div>
);





  return (
  <div className="flex flex-col items-center mt-4 md:mt-0 md:px-12 md:py-8 bg-bgBlue">
  {/* Barre de recherche centrée */}
  <div  className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm mb-6 md:w-2/4">
    <input
      type="text"
      placeholder="Rechercher"
      value={rechercheNom}
      onChange={(e) => setRechercheNom(e.target.value)}
      className="outline-none border-none bg-transparent flex-grow"
    />
    <SearchIcon />
  </div>

  {/* Ligne du dessous : archive + ajouter (à gauche) | filtre (à droite) */}
  <div className="w-full flex flex-row justify-between items-center px-2 mb-2 md:mb-8">
    
    {/* Archive + Ajouter (à gauche sur desktop) */}
    <div className="flex gap-6 mb-4 md:mb-0 md:ml-10">
      {/* Bouton archive */}
      <Link
        to={`/animaux/AnimauxArchive`}
        className="flex items-center md:gap-2 underline text-black hover:text-gray-700 transition"
      >
        Voir les animaux archiver
        <Archive />
      </Link>

      {/* Bouton ajouter */}
      <button
        className="items-center gap-2 hidden md:flex border border-primaryYellow bg-primaryYellow text-black px-4 py-2 rounded-full hover:bg-white hover:text-black hover:border hover:border-black transition"
      >
        Ajouter un animal
        <MdKeyboardArrowRight className="text-sm font-bold" />
      </button>
    </div>

    {/* Filtres (à droite) */}
    <div className="relative md:mr-10">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex flex-row items-center justify-between bg-primaryYellow text-black px-4 md:w-[320px] py-2 text-left rounded-lg shadow hover:bg-yellow-500 transition"
      >
        Filtres ({nbFiltresActifs}){" "}
        <span className="ml-1">
          {showFilters ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
        </span>
      </button>

      {/* Panneau déroulant filtres */}
      {showFilters && (
  <div className="absolute left-[-12rem] md:left-0 w-[320px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-y-auto scrollbar-custom">

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

  {/* Container age  */}
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


{/* ententes */}
<div className="flex flex-col gap-4">
  <p className="font-semibold">Ententes</p>
  {options.map(({ key, emoji }) => (
    <div key={key}>{renderEntenteButtons(key, emoji)}</div>
  ))}
</div>

{/* Lieu de vie */}
<div>
  <p className="font-semibold mb-2">Lieu de vie</p>
  <div className="space-y-2">
    {[
      { label: "En famille d'accueil", key: "EnFamilleAccueil" },
      { label: "En pension", key: "pension" },
    ].map(({ label, key }) => (
      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="radio"
          name="lieuDeVie"
          checked={filtreLieu === key}
          onChange={() => setFiltreLieu(filtreLieu === key ? "" : key)}
          className="peer hidden"
        />
        <span className="relative w-5 h-5 border-2 border-primaryYellow rounded-full flex items-center justify-center
          before:content-[''] before:w-3 before:h-3
          before:rounded-full before:bg-primaryYellow
          before:scale-0 peer-checked:before:scale-100
          transition-all duration-150"
        />
        {label}
      </label>
    ))}
  </div>
</div>

{/*Statut  */}
<div>
  <p className="font-semibold mb-2">Statut</p>

  {/* Radios exclusifs */}
  <div className="space-y-2 mb-4">
    {[
      { label: "À l'adoption", key: "adoption" },
      { label: "Sous réquisition", key: "requisition" },
    ].map(({ label, key }) => (
      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="radio"
          name="lieuRadio"
          checked={filtreStatuts.includes(key)}
          onChange={() => {
            setFiltreStatuts(
              filtreStatuts.includes(key)
                ? [] // décocher si déjà actif
                : [key] // n'autorise qu'un seul
            );
          }}
          className="peer hidden"
        />
        <span className="relative w-5 h-5 border-2 border-primaryYellow rounded-full flex items-center justify-center
          before:content-[''] before:w-3 before:h-3
          before:rounded-full before:bg-primaryYellow
          before:scale-0 peer-checked:before:scale-100
          transition-all duration-150"
        />
        {label}
      </label>
    ))}
  </div>

  {/* Checkboxes pour le reste */}
  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-custom">
    {optionsStatut
      .filter(({ key }) => key !== "adoption" && key !== "requisition")
      .map(({ label, key }) => (
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



{/*Conditions d'accueil*/}
<div>
  <p className="font-semibold mb-2">Conditions d'accueil</p>
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
        
      <ul className='flex flex-col  md:flex-row md:flex-wrap gap-6'>
        
        {animauxFiltres.map((item) => (
          <li key={item.id} className="md:w-[20em] h-[27em] rounded-[16px] bg-white overflow-hidden shadow-md">
            <Link to={`/animal/${item.id}`} className="block hover:opacity-90 transition">
  <div className="relative">
    <img
      src={`https://cyrvizynjvgblsmyntmc.supabase.co/storage/v1/object/public/photos/${item.img}`}
      alt={item.name}
      className="w-full h-[231px] object-cover rounded-[16px]"
    />


{/* Conteneur des badges recherche FA et covoit */}
<div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
  {item.rechercheFa && (
    <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-xl shadow text-center">
      Recherche FA
    </span>
  )}
  {item.rechercheCovoit && (
    <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-xl shadow">
      Recherche covoiturage
    </span>
  )}
</div>
    
  

  </div>
            <div className='px-6 py-2 flex flex-col gap-2' >
          
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
  <div className="flex flex-wrap gap-2 mt-2">
  {optionsStatutBesoin.map(({ label, key }) =>
    item[key.trim()] ? (
      <span
        key={key}
        className="border border-gray-400 text-gray-700 text-xs font-medium px-2 py-1 rounded-[5px]"
      >
        {label}
      </span>
    ) : null
  )}
</div>
</div>
      
            </div>
             </Link>
            </li> 
           
        ))}
      </ul>
      
      
        {/* Bouton flottant Ajouter (mobile only) */}
<Link
  to="/ajouter-animal"
  className="md:hidden fixed bottom-6 right-6 z-50 bg-primaryYellow text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition"
  aria-label="Ajouter un animal"
>
  <span className="text-3xl font-bold">+</span>
</Link>
     
    </div>
  );
}

export default ListeAnimals;