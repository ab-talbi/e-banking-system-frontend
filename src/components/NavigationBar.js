import React from "react";
import { Navbar,Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

class NavigationBar extends React.Component{
    render(){
        return (
            <div>
                <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                    <Link to={"/"} className="navbar-brand">
                        <img src="/logo.png" width="45" height="45" alt="Adria business and Technologies logo"/>
                        E-Bank
                    </Link>
                    <Navbar.Toggle aria-controls="navbarSelect"/>
                    <Navbar.Collapse id="navbarSelect">
                        <Nav className="mr-auto">
                            <Link to={"/ajouterAbonne"} className="nav-link">Ajouter Abonné</Link>
                            <Link to={"/abonnes"} className="nav-link">Abonnés</Link>
                            <Link to={"/ajouterContrat"} className="nav-link">Ajouter Contrat</Link>
                            <Link to={"/contrats"} className="nav-link">Contrats</Link>
                            <Link to={"/ajouterOffre"} className="nav-link">Ajouter Offre</Link>
                            <Link to={"/offres"} className="nav-link">Offres</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default NavigationBar;