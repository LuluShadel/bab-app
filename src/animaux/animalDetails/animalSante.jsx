export default function AnimalSante({ animal }) {

// convertir booléan en text
  const boolToText = (val) =>
    val === true ? 'Oui' : val === false ? 'Non' : 'Inconnu';

  // mettre la date en fr
  const formatDateFr = (date) => {  
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR');
};

  const infos = [
    { label: 'Santé fragile', value: boolToText(animal.santeFragile) },
    { label: 'Stérilisé', value: boolToText( animal.sterilisation) },
    { label: 'Allergie/ Traitement', value: animal.traitement },
    { label: 'Poids', value: animal.poids ? `${animal.poids} kg` : 'XX kg' },
  { label: 'Date dernier APE', value: formatDateFr(animal.vermifuge) },
  { label: 'Date dernier vaccin', value: formatDateFr(animal.vaccin) },
  { label: 'Date dernière visite véto', value: formatDateFr(animal.dateVisiteVeto) },
    { label: 'Antécédents médicaux', value:animal.antecedentMedicaux },
   
  ];

  return (
    <div className="bg-white md:mt-12 overflow-hidden">
      <ul className="divide-y divide-blue-100 text-sm">
        {infos.map(({ label, value }) => (
          <li key={label} className="grid grid-cols-[250px_1fr] px-6 py-3">
            <span className="text-primaryBlue font-semibold">{label} :</span>
            <span >{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

