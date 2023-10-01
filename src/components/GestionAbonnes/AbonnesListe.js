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

const ABONNES_REST_API_URL = 'http://localhost:8089/api/abonnes';
const SUPPRIMER_UN_ABONNE_REST_API_URL = 'http://localhost:8089/api/abonnes/';

export default class AbonnesListe extends Component{

    sortIdAsc = true;
    sortNomAsc = true;
    sortPrenomAsc = true;
    sortEmailAsc = true;
    sortStatutAsc = true;
    sortSexeAsc = true;

    sortBy = 'id';
    direction = 'asc';

    constructor(props){
        super(props);
        this.state = {
            abonnes : [],
            page:1,
            totalDesAbonnes:0,
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
                this.sortNomAsc,
                this.sortPrenomAsc,
                this.sortEmailAsc,
                this.sortStatutAsc,
                this.sortSexeAsc
            ],
            search : "nom",
            val : ""
        };
    }

    agences = [
        { value: "1", nom: "MARRAKECH ABDELKRIM EL KHATABI"},
        { value: "2", nom: "AIN CHOCK"},
        { value: "3", nom: "AGADIR DRARGA"}
    ];

    backOffices = [
        { value: "1", nom: "El Amrani", prenom: "Amine"},
        { value: "2", nom: "Moussaoui", prenom: "Leila"},
        { value: "3", nom: "Benjelloun", prenom: "Youssef"},
    ];

    componentDidMount = () => {
        this.getTousLesAbonnes();
    };

    getTousLesAbonnes = () => {

        const params = { 
            search: this.state.search,
            val : this.state.val === '' ? null : this.state.val,
            page: this.state.page - 1,
            sort: this.state.sortParam[0]+","+this.state.sortParam[1]
        }

        axios.get(ABONNES_REST_API_URL, { params: params })
            .then(response => response.data)
            .then((data) => {
                if(data.abonnes !== undefined){
                    this.setState({
                        abonnes : data.abonnes,
                        page: data.page + 1,
                        totalDesAbonnes: data.totalDesAbonnes,
                        totalDesPages: data.totalDesPages === 0 ? 1 : data.totalDesPages
                    })
                }else{
                    this.setState({
                        abonnes : [],
                        page: 1,
                        totalDesAbonnes: 0,
                        totalDesPages: 1
                    })
                }
            }).catch(err => console.log(err));
    };

    supprimerAbonne = (id) => {

        const abonne = this.state.abonnes.find((abonne) => abonne.id === id)
        console.log('abonné à supprimer : '+abonne);

        Swal.fire({
            title: 'Voulez-vous vraiment supprimer cet abonné ?',
            html:
                '<p style="text-align:left">' +
                '<b>ID : </b>' + id + '<br>' +
                '<b>NOM : </b>' + abonne.nom + '<br>' +
                '<b>PRENOM : </b>' + abonne.prenom + '</p>',
            icon: 'warning',
            color: 'white',
            background: 'rgb(41, 41, 41)',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: 'rgb(102, 102, 102)',
            confirmButtonText: "Oui, supprimer l'abonné définitivement",
            cancelButtonText: "Annuler"

          }).then((result) => {
            if (result.isConfirmed) {
                this.supprimerAbonneDefinitivement(id);
            }
          })

    };

    supprimerAbonneDefinitivement = (id) => {
        axios.delete(SUPPRIMER_UN_ABONNE_REST_API_URL + id)
            .then(response => {
                if(response.data != null){
                    this.setState({
                        abonnes: this.state.abonnes.filter(abonne => abonne.id !== id)
                    });
                    this.setState({'showMessage':true});
                    this.setState({'successOuDanger':'success'});
                    setTimeout(()=>this.setState({'showMessage':false}), 5000);

                    console.log('abonnes : '+this.state.abonnes);
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
                this.getTousLesAbonnes();
            });
        }
    }

    premierPage = () => {
        if(this.state.page > 1){
            this.setState({
                page : 1
            },() => {
                this.getTousLesAbonnes();
            });
        }
    }

    pageSuivante = () => {
        if(this.state.page < this.state.totalDesPages){
            this.setState({
                page : this.state.page + 1
            },() => {
                this.getTousLesAbonnes();
            });
        }
    }

    pagePrecedente = () => {
        if(this.state.page > 1){
            this.setState({
                page : this.state.page - 1
            },() => {
                this.getTousLesAbonnes();
            });
        }
    }

    dernierePage = () => {
        if(this.state.page < this.state.totalDesPages){
            this.setState({
                page : this.state.totalDesPages
            },() => {
                this.getTousLesAbonnes();
            });
        }
    }

    sortId = () => {
        const sortAsc = this.state.sortArray[0];
        this.setState({
            sortArray : [
                !sortAsc,
                true,
                true,
                true,
                true,
                true
            ],
            sortParam : [
                'id',
                !sortAsc ? 'asc' : 'desc'
            ]
            
        },() => {
            this.getTousLesAbonnes();
        });
    }

    sortNom = () => {
        const sortAsc = this.state.sortArray[1];
        this.setState({
            sortArray : [
                true,
                !sortAsc,
                true,
                true,
                true,
                true
            ],
            sortParam : [
                'nom',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesAbonnes();
        });
    }

    sortPrenom = () => {
        const sortAsc = this.state.sortArray[2];
        this.setState({
            sortArray : [
                true,
                true,
                !sortAsc,
                true,
                true,
                true
            ],
            sortParam : [
                'prenom',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesAbonnes();
        });
    }

    sortEmail = () => {
        const sortAsc = this.state.sortArray[3];
        this.setState({
            sortArray : [
                true,
                true,
                true,
                !sortAsc,
                true,
                true
            ],
            sortParam : [
                'email',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesAbonnes();
        });
    }

    sortStatut = () => {
        const sortAsc = this.state.sortArray[4];
        this.setState({
            sortArray : [
                true,
                true,
                true,
                true,
                !sortAsc,
                true
            ],
            sortParam : [
                'statut',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesAbonnes();
        });
    }

    sortSexe = () => {
        const sortAsc = this.state.sortArray[5];
        this.setState({
            sortArray : [
                true,
                true,
                true,
                true,
                true,
                !sortAsc
            ],
            sortParam : [
                'sexe',
                !sortAsc ? 'asc' : 'desc'
            ]
        },() => {
            this.getTousLesAbonnes();
        });
    }

    handleSearchSelect = (e) =>{

        let valeur = this.state.val;

        if(valeur.includes('ACTIF') || valeur.includes('SUSPENDU') || valeur.includes('HOMME') || valeur.includes('FEMME') || !isNaN(valeur) ){
            valeur = '';
        }

        this.setState({ 
            search : e,
            val : e === 'statut' ? 'ACTIF' : e === 'sexe' ? 'HOMME' : e === 'agence' ? '1' : e === 'backoffice' ? '1' : valeur
        },() => {
            this.getTousLesAbonnes();
        });
    }

    valChange = e => {
        this.setState({ 
            val: e.target.value 
        },() => {
            this.getTousLesAbonnes();
        });
    }

    render(){

        const {page, totalDesAbonnes, totalDesPages, abonnes, showMessage, successOuDanger, sortArray, search, val} = this.state;
        const message = successOuDanger === 'success' ? "L'abobbé est supprimé avec succés" : successOuDanger;
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
                            title={search.toUpperCase()}
                            id="input-group-dropdown-1"
                            onSelect={this.handleSearchSelect}
                        >
                            <Dropdown.Item eventKey="nom">Nom</Dropdown.Item>
                            <Dropdown.Item eventKey="prenom">Prénom</Dropdown.Item>
                            <Dropdown.Item eventKey="email">Email</Dropdown.Item>
                            <Dropdown.Item eventKey="adresse">Adresse</Dropdown.Item>
                            <Dropdown.Item eventKey="contrat">Contrat</Dropdown.Item>
                            <Dropdown.Item eventKey="agence">Agence</Dropdown.Item>
                            <Dropdown.Item eventKey="backoffice">Back Office</Dropdown.Item>
                            <Dropdown.Item eventKey="statut">Statut</Dropdown.Item>
                            <Dropdown.Item eventKey="sexe">Sexe</Dropdown.Item>
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
                            : search === 'sexe' ? 
                            <Form.Select 
                                aria-label="Sexe" name="sexe"
                                value={val} onChange={this.valChange}
                                className={"bg-dark text-white"}>
                                    <option value="HOMME">Homme</option>
                                    <option value="FEMME">Femme</option>
                            </Form.Select>
                            : search === 'agence' ? 
                            <Form.Select 
                                aria-label="Agence" name="agence"
                                value={val}
                                onChange={this.valChange}
                                className={"bg-dark text-white"} >
                                    {this.agences.map((agence) => <option key={agence.value} value={agence.value}>{agence.nom}</option>)}
                            </Form.Select>
                            : search === 'backoffice' ?
                            <Form.Select 
                                aria-label="BackOffice" name="backoffice"
                                value={val}
                                onChange={this.valChange}
                                className={"bg-dark text-white"} >
                                    {this.backOffices.map((backoffice) => <option key={backoffice.value} value={backoffice.value}>{backoffice.nom +" "+backoffice.prenom}</option>)}
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
                    <Card.Header><FontAwesomeIcon icon={faList} /> La Liste des Abonnés</Card.Header>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
                            <thead>
                                <tr>
                                    <th style={{"width":"5%"}}>
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
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortNom}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>NOM</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[1] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortPrenom}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>PRENOM</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[2] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortEmail}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>EMAIL</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[3] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>TEL</strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"5%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortSexe}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>SEXE</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[5] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"5%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            onClick={this.sortStatut}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>STATUT</strong> {'  '}
                                            <strong style={{"float":"right"}}>
                                                <FontAwesomeIcon icon={sortArray[4] ? faSortAlphaAsc : faSortAlphaDesc} />
                                            </strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}} 
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>CONTRAT</strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>ADRESSE</strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>AGENCE</strong>
                                        </Button>
                                    </th>
                                    <th style={{"width":"20%"}}>
                                        <Button 
                                            style={{"width":"100%"}}
                                            className="border border-dark bg-dark text-white">
                                            <strong style={{"float":"left"}}>BACKOFFICE</strong>
                                        </Button>
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {abonnes.length === 0 ? 
                                    <tr align="center">
                                        <td colSpan="12">Aucun abonné à afficher.</td>
                                    </tr> : 
                                    abonnes.map((abonne) => (
                                    <tr key={abonne.id}>
                                        <td>{abonne.id}</td>
                                        <td>{abonne.nom}</td>
                                        <td>{abonne.prenom}</td>
                                        <td>{abonne.email}</td>
                                        <td>{abonne.telephone}</td>
                                        <td>{abonne.sexe}</td>
                                        <td>{abonne.statut}</td>
                                        <td>{abonne.contrat != null ? abonne.contrat.intitule : ''}</td>
                                        <td>{abonne.adresse}</td>
                                        <td>{abonne.agence != null ? abonne.agence.nom : ''}</td>
                                        <td>{abonne.backOffice != null ? abonne.backOffice.nom + ' ' + abonne.backOffice.prenom : ''}</td>
                                        <td>
                                            <ButtonGroup>
                                                <Link to={`/abonnes/${abonne.id}`} size="sm" className="btn btn-sm btn-outline-light"><FontAwesomeIcon icon={faEdit} /></Link>{' '}
                                                <Button size="sm" variant="outline-danger" onClick={this.supprimerAbonne.bind(this,abonne.id)}><FontAwesomeIcon icon={faTrash} /></Button>
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
                            Totale des abonnés : {totalDesAbonnes} - Page {page}/{totalDesPages}.
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