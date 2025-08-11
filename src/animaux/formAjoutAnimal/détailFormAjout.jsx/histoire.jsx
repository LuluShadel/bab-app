import { useSelector, useDispatch } from "react-redux";
import { setStepData } from "../../../store/wizardSlice";




export default function Histoire() {

     const histoire = useSelector((state) => state.wizard.histoire);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(
      setStepData({
        step: "histoire",
        data: { [field]: value === "inconnu" ? null : value },
      })
    );
  };

    return(
        <div className="flex flex-col md:flex-row md:gap-12">
      {/* Colonne gauche */}
      <div className="flex-1 space-y-6">

{/* histoire  */}
      <div>
        <label className="block text-sm font-bold mb-1">Son histoire</label>
        <textarea
  value={histoire.histoire}
  onChange={(e) => handleChange("histoire", e.target.value)}
  placeholder="Veuillez indiquer le passif de l’animal, par exemple “Avant d’être pris en charge par la Brigade Animale Bénévole, je vivais attaché, dans mes excréments, avec ma sœur. Aucun confort, aucune tendresse, juste la survie.Depuis, ma vie a changé… un peu. Je suis en sécurité, c’est vrai, mais je suis toujours en pension, sans foyer, sans repères. Et moi, j’ai besoin de plus que ça.Je suis un chien sensible, un peu perdu parfois, mais toujours prêt à faire confiance à nouveau."
  className="border border-gray-300 rounded-md px-3 py-2 w-full"
  rows={19} 
/>
      </div>
        </div>

{/* Colonne droite */}
       <div className="flex-1 space-y-6">

{/* besoins */}
      <div>
        <label className="block text-sm font-bold mb-1">Ses besoins</label>
        <textarea
  value={histoire.besoins}
  onChange={(e) => handleChange("besoins", e.target.value)}
  placeholder="Veuillez indiquer les besoins de l’animal, par exemple : “Je cherche une famille douce, présente, avec un cadre clair pour m’aider à me poser.Je supporte mal la solitude, alors j’aurais besoin de quelqu’un souvent là, ou prêt à m’aider à progresser doucement sur ce point.Je ne demande pas grand-chose : un environnement calme, des balades régulières, de la patience, de l’affection… et un vrai sentiment de sécurité.”"
  className="border border-gray-300 rounded-md px-3 py-2 w-full"
  rows={8} 
/>
      </div>

      {/* ententes */}
      <div>
        <label className="block text-sm font-bold mb-1">Ses ententes</label>
        <textarea
  value={histoire.ententes}
  onChange={(e) => handleChange("ententes", e.target.value)}
  placeholder="Veuillez indiquer les ententes de l’animal, par exemple : “Je suis très gentil avec les humains et j’aime la compagnie des enfants.Je m’entends bien avec les autres chiens à l’extérieur, mais je préfère être le seul chien à la maison pour le moment.En revanche, la cohabitation avec les chats n’est pas possible pour moi.””"
  className="border border-gray-300 rounded-md px-3 py-2 w-full"
  rows={8} 
/>
      </div>



               </div>


         </div>

    )
}