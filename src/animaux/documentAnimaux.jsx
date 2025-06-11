import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

function DocumentsAnimaux({ animal }) {
  const animalId = animal.id;
  const [documents, setDocuments] = useState([]);
  const [fichier, setFichier] = useState(null);
  const [nom, setNom] = useState("");
  const [role, setRole] = useState(null); // ← ajouté

  // 🔐 Récupérer le rôle
  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("roles")
          .eq("id", user.id)
          .single();

        if (!error && data) setRole(data.roles);
      }
    };

    fetchRole();
  }, []);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("animal_id", animalId);

    if (!error) setDocuments(data);
    else console.error("Erreur documents :", error);
  };

  useEffect(() => {
    fetchDocuments();
  }, [animalId]);

  const handleUpload = async () => {
    if (!fichier || !nom) return;

    const filePath = `${animalId}/${Date.now()}_${fichier.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, fichier);

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
        nom,
      },
    ]);

    if (!insertError) {
      setFichier(null);
      setNom("");
      fetchDocuments();
    }
  };

  const handleDelete = async (docId) => {
    const { error } = await supabase.from("documents").delete().eq("id", docId);
    if (!error) fetchDocuments();
  };

  return (
    <section className="bg-white shadow-md rounded-xl p-4 md:p-6 border mt-6">


      <ul className="space-y-2 mb-4">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <a
              href={doc.doc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {doc.nom || "Document PDF"}
            </a>

            {/* ❌ Cacher le bouton supprimer pour les FA */}
            {role === "modo" && (
              <button
                onClick={() => handleDelete(doc.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* ❌ Cacher toute la section ajout pour les FA */}
      {role === "modo" && (
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Nom du document"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="border px-2 py-1 rounded w-full sm:w-auto"
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFichier(e.target.files[0])}
            className="border px-2 py-1 rounded w-full sm:w-auto"
          />
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Ajouter
          </button>
        </div>
      )}
    </section>
  );
}

export default DocumentsAnimaux;
