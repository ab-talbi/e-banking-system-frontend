import React, {Component} from "react";
import { Card, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons";

export default class AbonnesListe extends Component{
    render(){
        return (
            <Card className={"border border-dark bg-dark text-white"}>
            <Card.Header><FontAwesomeIcon icon={faList} /> La Liste des Abonnés</Card.Header>
            <Card.Body>
                <Table bordered hover striped variant="dark">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOM ET PRENOM</th>
                            <th>EMAIL</th>
                            <th>ADRESSE</th>
                            <th>TEL</th>
                            <th>SEXE</th>
                            <th>STATUT</th>
                            <th>CONTRAT</th>
                            <th>AGENCE</th>
                            <th>BACKOFFICE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr align="center">
                            <td colSpan="10">Aucun abonné à afficher.</td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
        );
    }
}