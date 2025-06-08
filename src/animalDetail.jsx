import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from './supabaseClient';
import { FaCat, FaChild, FaDog } from 'react-icons/fa';

function AnimalDetails() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    async function fetchAnimal() {
      const { data, error } = await supabase
        .from('animaux')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setAnimal(data);
    }

    fetchAnimal();
  }, [id]);

  if (!animal) return <p>Chargement...</p>;

  return (
  <div className="p-[5em] flex flex-row items-center justify-center gap-[8em] bg-blue-200">
    <div className='bg-blue-100 rounded-b-xl'>
      <img src={animal.img} alt={animal.name} className="w-40 h-40 rounded-t-xl  " />
      
      <div className="mt-2 mb-2 flex justify-center gap-4 w-40 ">
        {animal.okChien ? (
          <FaDog className="text-green-500 text-2xl" />
        ) : (
          <FaDog className="text-red-500 text-2xl" />
        )}
        {animal.okChat ? (
          <FaCat className="text-green-500 text-2xl" />
        ) : (
          <FaCat className="text-red-500 text-2xl" />
        )}
        {animal.okChild ? (
          <FaChild className="text-green-500 text-2xl" />
        ) : (
          <FaChild className="text-red-500 text-2xl" />
        )}
      </div>
      <div>
        </div>
        </div>
        <div>
    <h1 className='text-center font-bold text-[2em] mb-6'>{animal.name}</h1>
    <ul className='flex flex-row gap-12'>
      <div>
      <li><span className='font-bold'>Sexe :</span> {animal.sexe}</li>
       <li><span className='font-bold'>Type :</span> {animal.type}</li>
       <li><span className='font-bold'>Race :</span> {animal.race}</li>
       </div>
       <div>
        <li><span className='font-bold'>Date de naissance :</span> {animal.ddn}</li>
      <li><span className='font-bold'> Lieu :</span> {animal.lieu}</li>
       <li><span className='font-bold'>Departement :</span> {animal.dpt}</li>
       </div>
    </ul>
    </div>
    <div>
      <ul>
        <li>Editer fiche</li>
        <li>Ajouter un rendez vous</li>
      </ul>
    </div>
  </div>
);
}

export default AnimalDetails;