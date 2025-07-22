import { useState, useEffect, useCallback } from "react";
import supabase from "../../supabaseClient";
import { FiTrash2, FiPlus } from "react-icons/fi";

export default function AnimalHistorique({ animal }) {
  const animalId = animal.id;
  const [historiques, setHistoriques] = useState([]);
  const [nouvelTexte, setNouvelTexte] = useState("");
  const [nouvelleDate, setNouvelleDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedHistorique, setSelectedHistorique] = useState(null);

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

  const handleAdd = async () => {
    if (!nouvelTexte || !nouvelleDate) return;

    const { error } = await supabase.from("historique").insert([
      {
        animal_id: animalId,
        texte: nouvelTexte,
        date: nouvelleDate,
      },
    ]);

    if (!error) {
      setNouvelTexte("");
      setNouvelleDate("");
      fetchHistoriques();
    }
  };

  const handleDelete = async () => {
    if (!selectedHistorique) return;
    const { error } = await supabase
      .from("historique")
      .delete()
      .eq("id", selectedHistorique.id);

    if (!error) {
      setShowModal(false);
      setSelectedHistorique(null);
      fetchHistoriques();
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR");
  };

  return (
    <div className="bg-white mt-12 p-6 overflow-auto max-h-[60vh] relative">
      {/* Ajout historique */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <div className="text-sm font-semibold text-primaryBlue px-2">
          Ajouter un historique
        </div>
        <div className="flex items-center gap-2 text-sm">
          <input
            type="date"
            value={nouvelleDate}
            onChange={(e) => setNouvelleDate(e.target.value)}
            className="border-2 border-primaryYellow rounded-full px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Texte"
            value={nouvelTexte}
            onChange={(e) => setNouvelTexte(e.target.value)}
            className="border-2 border-primaryYellow rounded-full px-4 py-2 text-sm"
          />
          <button
            onClick={handleAdd}
            className="bg-primaryYellow text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow"
          >
            Ajouter <FiPlus />
          </button>
        </div>
      </div>

      {/* Liste des historiques */}
      <ul className="space-y-3">
        {historiques.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b pb-2 text-sm text-primaryBlue"
          >
            <div className="flex gap-12 px-2 overflow-hidden whitespace-nowrap text-ellipsis w-full">
              <span className="min-w-[80px]">{formatDate(item.date)}</span>
              <span className="truncate">{item.texte}</span>
            </div>
            <button
              onClick={() => {
                setSelectedHistorique(item);
                setShowModal(true);
              }}
              className="text-red-600 hover:text-red-800"
              title="Supprimer"
            >
              <FiTrash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      {/* Modale confirmation suppression */}
      {showModal && selectedHistorique && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-sm">
            <h3 className="font-semibold text-lg text-red-700 mb-4">
              Attention !
            </h3>
            <p className="mb-4">
              Vous allez supprimer l’historique suivant :
              <br />
              <span className="font-medium text-gray-800">
                « {selectedHistorique.texte} »
              </span>
              <br />
              Souhaitez-vous continuer ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 rounded-full border text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
