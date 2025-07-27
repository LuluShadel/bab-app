import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import supabase from './supabaseClient';

import Auth from './components/connexion';
import Home from './home';
import AnimalDetails from './animaux/animalDetail';
import ListeAnimals from './animaux/listeAnimals';
import Header from './components/header';
import ListeAnimalsArchive from './animaux/animalArchive/listeAnimalsArchive';

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
       <div className="ml-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="animaux/ListeAnimals" element={<ListeAnimals />} />
          <Route path="animaux/AnimauxArchive" element={<ListeAnimalsArchive />} />
          <Route path="/animal/:id" element={<AnimalDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
