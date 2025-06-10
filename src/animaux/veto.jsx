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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Courbe de poids</h2>
      <CourbePoids data={pesees} />
      <AjouterPesee animalId={animalId} onAjout={fetchPesees} />
    </div>
  );
}

export default VetoAnimaux