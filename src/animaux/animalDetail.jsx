import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { FaCat, FaChild, FaDog } from 'react-icons/fa';

function AnimalDetails() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null); // affiche l'animal cliqué 
  const [showConfirmSupp, setShowConfirmSupp] = useState(false); // modal pour confirmer la suppression
  const [showEditModal, setShowEditModal] = useState(false); // modal pour éditer la fiche
const [editedAnimal, setEditedAnimal] = useState({}); // modifs faite sur le fiche 
const navigate = useNavigate();



// afficher les données de l'animal 
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

  // Suppression de la fiche 
  const handleDelete = async () => {
  const { error } = await supabase
    .from('animaux')
    .delete()
    .eq('id', id);

  if (!error) {
    navigate('/'); // Redirige après suppression 
  } else {
    console.error('Erreur lors de la suppression :', error);
  }
};

// Edition de la fiche 
const openEditModal = () => {
  setEditedAnimal(animal); // Préremplir avec les infos existantes
  setShowEditModal(true);
};

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
     <div>{animal.adoption && (
        <span className='bg-green-600 rounded-xl p-1 mr-2'>A l'adoption</span>
      )}
      {animal.rechercheFa && (
        <span className='bg-pink-400 rounded-xl p-1 mr-2'>Recherche FA</span>
      )}
      {animal.panierRetraite && (
        <span className='bg-gray-400 text-white rounded-xl p-1 mr-2'>Panier retraite</span>
      )}
      {animal.requisition && (
        <span className='bg-red-400 text-white rounded-xl p-1 mr-2'>Sous requisition</span>
      )}
      
      </div>
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
        <li onClick={openEditModal} className="cursor-pointer text-blue-600">
  Éditer fiche
</li>
       <li 
  className='text-italic text-red-500 cursor-pointer'
  onClick={() => setShowConfirmSupp(true)}
>
  Supprimer la fiche
</li>
        <li>Ajouter un rendez vous</li>
      </ul>
    </div>
    {showConfirmSupp && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-[400px] text-center">
      <h2 className="text-xl font-bold mb-4">Confirmation</h2>
      <p className="mb-6">Êtes-vous sûre de vouloir supprimer <strong>{animal.name}</strong> définitivement ?</p>
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setShowConfirmSupp(false)} 
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Annuler
        </button>
        <button 
          onClick={handleDelete} 
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
)}

{showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-[500px]">
      <h2 className="text-xl font-bold mb-4 text-center">Modifier {animal.name}</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await supabase
            .from('animaux')
            .update(editedAnimal)
            .eq('id', id);

          if (!error) {
            setShowEditModal(false);
            setAnimal(editedAnimal); // Mise à jour visuelle immédiate
          } else {
            alert("Erreur lors de la mise à jour : " + error.message);
          }
        }}
        className="space-y-4"
      >
        <div>
          <label className="block font-semibold">Nom :</label>
          <input
            type="text"
            value={editedAnimal.name || ''}
            onChange={(e) =>
              setEditedAnimal({ ...editedAnimal, name: e.target.value })
            }
            className="border w-full px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Race :</label>
          <input
            type="text"
            value={editedAnimal.race || ''}
            onChange={(e) =>
              setEditedAnimal({ ...editedAnimal, race: e.target.value })
            }
            className="border w-full px-2 py-1 rounded"
          />
        </div>
          <div>
          <label className="block font-semibold">Type :</label>
          <input
            type="text"
            value={editedAnimal.type || ''}
            onChange={(e) =>
              setEditedAnimal({ ...editedAnimal, type: e.target.value })
            }
            className="border w-full px-2 py-1 rounded"
          />
        </div>
          <div>
          <label className="block font-semibold">Sexe :</label>
          <input
            type="text"
            value={editedAnimal.sexe || ''}
            onChange={(e) =>
              setEditedAnimal({ ...editedAnimal, sexe: e.target.value })
            }
            className="border w-full px-2 py-1 rounded"
          />
        </div>
          <div>
          <label className="block font-semibold">Département :</label>
          <input
            type="text"
            value={editedAnimal.dpt || ''}
            onChange={(e) =>
              setEditedAnimal({ ...editedAnimal, dpt: e.target.value })
            }
            className="border w-full px-2 py-1 rounded"
          />
        </div>
          <div>
          <label className="block font-semibold">Lieu :</label>
          <input
            type="text"
            value={editedAnimal.lieu || ''}
            onChange={(e) =>
              setEditedAnimal({ ...editedAnimal, lieu: e.target.value })
            }
            className="border w-full px-2 py-1 rounded"
          />
        </div>
        <div className="flex flex-row gap-2">
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={!!editedAnimal.okChien}
      onChange={(e) =>
        setEditedAnimal({ ...editedAnimal, okChien: e.target.checked })
      }
      className="mr-2"
    />
    OK Chien
  </label>

  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={!!editedAnimal.okChat}
      onChange={(e) =>
        setEditedAnimal({ ...editedAnimal, okChat: e.target.checked })
      }
      className="mr-2"
    />
    OK Chat
  </label>

  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={!!editedAnimal.okChild}
      onChange={(e) =>
        setEditedAnimal({ ...editedAnimal, okChild: e.target.checked })
      }
      className="mr-2"
    />
    OK Enfant
  </label>
</div>
<div className="flex flex-row gap-2">
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={!!editedAnimal.adoption}
      onChange={(e) =>
        setEditedAnimal({ ...editedAnimal, adoption: e.target.checked })
      }
      className="mr-2"
    />
    A l'adoption
  </label>

  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={!!editedAnimal.rechercheFa}
      onChange={(e) =>
        setEditedAnimal({ ...editedAnimal, rechercheFa: e.target.checked })
      }
      className="mr-2"
    />
    En recherche FA
  </label>
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={!!editedAnimal.panierRetraite}
      onChange={(e) =>
        setEditedAnimal({ ...editedAnimal, panierRetraite: e.target.checked })
      }
      className="mr-2"
    />
    Panier retraite
  </label>
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      checked={!!editedAnimal.requisition}
      onChange={(e) =>
        setEditedAnimal({ ...editedAnimal, requisition: e.target.checked })
      }
      className="mr-2"
    />
    Sous requisition
  </label>
</div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
)}

  </div>
);
}

export default AnimalDetails;