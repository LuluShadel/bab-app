import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from './supabaseClient';

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
    <div className="p-4">
      <h1 className="text-xl font-bold">{animal.name}</h1>
      <img src={animal.img} alt={animal.name} className="w-40 h-40 rounded-xl" />
      <p><strong>Age :</strong> {animal.age} ans</p>
      <p><strong>Type :</strong> {animal.type}</p>
      <p><strong>Race :</strong> {animal.race}</p>
      <p><strong>ICAD :</strong> {animal.icad}</p>
      {animal.adoption && <p><strong>Statut :</strong> {animal.adoption}</p>}
      {animal.rechercheFa && <p><strong>Recherche FA :</strong> {animal.rechercheFa}</p>}
    </div>
  );
}

export default AnimalDetails;