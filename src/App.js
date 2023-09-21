import './App.css';
import NavigationBar from './components/NavigationBar';
import AcceuilPage from './components/AcceuilPage';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import AjouterAbonne from './components/AjouterAbonne';
import AbonnesListe from './components/AbonnesListe';
import AjouterContrat from './components/AjouterContrat';
import ContratsListe from './components/ContratsListe';
import AjouterOffre from './components/AjouterOffre';
import OffresListe from './components/OffresListe';
import PageNotFound from './components/PageNotFound';
import Offre from './components/Offre';
import Contrat from './components/Contrat';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Container className='mt-5'>
        <Routes>
          <Route path='/' element={<AcceuilPage/>} />
          <Route path='/ajouterAbonne' element={<AjouterAbonne/>} />
          <Route path='/abonnes' element={<AbonnesListe/>} />
          <Route path='/ajouterContrat' element={<AjouterContrat/>} />
          <Route path='/contrats' element={<ContratsListe/>} />
          <Route path='/ajouterOffre' element={<AjouterOffre/>} />
          <Route path='/offres' exact element={<OffresListe/>} />
          <Route path='/offres/:id' exact element={<Offre/>} />
          <Route path='/contrats/:id' exact element={<Contrat/>} />
          <Route path='*' element={<PageNotFound/>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
