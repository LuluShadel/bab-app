import React, { useState } from 'react';
import supabase from '../supabaseClient';


function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Inscription réussie ! Vérifie ta boîte mail.');
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Connexion réussie !');
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md md:max-w-lg text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Application Brigade Animale Bénévole
        </h1>
    
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-between gap-2 mb-4">
          <button
            onClick={signUp}
            className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            S'inscrire
          </button>
          <button
            onClick={signIn}
            className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Se connecter
          </button>
        </div>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}

export default Auth;