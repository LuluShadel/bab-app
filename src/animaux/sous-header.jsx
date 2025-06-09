import { useState } from "react";

function SousHeaderAnimal() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Sous-header onglets */}
      <div className="flex space-x-6 border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-2 font-semibold text-gray-600 transition-colors duration-300 ${
            activeTab === "description"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "hover:text-blue-500 hover:border-b-4 hover:border-blue-400"
          }`}
        >
          Infos de l'animal
        </button>
        <button
          onClick={() => setActiveTab("suiviVeto")}
          className={`pb-2 font-semibold text-gray-600 transition-colors duration-300 ${
            activeTab === "suiviVeto"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "hover:text-blue-500 hover:border-b-4 hover:border-blue-400"
          }`}
        >
          Suivi vétérinaire
        </button>
        <button
          onClick={() => setActiveTab("historique")}
          className={`pb-2 font-semibold text-gray-600 transition-colors duration-300 ${
            activeTab === "historique"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "hover:text-blue-500 hover:border-b-4 hover:border-blue-400"
          }`}
        >
          Historique
        </button>
      </div>

      {/* Contenu selon onglet actif */}
      <div className="p-4 border rounded shadow-sm bg-white">
        {activeTab === "description" && (
          <div>
            <h3 className="text-lg font-bold mb-2">Description de l'animal</h3>
            <p>module à venir</p>
          </div>
        )}
        {activeTab === "suiviVeto" && (
          <div>
            <h3 className="text-lg font-bold mb-2">Suivi vétérinaire</h3>
           <p>module à venir</p>
          </div>
        )}
        {activeTab === "historique" && (
          <div>
            <h3 className="text-lg font-bold mb-2">Historique</h3>
           <p>module à venir</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SousHeaderAnimal;
