import React, {Component} from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class AcceuilPage extends Component{
    render(){
        return (
            <Container>
                <div className="bg-dark text-white p-5 rounded-lg m-1 mt-1 text-center">
                    <div className="text-center">
                        <img src="logo.png" width="120" height="120" alt="Adria business and Technologies logo" />
                    </div>
                    <h1 className="display-3 text-center">Systeme Ebankinig</h1>
                    <p className="lead">Cette application est développée pour aider les agents back office de bien gérer les abonnés ebanking, leurs contrats d'abonnement ainsi que les offres commerciales...</p>
                    <hr/>
                    <Row>
                        <Col className="mb-3" xs={12} md={5}>
                            <h5>Consulter les listes des</h5>
                            <Link to={"/abonnes"}>
                                <Button variant="outline-warning">Abonnés</Button>
                            </Link>{' '}
                            <Link to={"/contrats"}>
                                <Button variant="outline-warning">Contrats</Button>
                            </Link>{' '}
                            <Link to={"/offres"}>
                                <Button variant="outline-warning">Offres</Button>
                            </Link>
                        </Col>
                        <Col xs={0} md={2}>
                            <div className="vr"></div>
                        </Col>
                        <Col xs={12} md={5}>
                            <h5>Ou bien essayer d'ajouter un</h5>
                            <Link to={"/ajouterAbonne"}>
                                <Button variant="outline-warning">Abonné</Button>
                            </Link>{' '}
                            <Link to={"/ajouterContrat"}>
                                <Button variant="outline-warning">Contrat</Button>
                            </Link>{' '}
                            <Link to={"/ajouterOffre"}>
                                <Button variant="outline-warning">Offre</Button>
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}