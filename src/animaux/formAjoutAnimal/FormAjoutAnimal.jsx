import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";




const STEPS = [
  { key: "identite", label: "Identité", path: "identite" },
  { key: "statut", label: "Statut et besoins", path: "statut-besoins" },
  { key: "sante", label: "Santé", path: "sante" },
  { key: "histoire", label: "Histoire", path: "histoire" },
  { key: "docs", label: "Situation et documents", path: "documents" },
];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function StepBullet({ isActive, isDone }) {
  return (
    <span
      className={`inline-block h-3 w-3 rounded-full border-2 ${
        isActive
          ? "bg-primaryYellow border-primaryYellow" // Étape active → Jaune
          : isDone
          ? "bg-primaryGreen border-primaryGreen" // Étape terminée → Vert
          : "bg-white border-white/80" // Étape à venir → Vide blanc
      }`}
    />
  );
}

export default function AjoutNouvelAnimal() {
  const location = useLocation();
  const navigate = useNavigate();


  const currentIdx = React.useMemo(() => {
    const match = STEPS.findIndex((s) => location.pathname.endsWith(s.path));
    return match >= 0 ? match : 0;
  }, [location.pathname]);

  const gotoNext = () => {
    const next = STEPS[currentIdx + 1];
    if (next) navigate(next.path);
  };

  return (
    <div className="grid md:grid-cols-[280px,1fr] grid-cols-1  bg-[#F5F7FB] scrollbar-custom ">
      {/* Barre bleu de nav */}
     <aside className="relative bg-SecondBlue text-primaryBlue md:mb-12">
       
        <div className="hidden md:block absolute left-0 top-0 md:h-full w-[10px] bg-primaryBlue" />
        <div className="md:sticky md:top-0 md:h-screen flex flex-col pt-12 md:pt-0 ">
          <div className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4">
            <h1 className="text-xl  md:text-2xl font-bold leading-tight">Ajouter un nouvel animal</h1>
            
          </div>

          <div className="px-4 md:px-6 text-black md:mt-20 mt-4 ">
            <p className="text-lg font-bold mb-4">Étapes de création</p>

{/* Progression mobile seulement */}
            <p className="md:hidden mt-2 text-sm font-semibold mb-6">
                {currentIdx + 1}/5 : {STEPS[currentIdx]?.label}

            </p>

            {/*bulles avec ligne vertical  */}
            <div className="relative hidden md:block ">
              <div className=" absolute left-[29px] top-[5px] bottom-[5px] w-px bg-white/60 " />
              <nav className="flex flex-col gap-4 md:gap-5 pl-0 md:pl-6">
                {STEPS.map((s, i) => {
                  const isActive = i === currentIdx;
                  const isDone = i < currentIdx;
                  return (
                    <NavLink
                      key={s.key}
                      to={s.path}
                      className={({ isActive: _active }) =>
                        classNames(
                          "group flex items-center gap-3 text-[15px]",
                          isActive || _active ? "font-semibold" : "font-medium opacity-90 hover:opacity-100"
                        )
                      }
                    >
                      {/* bulle jaune sur la ligne */}
                      <span className="relative z-10">
                      <StepBullet index={i} isDone={isDone} isActive={isActive} />
                      </span>
                      <span>{s.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          
        </div>
      </aside>

      {/* Zone de droite qui se modifie */}
      <main className="relative overflow-y-auto scrollbar-custom ">
      
          <div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white "
          >
            <div className="p-6">
            
              <Outlet />
            </div>

           {/* Wizard footer avec barre de progression */}
<div className="border-t border-black/5 px-6 py-4">
  {/* Barre de progression */}
  <div className="w-full h-1 bg-blue-100 mb-4 rounded">
    <div
      className="h-full bg-[#0D1E66] rounded transition-all duration-300"
      style={{ width: `${((currentIdx + 1) / STEPS.length) * 100}%` }}
    />
  </div>

  {/* Boutons */}
  <div className="flex items-center justify-between">
    <button
      onClick={() => navigate(-1)}
      className="text-sm underline underline-offset-4 hover:no-underline"
    >
      Retour
    </button>

    <button
      onClick={gotoNext}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-[#FFC94B] hover:brightness-105"
    >
      Suivant
    </button>
  </div>
</div>
          </div>
       
      </main>
    </div>
  );
}


