import { useEffect, useState, useCallback, useRef } from "react";
import supabase from "../../supabaseClient";
import { FiDownload, FiPlus, FiTrash2 } from "react-icons/fi";

export default function AnimalDoc({ animal }) {
  const animalId = animal.id;
  const [documents, setDocuments] = useState([]);
  const [, setFichier] = useState(null);
  const [nom, setNom] = useState("");
  const fileInputRef = useRef();

  const [modalOpen, setModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const fetchDocuments = useCallback(async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("animal_id", animalId)
      .order("created_at", { ascending: false });

    if (!error) setDocuments(data);
    else console.error("Erreur documents :", error);
  }, [animalId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR");
  };

  const handleUpload = async (fichierUpload, nomUpload) => {
    if (!fichierUpload || !nomUpload) return;

    const filePath = `${animalId}/${Date.now()}_${fichierUpload.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, fichierUpload);

    if (uploadError) {
      console.error("Erreur upload :", uploadError);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("documents").insert([
      {
        animal_id: animalId,
        doc: publicUrlData.publicUrl,
        nom: nomUpload,
      },
    ]);

    if (!insertError) {
      setFichier(null);
      setNom("");
      fetchDocuments();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const defaultName = file.name.replace(/\.pdf$/i, "");
      setFichier(file);
      setNom(defaultName);
      handleUpload(file, defaultName);
    }
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", docToDelete.id);

    if (!error) {
      fetchDocuments();
      setModalOpen(false);
      setDocToDelete(null);
    } else {
      console.error("Erreur suppression :", error);
    }
  };

  return (
    <div className="bg-white mt-12 p-6  overflow-auto max-h-[60vh]">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <div className="flex gap-12 text-sm font-semibold text-primaryBlue px-2">
          <span>Date</span>
          <span>Nom</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="hidden"
          />
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-primaryYellow text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow"
          >
            Ajouter un document <FiPlus />
          </button>
        </div>
      </div>

      <ul className="space-y-3">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex justify-between items-center border-b pb-2 text-sm text-primaryBlue"
          >
            <div className="flex gap-12 px-2 overflow-hidden whitespace-nowrap text-ellipsis w-full">
              <span className="min-w-[80px]">{formatDate(doc.created_at)}</span>
              <span className="truncate">{doc.nom}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={doc.doc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 hover:text-blue-600"
                title="Télécharger"
              >
                <FiDownload size={18} />
              </a>
              <button
                onClick={() => {
                  setDocToDelete(doc);
                  setModalOpen(true);
                }}
                className="text-red-500 hover:text-red-700"
                title="Supprimer"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modale de confirmation */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-2 text-red-600">Attention !</h2>
            <p className="mb-4">
              Vous allez supprimer le document "<span className="font-semibold">{docToDelete?.nom}</span>" définitivement.<br />
              Êtes-vous sûr de vouloir continuer ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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

