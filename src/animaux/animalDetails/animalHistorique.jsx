import { useState, useEffect, useCallback } from "react";
import supabase from "../../supabaseClient";
import { FiPlus } from "react-icons/fi";
import ConfirmationModal from "../../components/modalConfirm";

// import SVG
import { ReactComponent as Delete } from '../../svg/Delete.svg';

export default function AnimalHistorique({ animal }) {
  const animalId = animal.id;
  const [historiques, setHistoriques] = useState([]);

    const [showModal, setShowModal] = useState(false); // modal d'ajout 
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // modal pour delete
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");

const [selectedItems, setSelectedItems] = useState([]);

  const fetchHistoriques = useCallback(async () => {
    const { data, error } = await supabase
      .from("historique")
      .select("*")
      .eq("animal_id", animalId)
      .order("date", { ascending: false });

    if (!error) setHistoriques(data);
    else console.error("Erreur historique :", error);
  }, [animalId]);

  useEffect(() => {
    fetchHistoriques();
  }, [fetchHistoriques]);

const handleSave = async () => {
  if (!eventDate || !eventDescription) return;

  const { error } = await supabase
    .from("historique")
    .insert([
      {
        animal_id: animalId,
        date: eventDate,
        texte: eventDescription
      }
    ]);

  if (error) {
    console.error("❌ Erreur lors de l’ajout :", error);
  } else {
   
    // Nettoyage + fermeture
    setEventDate("");
    setEventDescription("");
    setShowModal(false);
    fetchHistoriques(); // refresh la liste
  }
};


// supprimer les données 
const handleDeleteSelected = async () => {
  if (selectedItems.length === 0) return;

  const { error } = await supabase
    .from("historique")
    .delete()
    .in("id", selectedItems);

  if (!error) {
    setSelectedItems([]);
    fetchHistoriques(); // recharge
  } else {
    console.error("Erreur suppression multiple :", error);
  }
};
 

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR");
  };

  return (
   <div className="bg-white mt-2 md:p-6 h-[40vh] md:h-[60vh] flex flex-col ">
    <ConfirmationModal
  isOpen={showDeleteConfirm}
  onCancel={() => setShowDeleteConfirm(false)}
  onConfirm={() => {
    handleDeleteSelected();
    setShowDeleteConfirm(false);
  }}
  confirmText="Supprimer"
  cancelText="Annuler"
>
  <h2 className="font-bold text-primaryBlue text-lg">
    Êtes-vous sûr de vouloir supprimer les éléments sélectionnés ?
  </h2>
</ConfirmationModal>



  {/* Barre d'action desktop */}
<div className={`mb-4 items-center justify-between  px-4 py-2 rounded-[10px]  transition  hidden md:flex
    ${selectedItems.length > 0 ? "bg-gray-100" : ""}`}>
  {/* À gauche : suppression visible uniquement si des éléments sont sélectionnés */}
  {selectedItems.length > 0 ? (
    <button
  onClick={() => setShowDeleteConfirm(true)}
  className="flex items-center gap-1 text-sm text-black font-medium hover:underline"
>
  Supprimer
  <Delete className="text-red-600" />
</button>


  ) : (
    <span className="text-sm text-gray-500">{/* Espace vide pour équilibrer */}</span>
  )}

  

  {/* À droite : bouton ajouter */}
  <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 bg-primaryYellow text-black font-medium text-sm px-4 py-2 rounded-full hover:bg-yellow-400 transition"
  >
    Ajouter un événement 
    <FiPlus />
  </button>
</div>


  {/* Liste scrollable */}
  <div className="overflow-auto flex-1 pr-1 scrollbar-custom">

    {/* Barre fixe mobile uniquement */}
{selectedItems.length > 0 && (
 <div className="absolute w-full  bottom-0 left-0 right-0 z-10   md:hidden bg-white rounded-t-xl px-4 py-3"
  style={{
    boxShadow: '1px -2px 11px -5px rgba(0,0,0,0.75)',
    WebkitBoxShadow: '1px -2px 11px -5px rgba(0,0,0,0.75)',
    MozBoxShadow: '1px -2px 11px -5px rgba(0,0,0,0.75)',
  }}>
    <div className="flex justify-between items-center gap-4">
    <button
      onClick={() => setShowDeleteConfirm(true)}
      className="flex flex-col items-center justify-center w-full bg-primaryYellow rounded-lg py-3"
    >
      <Delete className="w-4 h-4 text-black" />
      Supprimer
    </button>
    </div>
  </div>
)}
    <ul className="space-y-3">
      {/* En-tête */}
      <li className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-4 px-2 pb-1 text-sm text-gray-600 font-semibold ">
        <h2 className="text-primaryBlue">Date</h2>
        <h2 className="text-primaryBlue">Contenu</h2>
      </li>

      {/* Lignes */}
      {historiques.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        return (
         <li
  key={item.id}
  className="grid grid-cols-[24px_1fr] md:grid-cols-[120px_1fr] justify-center gap-4 border-t py-2 text-sm text-primaryBlue group"
>
  <label className="flex justify-center">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedItems((prev) => [...prev, item.id]);
        } else {
          setSelectedItems((prev) => prev.filter((id) => id !== item.id));
        }
      }}
      className="peer hidden"
    />
    <span
      className="relative w-5 h-5 border-2 border-primaryYellow rounded-md flex items-center justify-center
        before:content-[''] before:w-3 before:h-3
        before:rounded-sm before:bg-primaryYellow
        before:scale-0 peer-checked:before:scale-100
        transition-all duration-150

        md:opacity-0 peer-checked:opacity-100 md:group-hover:opacity-100"
    />
  </label>

  <div className="grid grid-cols-[120px_1fr] gap-4 overflow-hidden">
    <span>{formatDate(item.date)}</span>
    <span className="break-words">{item.texte}</span>
  </div>
</li>

        );
      })}
    </ul>
  </div>

  {/* Modal */}
  <ConfirmationModal
    isOpen={showModal}
    onCancel={() => setShowModal(false)}
    onConfirm={handleSave}
    confirmText="Enregistrer"
    cancelText="Annuler"
  >
    <h2 className="font-bold text-primaryBlue text-lg">Ajouter un événement</h2>

    <div className="text-left space-y-4">
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
          rows={4}
          placeholder="Décrivez l'événement"
        />
      </div>
    </div>
  </ConfirmationModal>

{/* Ajouter historique mobile only*/}
  <button 
  onClick={() => setShowModal(true)}
  className="md:hidden absolute bottom-6 right-6  bg-primaryYellow text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition"
  aria-label="Ajouter un animal"
>
  <span className="text-3xl font-bold">+</span>
  </button>
</div>

  );
}
