import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import AnimalDetails from './animaux/animalDetail';
import ListeAnimals from './animaux/listeAnimals';
import Header from './components/header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="animaux/ListeAnimals" element={<ListeAnimals />} />
        <Route path="/animal/:id" element={<AnimalDetails />} />
      </Routes>
    </Router>
  );
}
export default App
