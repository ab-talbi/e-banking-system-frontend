import React, {Component} from "react";
import { Button, ButtonGroup, Card, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faList, faTrash, faEdit} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const OFFRES_REST_API_URL = 'http://localhost:8089/api/offres';

export default class OffresListe extends Component{

    constructor(props){
        super(props);
        this.state = {
            offres : [],
            page:0,
            totalDesOffres:0,
            totalDesPages:0
        };
    }

    componentDidMount(){
        this.getTousLesOffres();
    }

    getTousLesOffres(){
        axios.get(OFFRES_REST_API_URL)
            .then(response => response.data)
            .then((data) => {
                if(data.offres !== undefined){
                    this.setState({
                        offres : data.offres,
                        page: data.page,
                        totalDesOffres: data.totalDesOffres,
                        totalDesPages: data.totalDesPages
                    })
                }
            }).catch(err => console.log(err));
    }

    render(){
        return (
            <Card className={"border border-dark bg-dark text-white"}>
                <Card.Header><FontAwesomeIcon icon={faList} /> La Liste des Offres</Card.Header>
                <Card.Body>
                    <Table bordered hover striped variant="dark">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>LIBELLE</th>
                                <th>DESCRIPTION</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.offres.length === 0 ? 
                                <tr align="center">
                                    <td colSpan="4">Aucun offre à afficher.</td>
                                </tr> : 
                                this.state.offres.map((offre) => (
                                <tr key={offre.id}>
                                    <td>{offre.id}</td>
                                    <td>{offre.libelle}</td>
                                    <td>{offre.description}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button size="sm" variant="outline-light"><FontAwesomeIcon icon={faEdit} /></Button>{' '}
                                            <Button size="sm" variant="outline-danger"><FontAwesomeIcon icon={faTrash} /></Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>  
                                ))
                            }
                            
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    }
}