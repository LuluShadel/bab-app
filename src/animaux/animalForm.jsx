import React, { useState } from 'react';
import supabase from '../supabaseClient';

//poir ajouter un animal
const AnimalForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    sexe: '',
    type: '',
    icad:'',
    race: '',
    ddn: '',
    dpt: '',
    nomFa: '',
    okChien: false,
    okChat: false,
    okChild: false,
    adoption:false,
    rechercheFa:false,
    panierRetraite:false,
    requisition:false,
    suivi: '',
    img:null,
    sterilisation:false,
    categorisation:"",
    vermifuge:"",
    vaccin:"",
    description:"",
    besoin:"",


  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let imagePath = null;

  if (formData.img) {
    const fileExt = formData.img.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `animals/${fileName}`;

    const { data, error } = await supabase
      .storage
      .from('photos')
      .upload(filePath, formData.img);

    if (error) {
      console.error('Erreur upload image:', error.message);
    } else {
      imagePath = filePath;
    }
    console.log(data)
  }

  const newAnimal = {
    name: formData.name,
    sexe: formData.sexe,
    type: formData.type,
    icad: formData.icad,
    race: formData.race,
    ddn: formData.ddn || null,
    dpt: formData.dpt,
    nomFa: formData.nomFa,
    lieu: formData.lieu,
    okChien: formData.okChien,
    okChat: formData.okChat,
    okChild: formData.okChild,
    adoption: formData.adoption,
    rechercheFa: formData.rechercheFa,
    panierRetraite: formData.panierRetraite,
    requisition: formData.requisition,
    suivi: formData.suivi,
    img: imagePath,
    sterilisation: formData.sterilisation,
    categorisation: formData.categorisation,
    vermifuge: formData.vermifuge,
    vaccin: formData.vaccin,
    description: formData.description,
    besoin : formData.besoin,
  };

  onSubmit(newAnimal);
  onClose();
};            // Ferme la modal

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
    <div className="bg-white rounded-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">Ajouter un animal</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="name" placeholder="Nom" onChange={handleChange} className="border p-2 rounded" required />
          <input name="sexe" placeholder="Sexe" onChange={handleChange} className="border p-2 rounded" />
          <input name="type" placeholder="Type" onChange={handleChange} className="border p-2 rounded" />
          <input name="race" placeholder="Race" onChange={handleChange} className="border p-2 rounded" />
          <input name="icad" placeholder="icad" onChange={handleChange} className="border p-2 rounded" />
          <input name="ddn" placeholder="Date de naissance" onChange={handleChange} className="border p-2 rounded" />
          <input name="lieu" placeholder="FA ou Pension etc..." onChange={handleChange} className="border p-2 rounded" />
          <input name="nomFa" placeholder="Nom de la personne en charge" onChange={handleChange} className="border p-2 rounded" />
          <input name="dpt" placeholder="Département" onChange={handleChange} className="border p-2 rounded" />
          <input name="suivi" placeholder="Suivi fait par:" onChange={handleChange} className="border p-2 rounded" />
          <div className="flex gap-4">
            <label><input type="checkbox" name="okChien" onChange={handleChange} /> OK chien</label>
            <label><input type="checkbox" name="okChat" onChange={handleChange} /> OK chat</label>
            <label><input type="checkbox" name="okChild" onChange={handleChange} /> OK enfant</label>
          </div>
          <div className="mb-4">
  <label className="mr-4">
    <input
      type="checkbox"
      checked={formData.adoption}
      onChange={(e) => setFormData({ ...formData, adoption: e.target.checked })}
    />
    À l'adoption
  </label>

  <label className="ml-4">
    <input
      type="checkbox"
      checked={formData.rechercheFa}
      onChange={(e) => setFormData({ ...formData, rechercheFa: e.target.checked })}
    />
    Recherche FA
  </label>
  <label className="ml-4">
    <input
      type="checkbox"
      checked={formData.panierRetraite}
      onChange={(e) => setFormData({ ...formData, panierRetraite: e.target.checked })}
    />
    Panier retraite
  </label>
  <label className="ml-4">
    <input
      type="checkbox"
      checked={formData.requisition}
      onChange={(e) => setFormData({ ...formData, requisition: e.target.checked })}
    />
    Sous requisition
  </label>
</div>
<label className="ml-4">
  Stérilisation :
  <select
    value={formData.sterilisation}
    onChange={(e) =>
      setFormData({ ...formData, sterilisation: e.target.value === 'true' })
    }
    className="ml-2 border p-1 rounded"
  >
    <option value="false">À faire</option>
    <option value="true">Fait</option>
  </select>
</label>
<label className="ml-4">
  Catégorisation :
  <select
    value={formData.categorisation}
    onChange={(e) =>
      setFormData({ ...formData, categorisation: e.target.value })
    }
    className="ml-2 border p-1 rounded"
  >
    <option value="Categorie-1">Catégorie 1</option>
    <option value="Categorie-2">Catégorie 2</option>
    <option value="Pas-de-categorie">Pas de catégorie</option>
  </select>
</label>
<label className="flex flex-col">
  Description de l'animal :
  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    className="border p-2 rounded mt-1"
    rows={3}
    placeholder="Décrire son caractère, son histoire, etc."
  />
</label>

<label className="flex flex-col mt-4">
  Besoins spécifiques :
  <textarea
    name="besoin"
    value={formData.besoin}
    onChange={handleChange}
    className="border p-2 rounded mt-1"
    rows={3}
    placeholder="Besoin d'un jardin, éducation spécifique, etc."
  />
</label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => setFormData({ ...formData, img: e.target.files[0] })}
/>
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalForm;