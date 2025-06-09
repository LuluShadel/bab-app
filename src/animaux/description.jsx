

const DescriptionAnimal = ({ animal }) => {
  return (
    <div className="p-4 space-y-6">
      {/* Infos principales */}
      <div>
        <h2 className="text-xl font-bold mb-2">Infos de l'animal</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>Date de naissance :</strong> {animal.ddn || 'Non renseignée'}</li>
          <li>
  <strong>Stérilisation :</strong>{' '}
  {animal.sterilisation ? (
    <span className="text-green-600 font-semibold">Fait</span>
  ) : (
    <span className="text-red-600 font-semibold">À faire</span>
  )}
</li>
          <li><strong>Catégorisation :</strong> {animal.categorisation || 'Non renseignée'}</li>
          <li><strong>Dernier vermifuge :</strong> {animal.vermifuge || 'Non renseignée'}</li>
          <li><strong>Dernier vaccin :</strong> {animal.vaccin || 'Non renseignée'}</li>
          
        </ul>
      </div>

      {/* Description */}
      <div className="border rounded-xl p-4 bg-gray-50 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Description de l'animal</h3>
        <p className="text-gray-800">
          {animal.description || 'Aucune description fournie.'}
        </p>
      </div>

       {/* besoins */}
      <div className="border rounded-xl p-4 bg-gray-50 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Besoins de l'animal</h3>
        <p className="text-gray-800">
          {animal.besoin || 'Aucune description fournie.'}
        </p>
      </div>

      {/* Ententes */}
      <div className="border rounded-xl p-4 bg-gray-50 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Ententes</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>OK chien : {animal.okChien ? 'Oui' : 'Non'}</li>
          <li>OK chat : {animal.okChat ? 'Oui' : 'Non'}</li>
          <li>OK enfant : {animal.okChild ? 'Oui' : 'Non'}</li>
        </ul>
      </div>
    </div>
  );
};

export default DescriptionAnimal;