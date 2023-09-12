import './App.css';
import NavigationBar from './components/NavigationBar';
import AcceuilPage from './components/AcceuilPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import AjouterAbonne from './components/AjouterAbonne';
import AbonnesListe from './components/AbonnesListe';
import AjouterContrat from './components/AjouterContrat';
import ContratsListe from './components/ContratsListe';
import AjouterOffre from './components/AjouterOffre';
import OffresListe from './components/OffresListe';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path='/' exact Component={AcceuilPage} />
        <Route path='/ajouterAbonne' exact Component={AjouterAbonne} />
        <Route path='/abonnes' exact Component={AbonnesListe} />
        <Route path='/ajouterContrat' exact Component={AjouterContrat} />
        <Route path='/contrats' exact Component={ContratsListe} />
        <Route path='/ajouterOffre' exact Component={AjouterOffre} />
        <Route path='/offres' exact Component={OffresListe} />
      </Routes>
    </Router>
  );
}

export default App;
