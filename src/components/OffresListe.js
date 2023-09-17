import React, {Component} from "react";
import { Button, ButtonGroup, Card, InputGroup, FormControl, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faList, faTrash, faEdit, faFastBackward, faStepBackward, faStepForward, faFastForward} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "./MessageToast";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import axios from "axios";

const OFFRES_REST_API_URL = 'http://localhost:8089/api/offres';
const SUPPRIMER_UN_OFFRE_REST_API_URL = 'http://localhost:8089/api/offres/';

export default class OffresListe extends Component{

    constructor(props){
        super(props);
        this.state = {
            offres : [],
            page:1,
            totalDesOffres:0,
            totalDesPages:0
        };
        this.state.showAlert = false;
        this.state.showMessage = false;
        this.state.successOuDanger = 'success';
    }

    componentDidMount = () => {
        this.getTousLesOffres();
    };

    getTousLesOffres = () => {
        axios.get(OFFRES_REST_API_URL, { params: { page: this.state.page - 1 } })
            .then(response => response.data)
            .then((data) => {
                if(data.offres !== undefined){
                    this.setState({
                        offres : data.offres,
                        page: data.page + 1,
                        totalDesOffres: data.totalDesOffres,
                        totalDesPages: data.totalDesPages
                    })
                }
            }).catch(err => console.log(err));
    };

    supprimerOffre = (id) => {

        const offre = this.state.offres.find((offre) => offre.id === id)

        Swal.fire({
            title: 'Voulez-vous vraiment supprimer cet offre ?',
            html:
                '<p style="text-align:left">' +
                '<b>ID : </b>' + id + '<br>' +
                '<b>LIBELLE : </b>' + offre.libelle + '<br>' +
                '<b>DESCRIPTION : </b>' + offre.description + '</p>',
            icon: 'warning',
            color: 'white',
            background: 'rgb(41, 41, 41)',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: 'rgb(102, 102, 102)',
            confirmButtonText: "Oui, supprimer l'offre définitivement",
            cancelButtonText: "Annuler"

          }).then((result) => {
            if (result.isConfirmed) {
                this.supprimerOffreDefinitivement(id);
            }
          })

    };

    supprimerOffreDefinitivement = (id) => {
        axios.delete(SUPPRIMER_UN_OFFRE_REST_API_URL + id)
            .then(response => {
                if(response.data != null){
                    this.setState({
                        offres: this.state.offres.filter(offre => offre.id !== id)
                    });
                    this.setState({'showMessage':true});
                    this.setState({'successOuDanger':'success'});
                    setTimeout(()=>this.setState({'showMessage':false}), 5000);
                }else{
                    this.setState({'showMessage':false});
                }
            }).catch(err => {
                console.log(err);
                this.setState({'showMessage':true});
                this.setState({'successOuDanger':err.message});
                setTimeout(()=>this.setState({'showMessage':false}), 5000);
            });
    };

    pageChange = e => {
        const value = e.target.value;

        if(!(isNaN(value) || value % 1 !== 0 || !(/(^$|^\d*$)/.test(value)) || value <= 0 || value > this.state.totalDesPages)){
            this.setState({
                page : value
            },() => {
                this.getTousLesOffres();
            });
        }
    }

    premierPage = () => {
        if(this.state.page > 1){
            this.setState({
                page : 1
            },() => {
                this.getTousLesOffres();
            });
        }
    }

    pageSuivante = () => {
        if(this.state.page < this.state.totalDesPages){
            this.setState({
                page : this.state.page + 1
            },() => {
                this.getTousLesOffres();
            });
        }
    }

    pagePrecedente = () => {
        if(this.state.page > 1){
            this.setState({
                page : this.state.page - 1
            },() => {
                this.getTousLesOffres();
            });
        }
    }

    dernierePage = () => {
        if(this.state.page < this.state.totalDesPages){
            this.setState({
                page : this.state.totalDesPages
            },() => {
                this.getTousLesOffres();
            });
        }
    }

    render(){

        const {page, totalDesOffres, totalDesPages, offres} = this.state;
        const fin = page * 10;
        const premier = fin - 10;
        const showMessage = this.state.showMessage;
        const successOuDanger = this.state.successOuDanger;
        const message = successOuDanger === 'success' ? "L'offre est supprimé avec succés" : successOuDanger;
        const pageInputStyles = {
            width: "40px",
            border: "1px solid #FFC107",
            color : "rgb(194, 194, 194)",
            fontWeight: "bold",
            textAlign: "center"
        }

        return (
            <div>
                <div style={{"display":showMessage ? 'block' : 'none'}}>
                    <MessageToast show={showMessage} header={successOuDanger} message={message} />
                </div>
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
                                {offres.length === 0 ? 
                                    <tr align="center">
                                        <td colSpan="4">Aucun offre à afficher.</td>
                                    </tr> : 
                                    offres.map((offre) => (
                                    <tr key={offre.id}>
                                        <td>{offre.id}</td>
                                        <td>{offre.libelle}</td>
                                        <td>{offre.description}</td>
                                        <td>
                                            <ButtonGroup>
                                                <Link to={`/offres/${offre.id}`} size="sm" className="btn btn-sm btn-outline-light"><FontAwesomeIcon icon={faEdit} /></Link>{' '}
                                                <Button size="sm" variant="outline-danger" onClick={this.supprimerOffre.bind(this,offre.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>  
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer>
                        <div style={{"float" : "left"}}>
                            Page {page}/{totalDesPages}.
                        </div>
                        <div style={{"float" : "right"}}>
                            <InputGroup size="sm">
                                <Button 
                                    variant="outline-warning" 
                                    disabled={page === 1 ? true : false}
                                    onClick={this.premierPage}>
                                    <FontAwesomeIcon icon={faFastBackward} />
                                </Button>
                                <Button 
                                    variant="outline-warning"
                                    disabled={page === 1 ? true : false}
                                    onClick={this.pagePrecedente} >
                                    <FontAwesomeIcon icon={faStepBackward} />
                                </Button>
                                <FormControl 
                                    value={page} 
                                    onChange={this.pageChange}
                                    style={pageInputStyles} 
                                    className="bg-dark" />
                                <Button 
                                    variant="outline-warning"
                                    disabled={page === totalDesPages ? true : false}
                                    onClick={this.pageSuivante} >
                                    <FontAwesomeIcon icon={faStepForward} />
                                </Button>
                                <Button 
                                    variant="outline-warning" 
                                    disabled={page === totalDesPages ? true : false} 
                                    onClick={this.dernierePage} >
                                    <FontAwesomeIcon icon={faFastForward} />
                                </Button>
                            </InputGroup>
                        </div>
                    </Card.Footer>
                </Card>
            </div>
        );
    }
}