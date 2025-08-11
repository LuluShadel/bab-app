import { useSelector, useDispatch } from "react-redux";
import { setStepData } from "../../../store/wizardSlice";
import { StyledCheckbox, StyledRadio } from "../../../components/styleInput";




export default function Sante() {

    const sante = useSelector((state) => state.wizard.sante);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(
      setStepData({
        step: "sante",
        data: { [field]: value === "inconnu" ? null : value },
      })
    );
  };

    return(
        <div className="flex flex-col md:flex-row md:gap-12">
      {/* Colonne gauche */}
      <div className="flex-1 space-y-6">

         {/* vétérinaire  */}
      <div>
        <label className="block text-sm font-bold mb-1">Vétérinaire</label>
        <input
          type="text"
          value={sante.veto}
          onChange={(e) => handleChange("veto", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

       {/* poids */}
      <div>
        <label className="block text-sm font-bold mb-1">Poids</label>
        <input
          type="number"
          value={sante.poids}
          onChange={(e) => handleChange("poids", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

       {/* Antécédents médicaux  */}
      <div>
        <label className="block text-sm font-bold mb-1">Antécédents médicaux</label>
        <textarea
  value={sante.antecedentMedicaux}
  onChange={(e) => handleChange("antecedentMedicaux", e.target.value)}
  placeholder="Complétez le champ"
  className="border border-gray-300 rounded-md px-3 py-2 w-full"
  rows={10} 
/>
      </div>

       </div>

       {/* Colonne droite */}
       <div className="flex-1 space-y-6">

         {/* date dernier veto   */}
      <div>
        <label className="block text-sm font-bold mb-1">Date de dernière visite vétérinaire</label>
        <input
          type="date"
          value={sante.derniereVisiteVeto}
          onChange={(e) => handleChange("derniereVisiteVeto", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

 {/* date prochain APE/API   */}
      <div>
        <label className="block text-sm font-bold mb-1">Date de prochain APE/API</label>
        <input
          type="date"
          value={sante.vermifuge}
          onChange={(e) => handleChange("vermifuge", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

       {/* date prochain vaccin  */}
      <div>
        <label className="block text-sm font-bold mb-1">Date de prochain vaccin</label>
        <input
          type="date"
          value={sante.vaccin}
          onChange={(e) => handleChange("vaccin", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* Traitements médicaux   */}
      <div>
        <label className="block text-sm font-bold mb-1">Allergies / Traitements médicaux</label>
        <textarea
  value={sante.traitement}
  onChange={(e) => handleChange("traitement", e.target.value)}
  placeholder="Complétez le champ"
  className="border border-gray-300 rounded-md px-3 py-2 w-full"
  rows={6} 
/>
      </div>

       </div>
        </div>

    )
}