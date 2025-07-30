export default function AnimalProfil({ animal }) {

    // convertir booléa en text
  const boolToText = (val) =>
    val === true ? 'Oui' : val === false ? 'Non' : 'Inconnu';

    // mettre la date en fr
  const formatDateFr = (date) => {  
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR');
};

  const infos = [
    { label: 'Type', value: animal.type },
    { label: 'Race', value: animal.race },
    { label: 'Genre', value: animal.sexe },
    { label: 'Date de naissance', value: formatDateFr(animal.ddn) },
    { label: 'N° Icad', value: animal.icad },
    { label: 'Stérilisé', value: boolToText(animal.sterilisation) },
    { label: 'Catégorisé', value: animal.categorisation },
    { label: 'Sous réquisition', value: boolToText(animal.requisition) },
   { label: 'Poids', value: animal.poids ? `${animal.poids} kg` : 'XX kg' },
  ];

  return (
    <div className="bg-white md:mt-12 overflow-hidden">
      <ul className="divide-y divide-blue-100 text-sm">
        {infos.map(({ label, value }) => (
          <li key={label} className="grid grid-cols-[150px_1fr] md:grid-cols-[250px_1fr] px-6 py-3">
            <span className="text-blue-900 font-semibold">{label} :</span>
            <span className="text-gray-800">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
