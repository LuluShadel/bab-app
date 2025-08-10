import { configureStore } from "@reduxjs/toolkit";
import wizardReducer from "./wizardSlice"; 

export const store = configureStore({
  reducer: {
    wizard: wizardReducer, // chaque clé = un morceau du state global
  },
});