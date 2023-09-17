import React, {Component} from "react";
import { Button, ButtonGroup, Card, InputGroup, FormControl, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faList, faTrash, faEdit, faFastBackward, faStepBackward, faStepForward, faFastForward, faSortNumericAsc, faSortAlphaAsc, faSortNumericDesc, faSortAlphaDesc} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "./MessageToast";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import axios from "axios";

const OFFRES_REST_API_URL = 'http://localhost:8089/api/offres';
const SUPPRIMER_UN_OFFRE_REST_API_URL = 'http://localhost:8089/api/offres/';

export default class OffresListe extends Component{

    sortIdAsc = true;
    sortLibelleAsc = false;
    sortDescriptionAsc = false;

    sortBy = 'id';
    direction = 'asc';

    constructor(props){
        super(props);
        this.state = {
            offres : [],
            page:1,
            totalDesOffres:0,
            totalDesPages:1,
            showAlert:false,
            showMessage:false,
            successOuDanger:'success',
            sortParam : [
                this.sortBy,
                this.direction
            ],
            sortArray : [
                this.sortIdAsc,
                this.sortLibelleAsc,
                this.sortDescriptionAsc
            ]
        };

    }

    componentDidMount = () => {
        this.getTousLesOffres();
    };

    getTousLesOffres = () => {

        const params = { 
            page: this.state.page - 1,
            sort: this.state.sortParam[0]+","+this.state.sortParam[1]
        }

        axios.get(OFFRES_REST_API_URL, { params: params })
            .then(response => response.data)
            .then((data) => {
                if(data.offres !== undefined){
                    this.setState({
                        offres : data.offres,
                        page: data.page + 1,
                        totalDesOffres: data.totalDesOffres,
                        totalDesPages: data.totalDesPages === 0 ? 1 : data.totalDesPages
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

    sortId = () => {
        const sortAsc = this.state.sortArray[0];
        this.setState({
            sortArray : [
                !sortAsc,
                true,
                true
            ],
            sortParam : [
                'id',
                !sortAsc ? 'asc' : 'desc'
            ]
            
        },() => {
            this.getTousLesOffres();
        });
    }

    sortLibelle = () => {
        const sortAsc = this.state.sortArray[1];
        this.setState({
            sortArray : [
                true,
                !sortAsc,
                true
            ],
            sortParam : [
                'libelle',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesOffres();
        });
    }

    sortDescription = () => {
        const sortAsc = this.state.sortArray[2];
        this.setState({
            sortArray : [
                true,
                true,
                !sortAsc
            ],
            sortParam : [
                'description',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesOffres();
        });
    }

    render(){

        const {page, totalDesOffres, totalDesPages, offres, showMessage, successOuDanger, sortArray} = this.state;
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
                {
                    showMessage ? 
                    <div>
                        <MessageToast show={showMessage} header={successOuDanger} message={message} />
                    </div>
                    :
                    <div style={{'display':'none'}}></div>
                }
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={faList} /> La Liste des Offres</Card.Header>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
                            <thead>
                                <tr>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortId}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>ID</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon  icon={sortArray[0]? faSortNumericAsc : faSortNumericDesc} />
                                            </strong>
                                            
                                        </Button>
                                    </th>
                                    <th style={{"width":"30%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortLibelle}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>LIBELLE</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[1] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"50%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortDescription}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>DESCRIPTION</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[2] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
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
                            Totale des offres : {totalDesOffres} - Page {page}/{totalDesPages}.
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