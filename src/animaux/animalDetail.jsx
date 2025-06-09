import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { FaCat, FaChild, FaDog } from 'react-icons/fa';
import SousHeaderAnimal from './sous-header';

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
  <div className="md:p-[8em] p-4 md:p-12 bg-blue-200">
  {/* Conteneur principal en colonne sur mobile, ligne sur ordi */}
  <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
    
    {/* IMAGE + icônes */}
    <div className="flex flex-col items-center">
      <div className='bg-blue-100 rounded-b-xl'>
        <img src={animal.img} alt={animal.name} className="md:w-60 md:h-60 w-40 h-40 rounded-t-xl" />
        <div className="mt-2 mb-2 flex justify-center items-center gap-4 md:w-60 w-40">
          <FaDog className={`text-2xl ${animal.okChien ? "text-green-500" : "text-red-500"}`} />
          <FaCat className={`text-2xl ${animal.okChat ? "text-green-500" : "text-red-500"}`} />
          <FaChild className={`text-2xl ${animal.okChild ? "text-green-500" : "text-red-500"}`} />
        </div>
      </div>
    </div>

    {/* INFOS principales */}
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <h1 className='font-bold text-2xl mb-4'>{animal.name}</h1>

      {/* Tags */}
      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
        {animal.adoption && (
          <span className='bg-green-600 text-white rounded-xl px-2 py-1 text-sm'>À l'adoption</span>
        )}
        {animal.rechercheFa && (
          <span className='bg-pink-400 text-white rounded-xl px-2 py-1 text-sm'>Recherche FA</span>
        )}
        {animal.panierRetraite && (
          <span className='bg-gray-500 text-white rounded-xl px-2 py-1 text-sm'>Panier retraite</span>
        )}
        {animal.requisition && (
          <span className='bg-red-500 text-white rounded-xl px-2 py-1 text-sm'>Sous réquisition</span>
        )}
      </div>

      {/* Liste infos */}
      <ul className="flex flex-col md:flex-row gap-8 text-sm">
        <div>
           <li className="border border-dotted border-blue-500 p-1"><strong>Suivi par :</strong> {animal.suivi}</li>
          <li><strong>Sexe :</strong> {animal.sexe}</li>
          <li><strong>Type :</strong> {animal.type}</li>
          <li><strong>Race :</strong> {animal.race}</li>
        </div>
        <div>
          <li><strong>Date de naissance :</strong> {animal.ddn}</li>
          <li><strong>Lieu :</strong> {animal.lieu}</li>
          <li><strong>Département :</strong> {animal.dpt}</li>
        </div>
      </ul>
    </div>

    {/* ACTIONS */}
    <div className="flex flex-col items-center md:items-end gap-4 mt-4 md:mt-0">
      <button onClick={openEditModal} className="text-blue-600 hover:underline">Éditer fiche</button>
      <button
        onClick={() => setShowConfirmSupp(true)}
        className="text-red-500 hover:underline italic"
      >
        Supprimer la fiche
      </button>
    </div>
  </div>

  {/* Sous-header */}
  <div className="w-full mt-8">
    <SousHeaderAnimal />
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
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
    <div className="bg-white rounded-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-6">

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
        <div>
          <label className="block font-semibold">Icad :</label>
          <input
            type="text"
            value={editedAnimal.icad || ''}
            onChange={(e) =>
              setEditedAnimal({ ...editedAnimal, icad: e.target.value })
            }
            className="border w-full px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Suivi par :</label>
          <input
            type="text"
            value={editedAnimal.suivi || ''}
            onChange={(e) =>
              setEditedAnimal({ ...editedAnimal, suivi: e.target.value })
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