import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './listeAnimals';
import AnimalDetails from './animalDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animal/:id" element={<AnimalDetails />} />
      </Routes>
    </Router>
  );
}
export default App
