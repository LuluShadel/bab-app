import { useSelector, useDispatch } from "react-redux";
import { setStepData } from "../../../store/wizardSlice"; 


// import svg 
import { ReactComponent as MaleIcon } from '../../../svg/Male.svg'
import { ReactComponent as FemelleIcon } from '../../../svg/Femelle.svg'
import { ReactComponent as CatIcon } from '../../../svg/Cat.svg'
import { ReactComponent as DogIcon } from '../../../svg/Dog.svg'
import { ReactComponent as NacIcon } from '../../../svg/NAC.svg'
import { ReactComponent as Image } from '../../../svg/Image.svg'

// import components 
import PhotoUpload from "../../../components/photoDocUpload";




export default function Identite() {
    // ici les champs stockés dans redux 
 const { prenom, espece, genre, ancienPrenom, icad,dateNaissance, race } = useSelector((state) => state.wizard.identite);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(setStepData({ step: "identite", data: { [field]: value } }));
  };

  return (
   <div className=" flex flex-col md:flex-row md:gap-12">
    {/* Colonne de gauche  */}
    <div className=" flex-1 space-y-6">
      {/* Prénom */}
      <div>
        <label className="block text-sm font-bold mb-1">Prénom</label>
        <input
          type="text"
          value={prenom}
          onChange={(e) => handleChange("prenom", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* Espèce */}
      <div>
        <p className="text-sm font-bold  mb-2">Choisissez l’espèce</p>
        <div className="flex gap-4">
          {["chien", "chat", "nac"].map((type) => (
            <button
              key={type}
              onClick={() => handleChange("espece", type)}
              className={`flex flex-col items-center gap-2 px-4 py-2 border rounded-md w-32
                ${espece === type ? "border-primaryYellow " : "border-gray-300"}`}
            >
            
              <span>
                {type === "chien" && <DogIcon className="w-7 h-7" />}
                {type === "chat" && <CatIcon className="w-7 h-7" />}
                {type === "nac" && <NacIcon className="w-7 h-7" />}
              </span>
              <span className="capitalize">{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div>
        <p className="text-sm font-bold mb-2">Choisissez le genre</p>
        <div className="flex gap-4">
          {["male", "femelle"].map((g) => (
            <button
              key={g}
              onClick={() => handleChange("genre", g)}
              className={`flex flex-col items-center gap-2 md:px-4 py-2 border rounded-md  w-32
                ${genre === g ? "border-primaryYellow" : "border-gray-300"}`}
            >
              
              <span >
                {g === "male" && <MaleIcon className="bg-[#0c5f98] text-white w-7 h-7 rounded-[5px]" /> }
                {g === "femelle" && <FemelleIcon className="bg-[#c11f63] text-white w-7 h-7 rounded-[5px]" />}
              </span>
              <span className="capitalize">{g}</span>
            </button>
          ))}
        </div>
      </div>

       {/* Photo */}
       
      <PhotoUpload
  step="identite"
  field="photo"
  title="Ajouter la photo de l'animal"
  Icon={Image}
/>


    </div>
    {/* Colonne de droite   */}
<div className="flex-1 space-y-6">
    {/* Ancien prenom   */}
    
    <div >
        <label className="block text-sm font-bold mt-4 md:mt-0 mb-1">Ancien prenom</label>
        <input
          type="text"
          value={ancienPrenom}
          onChange={(e) => handleChange("ancienPrenom", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      
      </div>

      {/* icad  */}
    
    <div >
        <label className="block text-sm font-bold mb-1">N°icad</label>
        <input
          type="text"
          value={icad}
          onChange={(e) => handleChange("icad", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      
      </div>

       {/* Date de niassance  */}
    
    <div>
  <label className="block text-sm font-bold mb-1">Date de naissance</label>
  <input
    type="date"
    value={dateNaissance || ""}
    onChange={(e) => handleChange("dateNaissance", e.target.value)}
    className="border border-gray-300 rounded-md px-3 py-2 w-full"
  />
</div>

       {/* Race  */}
    
    <div >
        <label className="block text-sm font-bold mb-1">Race</label>
        <input
          type="text"
          value={race}
          onChange={(e) => handleChange("race", e.target.value)}
          placeholder="Complétez le champ"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      
      </div>

      
    </div>
    </div>
  );
}