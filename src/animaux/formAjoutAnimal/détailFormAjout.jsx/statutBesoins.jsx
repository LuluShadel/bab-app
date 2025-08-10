import { useSelector, useDispatch } from "react-redux";
import { setStepData } from "../../../store/wizardSlice";
import { StyledCheckbox, StyledRadio } from "../../../components/styleInput";

export default function StatutBesoins() {
  const { suivi, sterilise, categorie, statut } = useSelector((state) => state.wizard.statutBesoins);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(
      setStepData({
        step: "statutBesoins",
        data: { [field]: value === "inconnu" ? null : value },
      })
    );
  };

  const statutBesoins = useSelector((state) => state.wizard.statutBesoins);

  return (
    <div className="flex flex-col md:flex-row md:gap-12">
      {/* Colonne gauche */}
      <div className="flex-1 space-y-4">

         {/* Modérateur */}
      <div>
        <label className="block text-sm font-bold mb-1">Modérateur référent</label>
        <input
          type="text"
          value={suivi}
          onChange={(e) => handleChange("suivi", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

        {/* Stérilisé */}
        <div>
          <label className="block text-sm font-bold">Stérilisé</label>
          <div className="flex gap-4 mt-2">
            {["oui", "non", "inconnu"].map((option) => (
              <StyledRadio
                key={option}
                label={option}
                name="sterilise"
                value={option}
                checked={sterilise === (option === "inconnu" ? null : option)}
                onChange={(e) => handleChange("sterilise", e.target.value)}
              />
            ))}
          </div>
        </div>

        {/* Catégorisation */}
        <div>
          <label className="block text-sm font-bold mb-1">Catégorisation</label>
          <div className="flex gap-4 mt-2">
            {["oui", "non", "inconnu"].map((option) => (
              <StyledRadio
                key={option}
                label={option}
                name="categorie"
                value={option}
                checked={categorie === (option === "inconnu" ? null : option)}
                onChange={(e) => handleChange("categorie", e.target.value)}
              />
            ))}
          </div>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-bold mb-1">Statut</label>
          <div className="flex gap-4 mt-2">
            {[
              { label: "À l'adoption", key: "adoption" },
              { label: "Sous réquisition", key: "requisition" },
            ].map((option) => (
              <StyledRadio
                key={option.key}
                name="statut"
                label={option.label}
                value={option.key}
                checked={statut === option.key}
                onChange={() =>
                  dispatch(
                    setStepData({
                      step: "statutBesoins",
                      data: {
                        statut: option.key,
                        requisition: option.key === "requisition",
                        adoption: option.key === "adoption",
                      },
                    })
                  )
                }
              />
            ))}
          </div>
          {/* Options supplémentaires (checkboxes individuelles en booléen) */}
<div className="mt-8 space-y-4">
  {[
    { label: "Recherche de FA", key: "rechercheFa" },
    { label: "Recherche de covoiturage", key: "rechercheCovoit" },
    { label: "Panier retraite", key: "panierRetraite" },
    { label: "Parrainé", key: "parrainage" },
  ].map((opt) => (
    <StyledCheckbox
      key={opt.key}
      label={opt.label}
      checked={!!statutBesoins[opt.key]} // ← fallback en cas de undefined
      onChange={() =>
        dispatch(
          setStepData({
            step: "statutBesoins",
            data: {
              [opt.key]: !statutBesoins[opt.key],
            },
          })
        )
      }
    />
  ))}
</div>
        </div>


      </div>

      {/* Colonne droite */}
      <div className="flex-1 space-y-6">
        {/* Tu pourras ajouter tes champs ici */}
      </div>
    </div>
  );
}

