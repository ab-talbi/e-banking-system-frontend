import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class AcceuilPage extends React.Component{
    render(){
        return (
            <Container>
                <div class="bg-dark text-white p-5 rounded-lg m-3 mt-5">
                    <h1 class="display-4">Systeme Ebankinig</h1>
                    <p class="lead">Cette application est développée pour aider un agent back office de bien gérer les abonnés ebanking, leurs contrats d'abonnement ainsi que les offres commerciales...</p>
                    <hr/>
                    <h5>Les listes des</h5>
                    <Link to={"/abonnes"}>
                        <Button variant="outline-warning">Abonnés</Button>
                    </Link>{' '}
                    <Link to={"/contrats"}>
                        <Button variant="outline-warning">Contrats</Button>
                    </Link>{' '}
                    <Link to={"/offres"}>
                        <Button variant="outline-warning">Offres</Button>
                    </Link>
                    <br/>
                    <br/>
                    <h5>Ajouter un</h5>
                    <Link to={"/ajouterAbonne"}>
                        <Button variant="outline-warning">Abonné</Button>
                    </Link>{' '}
                    <Link to={"/ajouterContrat"}>
                        <Button variant="outline-warning">Contrat</Button>
                    </Link>{' '}
                    <Link to={"/ajouterOffre"}>
                        <Button variant="outline-warning">Offre</Button>
                    </Link>
                </div>
            </Container>
        );
    }
}

export default AcceuilPage;