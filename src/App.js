import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import supabase from './supabaseClient';

import Auth from './components/connexion';
import Home from './home';
import AnimalDetails from './animaux/animalDetail';
import ListeAnimals from './animaux/listeAnimals';
import Header from './components/header';
import ListeAnimalsArchive from './animaux/animalArchive/listeAnimalsArchive';
import AjoutNouvelAnimal from './animaux/formAjoutAnimal/FormAjoutAnimal';
import Identite from './animaux/formAjoutAnimal/détailFormAjout.jsx/Identite';
import Sante from './animaux/formAjoutAnimal/détailFormAjout.jsx/sante';
import StatutBesoins from './animaux/formAjoutAnimal/détailFormAjout.jsx/statutBesoins';
import Documents from './animaux/formAjoutAnimal/détailFormAjout.jsx/document';
import Histoire from './animaux/formAjoutAnimal/détailFormAjout.jsx/histoire';

function App() {
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('authorized')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            setAuthorized(false);
          } else {
            setAuthorized(data.authorized);
          }
        });
    } else {
      setAuthorized(false);
    }
  }, [user]);

  if (!user) {
    // Pas connecté : page de connexion / inscription
    return <Auth />;
  }

  if (!authorized) {
    // Connecté mais pas autorisé
    return (
      <div>
        <p>Ton compte n'est pas encore validé. Patiente un peu ou contacte un administrateur.</p>
        <button onClick={async () => await supabase.auth.signOut()}>Se déconnecter</button>
      </div>
    );
  }

  // Connecté et autorisé, afficher l’app complète
  return (
    <Router>
      <Header />
       <div className="md:ml-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="animaux/ListeAnimals" element={<ListeAnimals />} />
          <Route path="animaux/AnimauxArchive" element={<ListeAnimalsArchive />} />
          <Route path="/animal/:id" element={<AnimalDetails />} />
          <Route path="/nouvel-animal" element={<AjoutNouvelAnimal />}>
            <Route index element={<Identite />} /> {/* étape par défaut */}
            <Route path="identite" element={<Identite />} />
            <Route path="statut-besoins" element={<StatutBesoins />} />
            <Route path="sante" element={<Sante />} />
            <Route path="histoire" element={<Histoire />} />
            <Route path="documents" element={<Documents />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
