import React, {Component} from "react";
import { Button, ButtonGroup, Card, InputGroup, FormControl, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faList, faSortNumericDesc, faSortNumericAsc, faSortAlphaDesc, faSortAlphaAsc, faFastForward, faStepForward, faStepBackward, faFastBackward, faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "../MessageToast";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';

import axios from "axios";

const CONTRATS_REST_API_URL = 'http://localhost:8089/api/contrats';
const SUPPRIMER_UN_CONTRAT_REST_API_URL = 'http://localhost:8089/api/contrats/';

export default class ContratsListe extends Component{

    sortIdAsc = true;
    sortLibelleAsc = false;
    sortDescriptionAsc = false;

    sortBy = 'id';
    direction = 'asc';

    constructor(props){
        super(props);
        this.state = {
            contrats : [],
            page:1,
            totalDesContrats:0,
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
            ],
            search : "intitule",
            val : ""
        };

    }

    componentDidMount = () => {
        this.getTousLesContrats();
    };

    getTousLesContrats = () => {

        const params = { 
            search: this.state.search,
            val : this.state.val === '' ? null : this.state.val,
            page: this.state.page - 1,
            sort: this.state.sortParam[0]+","+this.state.sortParam[1]
        }

        axios.get(CONTRATS_REST_API_URL, { params: params })
            .then(response => response.data)
            .then((data) => {
                if(data.contrats !== undefined){
                    this.setState({
                        contrats : data.contrats,
                        page: data.page + 1,
                        totalDesContrats: data.totalDesContrats,
                        totalDesPages: data.totalDesPages === 0 ? 1 : data.totalDesPages
                    })
                }else{
                    this.setState({
                        contrats : [],
                        page: 1,
                        totalDesContrats: 0,
                        totalDesPages: 1
                    })
                }
            }).catch(err => console.log(err));
    };

    supprimerContrat = (id) => {

        const contrat = this.state.contrats.find((contrat) => contrat.id === id)

        Swal.fire({
            title: 'Voulez-vous vraiment supprimer ce contrat ?',
            html:
                '<p style="text-align:left">' +
                '<b>ID : </b>' + id + '<br>' +
                '<b>INTITULE : </b>' + contrat.intitule + '<br>' +
                '<b>STATUT : </b>' + contrat.statut + '</p>',
            icon: 'warning',
            color: 'white',
            background: 'rgb(41, 41, 41)',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: 'rgb(102, 102, 102)',
            confirmButtonText: "Oui, supprimer le contrat définitivement",
            cancelButtonText: "Annuler"

          }).then((result) => {
            if (result.isConfirmed) {
                this.supprimerContratDefinitivement(id);
            }
          })

    };

    supprimerContratDefinitivement = (id) => {
        axios.delete(SUPPRIMER_UN_CONTRAT_REST_API_URL + id)
            .then(response => {
                if(response.data != null){
                    this.setState({
                        contrats: this.state.contrats.filter(contrat => contrat.id !== id)
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
                this.getTousLesContrats();
            });
        }
    }

    premierPage = () => {
        if(this.state.page > 1){
            this.setState({
                page : 1
            },() => {
                this.getTousLesContrats();
            });
        }
    }

    pageSuivante = () => {
        if(this.state.page < this.state.totalDesPages){
            this.setState({
                page : this.state.page + 1
            },() => {
                this.getTousLesContrats();
            });
        }
    }

    pagePrecedente = () => {
        if(this.state.page > 1){
            this.setState({
                page : this.state.page - 1
            },() => {
                this.getTousLesContrats();
            });
        }
    }

    dernierePage = () => {
        if(this.state.page < this.state.totalDesPages){
            this.setState({
                page : this.state.totalDesPages
            },() => {
                this.getTousLesContrats();
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
            this.getTousLesContrats();
        });
    }

    sortIntitule = () => {
        const sortAsc = this.state.sortArray[1];
        this.setState({
            sortArray : [
                true,
                !sortAsc,
                true
            ],
            sortParam : [
                'intitule',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesContrats();
        });
    }

    sortStatut = () => {
        const sortAsc = this.state.sortArray[2];
        this.setState({
            sortArray : [
                true,
                true,
                !sortAsc
            ],
            sortParam : [
                'statut',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesContrats();
        });
    }

    handleSearchSelect = (e) =>{

        let valeur = this.state.val;

        if(valeur.includes('ACTIF') || valeur.includes('SUSPENDU')){
            valeur = '';
        }
        this.setState({ 
            search : e,
            val : e === 'statut' ? 'ACTIF' : valeur
        },() => {
            this.getTousLesContrats();
        });
    }

    valChange = e => {
        this.setState({ 
            val: e.target.value 
        },() => {
            this.getTousLesContrats();
        });
    }

    render(){

        const {page, totalDesContrats, totalDesPages, contrats, showMessage, successOuDanger, sortArray, search, val} = this.state;
        const message = successOuDanger === 'success' ? "Le contrat est supprimé avec succés" : successOuDanger;
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
                <div>
                    <InputGroup className="mb-3">
                        <DropdownButton
                            variant="outline-secondary"
                            title={search === 'intitule' ? "Intitule" : "Statut"}
                            id="input-group-dropdown-1"
                            onSelect={this.handleSearchSelect}
                        >
                            <Dropdown.Item eventKey="intitule">Intitule</Dropdown.Item>
                            <Dropdown.Item eventKey="statut">Statut</Dropdown.Item>
                        </DropdownButton>
                        {
                            search === 'statut' ? 
                            <Form.Select 
                                aria-label="Statut" name="statut"
                                value={val} onChange={this.valChange}
                                className={"bg-dark text-white"}>
                                    <option value="ACTIF">Actif</option>
                                    <option value="SUSPENDU">Suspendu</option>
                            </Form.Select>
                            :
                            <Form.Control 
                                aria-label="Text input with dropdown button" 
                                type="text" name="searchVal" autoComplete="off"
                                value={val} onChange={this.valChange}
                                className={"bg-dark text-white"}
                                placeholder="Chercher..."/>
                        }
                    </InputGroup>
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={faList} /> La Liste des Contrats</Card.Header>
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
                                            onClick={this.sortIntitule}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>INTITULE</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[1] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortStatut}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>STATUT</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[2] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"30%"}}>
                                        <Button 
                                            style={{"width":"100%"}}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>OFFRES</strong>
                                        </Button>
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {contrats.length === 0 ? 
                                    <tr align="center">
                                        <td colSpan="5">Aucun contrat à afficher.</td>
                                    </tr> : 
                                    contrats.map((contrat) => (
                                    <tr key={contrat.id}>
                                        <td>{contrat.id}</td>
                                        <td>{contrat.intitule}</td>
                                        <td>{contrat.statut}</td>
                                        <td>{
                                                contrat.offres.map((offre,i) => (
                                                    i === contrat.offres.length -1 ? offre.libelle : offre.libelle + ", "
                                                ))
                                            }
                                        </td>
                                        <td>
                                            <ButtonGroup>
                                                <Link to={`/contrats/${contrat.id}`} size="sm" className="btn btn-sm btn-outline-light"><FontAwesomeIcon icon={faEdit} /></Link>{' '}
                                                <Button size="sm" variant="outline-danger" onClick={this.supprimerContrat.bind(this,contrat.id)}><FontAwesomeIcon icon={faTrash} /></Button>
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
                            Totale des contrats : {totalDesContrats} - Page {page}/{totalDesPages}.
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