import React, { useState } from 'react';

const AnimalForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    sexe: '',
    type: '',
    race: '',
    ddn: '',
    dpt: '',
    okChien: false,
    okChat: false,
    okChild: false,
    adoption:false,
    rechercheFa:false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  // Ne garde que les champs valides pour la base Supabase
  const newAnimal = {
    name: formData.name,
    sexe: formData.sexe,
    type: formData.type,
    race: formData.race,
    ddn: formData.ddn || null, 
    dpt: formData.dpt, 
    lieu: formData.lieu,
    okChien: formData.okChien,
    okChat: formData.okChat,
    okChild: formData.okChild,
    adoption: formData.adoption,
    rechercheFa: formData.rechercheFa,
  };

  onSubmit(newAnimal);  // Envoie un objet propre à la fonction handleAddAnimal
  onClose();            // Ferme la modal
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">Ajouter un animal</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="name" placeholder="Nom" onChange={handleChange} className="border p-2 rounded" required />
          <input name="sexe" placeholder="Sexe" onChange={handleChange} className="border p-2 rounded" />
          <input name="type" placeholder="Type" onChange={handleChange} className="border p-2 rounded" />
          <input name="race" placeholder="Race" onChange={handleChange} className="border p-2 rounded" />
          <input name="ddn" placeholder="Date de naissance" type="date" onChange={handleChange} className="border p-2 rounded" />
          <input name="lieu" placeholder="FA ou Pension etc..." onChange={handleChange} className="border p-2 rounded" />
          <input name="dpt" placeholder="Département" onChange={handleChange} className="border p-2 rounded" />
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
</div>
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