import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { Link } from 'react-router-dom';
import AnimalForm from './animalForm';

function ListeAnimals() {

  const [animaux, setAnimaux] = useState([]);   // animaux = liste des animaux 
   const [showForm, setShowForm] = useState(false); // gère la modal

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

  


  return (
    <div className='flex flex-col items-start mx-auto w-full max-w-4xl px-4 mt-12'>
      <h1 className='text-blue-600 font-bold mb-8 text-xl'>Liste des animaux</h1>
      <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-12"
        >
          Ajouter un nouvel animal
        </button>
      <ul>
        {animaux.map((item) => (
          <li key={item.id} className='border-t-4 border-blue-500 p-4 flex flex-row items-center'>
            <img src={item.img} alt={item.name} className='w-20 h-20 object-cover rounded-full shadow-md' />
            <div className='ml-4' >
            <div className='flex flex-row gap-6'>
            <div>{item.name} {item.ddn}- {item.adoption && (
        <span className='bg-green-600 rounded-xl p-1 mr-2'>A l'adoption</span>
      )}
      {item.rechercheFa && (
        <span className='bg-pink-400 rounded-xl p-1'>Recherche FA</span>
      )}</div>
            </div>
             <div className='flex flex-row gap-3'>
      <p> <span className='font-bold'>Icad :</span> {item.icad}</p>
      <p><span className='font-bold'>Type :</span> {item.type}</p>
      <p><span className='font-bold'>Race :</span>  {item.race}</p>
             </div>
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