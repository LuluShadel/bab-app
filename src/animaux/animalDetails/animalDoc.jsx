import { useState, useEffect, useCallback, useRef } from "react";
import supabase from "../../supabaseClient";
import { FiPlus, FiDownload } from "react-icons/fi";
import ConfirmationModal from "../../components/modalConfirm";
import { ReactComponent as Delete } from "../../svg/Delete.svg";

export default function AnimalDoc({ animal }) {
  const animalId = animal.id;
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef();

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

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const safeFileName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const path = `${animalId}/${Date.now()}_${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, file);

    if (uploadError) {
      console.error("❌ Upload error :", uploadError);
      return;
    }

    const { data } = supabase.storage.from("documents").getPublicUrl(path);

    const { error: insertError } = await supabase.from("documents").insert([
      {
        animal_id: animalId,
        doc: data.publicUrl,
        nom: file.name,
        created_at: new Date().toISOString(),
      },
    ]);

    if (!insertError) {
      fetchDocuments();
    } else {
      console.error("❌ Insert error :", insertError);
    }
  };


  // pour supp
  const handleDeleteSelected = async () => {
    if (selectedDocs.length === 0) return;

    const { error } = await supabase
      .from("documents")
      .delete()
      .in("id", selectedDocs);

    if (!error) {
      setSelectedDocs([]);
      fetchDocuments();
    } else {
      console.error("Erreur suppression multiple :", error);
    }
  };


// pour telecharger 
  const downloadSelectedFiles = () => {
  const docsToDownload = documents.filter((doc) => selectedDocs.includes(doc.id));

  docsToDownload.forEach((doc, index) => {
    setTimeout(() => {
      window.open(doc.doc, "_blank");
    }, index * 300); // petit délai pour ne pas se faire bloquer par le navigateur
  });
};

  // mettre date en fr 
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR");
  };

  return (
    <div className="bg-white mt-2 p-6 relative h-[60vh] flex flex-col">
      <div
        className={`mb-4 flex items-center justify-between rounded-xl px-4 py-2 shadow-sm transition ${
          selectedDocs.length > 0 ? "bg-gray-100" : ""
        }`}
      >
        <div className="flex gap-4 items-center">
         {selectedDocs.length > 0 ? (
  <div className="flex items-center gap-4">
    <button
      onClick={() => setShowDeleteConfirm(true)}
      className="flex items-center gap-1 text-sm text-black font-medium hover:underline"
    >
      Supprimer
      <Delete className="text-red-600" />
    </button>

    <button
      onClick={downloadSelectedFiles}
      className="flex items-center gap-1 text-sm text-black font-medium hover:underline"
    >
      <FiDownload className="text-blue-600" />
      Télécharger
    </button>
  </div>
) : (
  <span className="text-sm text-gray-500">{/* espace vide */}</span>
)}
        </div>

        <button
          onClick={() => fileInputRef.current.click()}
          className="flex items-center gap-2 bg-primaryYellow text-black font-medium text-sm px-4 py-2 rounded-full hover:bg-yellow-400 transition"
        >
          Ajouter un document
          <FiPlus />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="overflow-auto flex-1 pr-1 scrollbar-custom">
        <ul className="space-y-3">
          <li className="grid grid-cols-[120px_1fr_auto] gap-4 px-2 pb-1 text-sm text-gray-600 font-semibold">
            <span className="text-primaryBlue">Date</span>
            <span className="text-primaryBlue">Fichier</span>
          </li>

          {documents.map((doc) => {
            const isSelected = selectedDocs.includes(doc.id);
            return (
              <li
                key={doc.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t py-2 text-sm text-primaryBlue group"
              >
                <div className="relative w-6">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocs((prev) => [...prev, doc.id]);
                      } else {
                        setSelectedDocs((prev) =>
                          prev.filter((id) => id !== doc.id)
                        );
                      }
                    }}
                    className={`transition-opacity duration-200 ${
                      isSelected
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 overflow-hidden">
                  <span>{formatDate(doc.created_at)}</span>
                  <span className="truncate">{doc.nom}</span>
                </div>
                <div className="flex justify-end gap-3 pr-2">
                  <a
                    href={doc.doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 hover:text-blue-600"
                    title="Télécharger"
                  >
                    <FiDownload size={18} />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

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
          Êtes-vous sûr de vouloir supprimer les documents sélectionnés ?
        </h2>
      </ConfirmationModal>
    </div>
  );
}
