import { useSelector, useDispatch } from "react-redux";
import { setStepData } from "../../../store/wizardSlice";
import { StyledCheckbox, StyledRadio } from "../../../components/styleInput";

//import SVG
import { ReactComponent as CatIcon } from '../../../svg/Cat.svg'
import { ReactComponent as DogIcon } from '../../../svg/Dog.svg';
import { ReactComponent as ChildIcon } from '../../../svg/Child.svg';

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

  // togle ententes 
  const EntenteToggle = ({ type, emoji, value, onChange }) => {
  const options = [
    { value: true, label: "Oui", activeClass: "bg-[#247c4f] text-white", inactiveClass: "border-[#247c4f]" },
    { value: false, label: "Non", activeClass: "bg-[#cc300f] text-white", inactiveClass: "border-[#cc300f]" },
    { value: null, label: "Inconnu", activeClass: "bg-[#dc7c00] text-white", inactiveClass: "border-[#dc7c00]" },
  ];

  return (
    <div className="flex gap-2 items-center">
      {options.map(({ value: val, label, activeClass, inactiveClass }) => {
        const isActive = value === val;
        return (
          <button
            key={label}
            onClick={() => onChange(type, val)}
            className={`border px-3 py-1 rounded flex items-center gap-1 transition text-sm ${
              isActive ? activeClass : inactiveClass
            }`}
          >
            {emoji} {label}
          </button>
        );
      })}
    </div>
  );
};

const { okChat, okChien, okChild} = useSelector((state) => state.wizard.statutBesoins);

const handleEntenteChange = (key, val) => {
  dispatch(
    setStepData({
      step: "statutBesoins",
      data: { [key]: val },
    })
  );
};

  return (
    <div className="flex flex-col md:flex-row md:gap-12">
      {/* Colonne gauche */}
      <div className="flex-1 space-y-6">

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
          <label className="block text-sm font-bold mb-1">Catégorisé</label>
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

      {/* Ententes  */}
      <div className="flex-1 space-y-6 mt-6 md:mt-0">
        <div>
  <label className="block text-sm font-bold mb-2">Ententes</label>
  <div className="flex flex-col gap-4">
    <EntenteToggle type="okChien" emoji={<DogIcon />} value={okChien} onChange={handleEntenteChange} />
    <EntenteToggle type="okChat" emoji={<CatIcon />} value={okChat} onChange={handleEntenteChange} />
    <EntenteToggle type="okChild" emoji={<ChildIcon />} value={okChild} onChange={handleEntenteChange} />
  </div>
</div>
      </div>

{/* Besoins spé */}
<div>
 <label className="block text-sm font-bold mb-2">Besoins spécifiques</label>
      <div className=" space-y-4">
  {[
    { label: "Besoins d'un environnement calme", key: "endroitCalme" },
    { label: "Suivi médical", key: "santéFragile" },
    { label: "Jardin", key: "jardin" },
    { label: "Lieu sans escalier", key: "escalier" },
     { label: "Présence de congénères", key: "congenere" },
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


    </div>
  );
}

