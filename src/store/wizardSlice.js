import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  identite: { prenom: "", genre: "", espece:"", photo:null, ancienPrenom:"", icad:"",dateNaissance:"", race:""  },

   statutBesoins: {
    suivi:"",
    sterilise:false,
    categorie:false,
    statut: "",         
    requisition: false, 
    adoption: false,
    rechercheFa: false,
  rechercheCovoit: false,
  panierRetraite: false,
  parrainage: false,
  okChien: null,
    okChat: null,
    okChild: null,  
endroitCalme: false,
santéFragile: false,
jardin: false,
escalier: false,
congenere  : false,
  },

  sante: { veto: "",
    poids:"",
    antecedentMedicaux:"",
    derniereVisiteVeto:"",
    vaccin:"",
    vermifuge:"",
    traitement:""

   },

  histoire: { histoire: "",
    ententes:'',
    besoins:"",
   },
};

const wizardSlice = createSlice({
  name: "wizard",
  initialState,
  reducers: {
    setStepData: (state, { payload }) => {
      const { step, data } = payload;
      state[step] = { ...state[step], ...data };
    },
    setAllData: (state, { payload }) => {
      return payload;
    },
    resetWizard: () => initialState,
  },
});

export const { setStepData, setAllData, resetWizard } = wizardSlice.actions;
export default wizardSlice.reducer;