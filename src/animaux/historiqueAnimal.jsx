import { useEffect, useState, useCallback } from "react";
import supabase from "../supabaseClient";

function HistoriqueAnimal({ animal }) {
  const animalId = animal.id;
  const [historique, setHistorique] = useState([]);
  const [texte, setTexte] = useState("");
  const [date, setDate] = useState("");
  const [role, setRole] = useState(null);

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("fr-FR");

  const fetchHistorique = useCallback(async () => {
    const { data, error } = await supabase
      .from("historique")
      .select("*")
      .eq("animal_id", animalId)
      .order("date", { ascending: false });

    if (!error) setHistorique(data);
    else console.error("Erreur récupération historique :", error);
  }, [animalId]);

  const fetchRole = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("roles")
        .eq("id", user.id)
        .single();

      if (!error && data) setRole(data.roles);
    }
  }, []);

  useEffect(() => {
    fetchHistorique();
    fetchRole();
  }, [fetchHistorique, fetchRole]);

  const ajouterEntree = async () => {
    if (!texte || !date) return;

    const { error } = await supabase.from("historique").insert([
      {
        animal_id: animalId,
        texte,
        date: new Date(date).toISOString(),
      },
    ]);

    if (!error) {
      setTexte("");
      setDate("");
      fetchHistorique();
    } else {
      console.error("Erreur insertion :", error);
    }
  };

  return (
    <section className="bg-white shadow-md rounded-xl p-4 md:p-6 border mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Historique de l'animal</h2>

      <ul className="space-y-4 mb-6">
        {historique.map((event) => (
          <li
            key={event.id}
            className="border-l-4 border-blue-600 pl-4 py-2 bg-gray-50 rounded"
          >
            <p className="text-sm text-gray-500 font-semibold">
              {formatDate(event.date)}
            </p>
            <p className="text-gray-800 whitespace-pre-wrap">{event.texte}</p>
          </li>
        ))}
      </ul>

      {role === "modo" && (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-auto"
          />
          <input
            type="text"
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            placeholder="Texte de l'événement"
            className="border px-2 py-1 rounded w-full md:flex-1"
          />
          <button
            onClick={ajouterEntree}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Ajouter
          </button>
        </div>
      )}
    </section>
  );
}

export default HistoriqueAnimal;
