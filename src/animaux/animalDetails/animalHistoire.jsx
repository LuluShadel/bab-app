export default function AnimalHistoire({ animal }) {
  return (
    <div className="bg-white md:mt-12 p-6  text-sm text-gray-800 space-y-6">
      {/* Histoire */}
      <div>
        <h2 className="text-lg font-bold text-primaryBlue mb-2">Mon histoire</h2>
        <p>{animal.histoire}</p>
      </div>

      {/* Besoins */}
      <div>
        <h2 className="text-lg font-bold text-primaryBlue mb-2">Mes besoins</h2>
        <p>{animal.besoin}</p>
      </div>

      {/* Ententes */}
      <div>
        <h2 className="text-lg font-bold text-primaryBlue mb-2">Mes ententes</h2>
        <p>{animal.ententes}</p>
      </div>
    </div>
  );
}
