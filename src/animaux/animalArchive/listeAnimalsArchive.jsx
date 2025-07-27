import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { Link } from 'react-router-dom';

// Import des SVG
import { ReactComponent as CatIcon } from '../../svg/Cat.svg';
import { ReactComponent as DogIcon } from '../../svg/Dog.svg';
import { ReactComponent as ChildIcon } from '../../svg/Child.svg';
import { ReactComponent as FemelleIcon } from '../../svg/Femelle.svg';
import { ReactComponent as MaleIcon } from '../../svg/Male.svg';

function ListeAnimalsArchive() {
  const [animaux, setAnimaux] = useState([]);

  useEffect(() => {
    async function fetchAnimaux() {
      const { data, error } = await supabase.from('animaux').select('*');
      if (error) {
        console.error('Erreur:', error);
      } else {
        setAnimaux(data);
      }
    }

    fetchAnimaux();
  }, []);

  // 👉 Filtrer uniquement les animaux archivés
  const animauxFiltres = animaux.filter((animal) => animal.archive === true);

  function calculerAge(ddn) {
    if (!ddn) return null;
    const naissance = new Date(ddn);
    if (isNaN(naissance)) return null;

    const aujourdHui = new Date();
    let age = aujourdHui.getFullYear() - naissance.getFullYear();
    const mois = aujourdHui.getMonth() - naissance.getMonth();
    if (mois < 0 || (mois === 0 && aujourdHui.getDate() < naissance.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <div className="flex flex-col items-start px-12 py-8 bg-bgBlue">
      <h1 className="text-2xl font-bold mb-4">Animaux archivés</h1>

      <ul className="flex flex-wrap gap-6">
        {animauxFiltres.map((item) => (
          <li key={item.id} className="w-[20em] h-[27em] rounded-[16px] bg-white overflow-hidden shadow-md">
            <Link to={`/animal/${item.id}`} className="block hover:opacity-90 transition">
              <div className="relative">
                <img
                  src={`https://cyrvizynjvgblsmyntmc.supabase.co/storage/v1/object/public/photos/${item.img}`}
                  alt={item.name}
                  className="w-full h-[231px] object-cover rounded-[16px]"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {item.rechercheFa && (
                    <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-xl shadow text-center">
                      Recherche FA
                    </span>
                  )}
                  {item.rechercheCovoit && (
                    <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-xl shadow">
                      Recherche covoiturage
                    </span>
                  )}
                </div>
              </div>

              <div className="px-6 py-2 flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  {item.sexe === 'Femelle' && <FemelleIcon className="text-white bg-pink-500 p-0.5 rounded shadow" />}
                  {item.sexe === 'Mâle' && <MaleIcon className="text-white bg-blue-500 p-0.5 rounded shadow" />}
                </div>

                <div className="flex gap-4 text-sm text-gray-700">
                  <p>{item.race}</p>
                  <p>{calculerAge(item.ddn)} ans</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {['okChien', 'okChat', 'okChild'].map((cle) => {
                    const valeur = item[cle];
                    const couleurs = {
                      true: 'bg-[#217a4b] text-white',
                      false: 'bg-[#ca3405] text-white',
                      null: 'bg-[#db7c00] text-white',
                    };
                    const textes = {
                      true: 'Oui',
                      false: 'Non',
                      null: 'Inconnu',
                    };
                    const icones = {
                      okChien: <DogIcon />,
                      okChat: <CatIcon />,
                      okChild: <ChildIcon />,
                    };

                    return (
                      <span
                        key={cle}
                        className={`flex items-center gap-1 px-2 py-1 rounded-[4px] text-sm font-medium shadow-md ${couleurs[valeur === null ? 'null' : valeur]}`}
                      >
                        {icones[cle]} {textes[valeur === null ? 'null' : valeur]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeAnimalsArchive;
