import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
  import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function VetoAnimaux({ animal }) {
    const animalId = animal.id
  const [pesees, setPesees] = useState([]);


  // faire le graphique 

function CourbePoids({ data }) {
  // Fonction utilitaire pour format JJ/MM/AAAA
  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('fr-FR'); // => "10/06/2025"
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
          />
          <YAxis label={{ value: 'Kg', angle: -90, position: 'insideLeft' }} />
          <Tooltip labelFormatter={formatDate} />
          <Line type="monotone" dataKey="poids" stroke="#ef476f" activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

  // recuperer les poids 
  const fetchPesees = async () => {
    const { data, error } = await supabase
      .from('pesees')
      .select('*')
      .eq('animal_id', animalId)
      .order('date', { ascending: true });

    if (!error) {
      setPesees(data);
    }
  };

  useEffect(() => {
    fetchPesees();
  }, [animalId]);


  // ajouter pesée 
  function AjouterPesee({ animalId, onAjout }) {
  const [poids, setPoids] = useState('');
  const [date, setDate] = useState('');

  const ajouter = async () => {
    if (!poids || !date) return; // sécurité : éviter les champs vides

    const { error } = await supabase.from('pesees').insert([
      {
        animal_id: animalId,
        date: new Date(date).toISOString(), // transformation propre
        poids: parseFloat(poids),
      },
    ]);

    if (!error) {
      onAjout(); // Rafraîchir le graphique
      setPoids('');
      setDate('');
    } else {
      console.error("Erreur insertion pesée :", error);
    }
  };

  

  return (
    <div className="my-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <input
        type="number"
        value={poids}
        onChange={(e) => setPoids(e.target.value)}
        placeholder="Poids en kg"
        className="border px-2 py-1 rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <button
        onClick={ajouter}
        disabled={!poids || !date}
        className="bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
      >
        Ajouter une pesée
      </button>
    </div>
  );
}

// supprimer une pessée
  function ListePesees({ pesees, onDelete }) {
  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("fr-FR");

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Historique des pesées :</h3>
      <ul className="space-y-2">
        {pesees.map((pesee) => (
          <li
            key={pesee.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>
              {formatDate(pesee.date)} — {pesee.poids} kg
            </span>
            <button
              onClick={() => onDelete(pesee.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
const supprimerPesee = async (id) => {
  const { error } = await supabase.from("pesees").delete().eq("id", id);
  if (!error) {
    fetchPesees(); // rafraîchir la liste
  } else {
    console.error("Erreur lors de la suppression :", error);
  }
};

// vaccin 
function VaccinInfo({ dateDernierVaccin }) {
  if (!dateDernierVaccin) return null;

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("fr-FR");

  const dernierVaccin = new Date(dateDernierVaccin);
  const prochainVaccin = new Date(dernierVaccin);
  prochainVaccin.setFullYear(prochainVaccin.getFullYear() + 1);

  const today = new Date();
  const tempsRestant = (prochainVaccin - today) / (1000 * 60 * 60 * 24);

  const estBientot = tempsRestant <= 30 && tempsRestant > 0;
  const estDepasse = tempsRestant <= 0;

  return (
    <div className="mt-4 space-y-2">
      {estDepasse && (
        <p className="text-red-700 text-2xl font-extrabold">
          ⚠️ Attention : date de vaccin dépassée !
        </p>
      )}
      <p>
        <span className="font-semibold">Dernier vaccin :</span>{" "}
        {formatDate(dernierVaccin)}
      </p>
      <p
        className={
          estDepasse
            ? "text-red-700 font-bold"
            : estBientot
            ? "text-red-500 font-bold"
            : ""
        }
      >
        <span className="font-semibold">Prochain vaccin :</span>{" "}
        {formatDate(prochainVaccin)}
      </p>
    </div>
  );
}

// modif vaccin 
const updateVaccinDate = async (newDate) => {
  const { error } = await supabase
    .from('animaux')
    .update({ vaccin: newDate })
    .eq('id', animal.id);

  if (!error) {
    // Recharge les données de l’animal si besoin
    animal.vaccin = newDate; // mise à jour locale si tu n’as pas de re-fetch
  } else {
    console.error("Erreur lors de la mise à jour du vaccin :", error);
  }
};

function FormUpdateVaccin({ currentDate, onUpdate }) {
  const [newDate, setNewDate] = useState(currentDate ? currentDate.split("T")[0] : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDate) {
      onUpdate(newDate);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-12 flex items-center gap-2">
        <p>Mettre à jour la dernière date de vaccin :
      </p>
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Mettre à jour
      </button>
    </form>
  );
}

// vermifuge 
function VermifugeInfo({ dateDernierVermifuge }) {
  if (!dateDernierVermifuge) return null;

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("fr-FR");

  const dernierVermifuge = new Date(dateDernierVermifuge);
  const prochainVermifuge = new Date(dernierVermifuge);
  prochainVermifuge.setMonth(prochainVermifuge.getMonth() + 6);

  const today = new Date();
  const tempsRestant = (prochainVermifuge - today) / (1000 * 60 * 60 * 24);

  const estBientot = tempsRestant <= 30 && tempsRestant > 0;

  return (
    <div className="mt-4 space-y-2">
      <p>
        <span className="font-semibold">Dernier vermifuge :</span>{" "}
        {formatDate(dernierVermifuge)}
      </p>
      <p className={estBientot ? "text-red-500 font-bold" : ""}>
        <span className="font-semibold">Prochain vermifuge :</span>{" "}
        {formatDate(prochainVermifuge)}
      </p>
    </div>
  );
}

function FormUpdateVermifuge({ currentDate, onUpdate }) {
  const [newDate, setNewDate] = useState(currentDate ? currentDate.split("T")[0] : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDate) {
      onUpdate(newDate);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-12 flex items-center gap-2">
        <p>Mettre à jour la dernière prise de vermifuge :</p>
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Mettre à jour
      </button>
    </form>
  );
}

const updateVermifugeDate = async (newDate) => {
  const { error } = await supabase
    .from("animaux")
    .update({ vermifuge: newDate })
    .eq("id", animal.id);

  if (!error) {
    animal.vermifuge = newDate; // mise à jour locale
  } else {
    console.error("Erreur mise à jour vermifuge :", error);
  }
};

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Courbe de poids</h2>
      <VaccinInfo dateDernierVaccin={animal.vaccin} />
      <FormUpdateVaccin currentDate={animal.vaccin} onUpdate={updateVaccinDate} />
      <VermifugeInfo dateDernierVermifuge={animal.vermifuge} />
<FormUpdateVermifuge currentDate={animal.vermifuge} onUpdate={updateVermifugeDate} />
      <CourbePoids data={pesees} />
      <AjouterPesee animalId={animalId} onAjout={fetchPesees} />
      <ListePesees pesees={pesees} onDelete={supprimerPesee} />
    </div>
  );
}

export default VetoAnimaux