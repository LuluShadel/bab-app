import { useSelector, useDispatch } from "react-redux";
import { setStepData } from "../../../store/wizardSlice";
import { useState } from "react";

// import components 
import PhotoUpload from "../../../components/photoDocUpload";

// import svg 
import { ReactComponent as File } from '../../../svg/File.svg'


export default function Documents () {

    //pour le toggle famille
     const [situation, setSituation] = useState("famille");

    const document = useSelector((state) => state.wizard.document);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(
      setStepData({
        step: "document",
        data: { [field]: value === "inconnu" ? null : value },
      })
    );
  };


    return(
         <div className="flex flex-col md:flex-row md:gap-12">
      {/* Colonne gauche */}
      <div className="flex-1 space-y-6">

{/* toggle situation */}
<div className="flex flex-col">
  <label className="mb-2 font-semibold">Situation</label>

  {/* Conteneur pill */}
  <div className="inline-flex w-[20em] items-center rounded-full border border-gray-300 bg-white p-1 shadow-sm">
    <button
      type="button"
      onClick={() => {
        handleChange("enFamille", true);
        handleChange("pension", false);
        setSituation("famille");
      }}
      aria-pressed={situation === "famille"}
      className={`flex-1 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        situation === "famille"
          ? "bg-orange-400 "
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      En famille d'accueil
    </button>

    <button
      type="button"
      onClick={() => {
        handleChange("enFamille", false);
        handleChange("pension", true);
        setSituation("pension");
      }}
      aria-pressed={situation === "pension"}
      className={`flex-1 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        situation === "pension"
          ? "bg-orange-400 "
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      En pension
    </button>
  </div>
</div>
 {/* nom fa  */}
      <div>
        <label className="block text-sm font-bold mb-1">Famille d'accueil ou pension </label>
        <input
          type="text"
          value={document.nomFa}
          onChange={(e) => handleChange("nomFa", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

       {/* adresse  */}
      <div>
        <label className="block text-sm font-bold mb-1">Adresse  </label>
        <input
          type="text"
          value={document.adresse}
          onChange={(e) => handleChange("adresse", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* numero de tel */}
      <div>
        <label className="block text-sm font-bold mb-1">Numero de téléphone  </label>
        <input
          type="number"
          value={document.telephone}
          onChange={(e) => handleChange("telephone", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* mail */}
      <div>
        <label className="block text-sm font-bold mb-1">adresse mail  </label>
        <input
          type="text"
          value={document.mail}
          onChange={(e) => handleChange("mail", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
        </div>

        {/* Colonne droite */}
       <div className="flex-1 space-y-6">

 {/* documents  */}
       
      <PhotoUpload
  step="document"
  field="document"
  title="Ajouter des documents liés à l'animal"
  Icon={File}
/>

       </div>
        </div>
    )
}