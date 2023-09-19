import React, {Component} from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare, faUndo} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select"
import makeAnimated from "react-select/animated"
import MessageToast from "./MessageToast";

import axios from "axios";

const OFFRES_REST_API_URL = 'http://localhost:8089/api/offres/tous';
const ABONNES_REST_API_URL = 'http://localhost:8089/api/abonnes/disponibles';
const CREATE_CONTRAT_REST_API_URL = 'http://localhost:8089/api/contrats';

export default class AjouterContrat extends Component{

    constructor(props){
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.successOuDanger = 'success';
        this.contratChange = this.contratChange.bind(this);
        this.ajouterContrat = this.ajouterContrat.bind(this);
        this.contratChangeForMultiSelect = this.contratChangeForMultiSelect.bind(this);
        this.state.offresOptions = [];
        this.state.abonnesOptions = [];
    }

    initialState = {
        intitule:'', 
        statut:0, 
        abonneId:0, 
        offresIds:[]
    };

    componentDidMount = () => {
        this.getLesOffres();
        this.getLesAbonnes();
    };

    getLesOffres = () => {
        axios.get(OFFRES_REST_API_URL)
            .then((response) => {
                if(response.data !== undefined){
                    const offres = [];
                    response.data.forEach((offre) => {
                        const isValueUnique = !offres.some((obj) => obj.value === offre.id);
                        if(isValueUnique){
                            offres.push({ value: offre.id, label: offre.libelle });
                        }
                      });
                      this.setState({
                        offresOptions : offres
                      });
                }
            }).catch(err => {
                console.log(err);
            });
    };

    getLesAbonnes = () => {
        axios.get(ABONNES_REST_API_URL)
            .then((response) => {
                if(response.data !== undefined){
                    const abonnes = [];
                    response.data.forEach((abonne) => {
                        const isValueUnique = !abonnes.some((obj) => obj.value === abonne.id);
                        if(isValueUnique){
                            abonnes.push({ value: abonne.id, nom: abonne.nom, prenom: abonne.prenom });
                        }
                    });
                    this.setState({
                        abonnesOptions : abonnes
                    });
                }
            }).catch(err => {
                console.log(err);
            });
    };

    ajouterContrat = e => {
        e.preventDefault();

        const contrat = {
            intitule : this.state.intitule,
            statut : this.state.statut === 0 ? 'suspendu' : this.state.statut,
            offresIds : this.state.offresIds,
            abonneId : this.state.abonneId === 0 ? null : this.state.abonneId,
        }

        axios.post(CREATE_CONTRAT_REST_API_URL,contrat)
            .then(response => {
                if(response.data != null){
                    console.log(response.data);
                    this.resetContrat()
                    this.setState({'show':true});
                    this.setState({'successOuDanger':'success'});
                    setTimeout(()=>this.setState({'show':false}), 5000)
                    
                    this.getLesAbonnes();
                }else{
                    this.setState({'show':false});
                }
            }).catch(err => {
                console.log(err);
                this.setState({'show':true});
                this.setState({'successOuDanger':err.message});
                setTimeout(()=>this.setState({'show':false}), 5000)
            })
    }

    contratChange = e => {
        if(e.target.name === "abonneId"){
            e.target.value = Number(e.target.value)
        }
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    contratChangeForMultiSelect = selectedOptions => {
        const offresIds = [];

        for (const options of selectedOptions) {
            offresIds.push(Number(options.value));
        }

        this.setState({ 
            offresIds : offresIds
        });
    };

    resetContrat = () => {
        this.setState(
            { intitule : '', }
        )
    };

    render(){

        const {intitule, statut, abonneId, offresIds} = this.state;
        const show = this.state.show;
        const successOuDanger = this.state.successOuDanger;
        const message = successOuDanger === 'success' ? "Contrat est enregistré avec succés" : successOuDanger;

        return (
            <div>
                {
                    show ? 
                    <div>
                        <MessageToast show={show} header={successOuDanger} message={message} />
                    </div>
                    :
                    <div style={{'display':'none'}}></div>
                }
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Ajouter un Contrat</Card.Header>
                    <Form onReset={this.resetContrat} onSubmit={this.ajouterContrat} id="contratFormId" className="form-control border border-dark bg-dark text-white">
                        <Card.Body>
                            <Row>
                                <Form.Group as={Col} controlId="formIntitule" className="mb-3" xs={12} md={8}>
                                    <Form.Label>Intitulé</Form.Label>
                                    <Form.Control 
                                        type="text" name="intitule"
                                        value={intitule} onChange={this.contratChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="L'intitulé du contrat" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formStatut" className="mb-3" xs={12} md={4}>
                                    <Form.Label>Statut</Form.Label>
                                    <Form.Select 
                                        aria-label="Statut" name="statut"
                                        value={statut} onChange={this.contratChange}
                                        className={"border border-warning bg-dark text-white"}>
                                            <option disabled value={0} key={0}>Choisir le statut du contrat</option>
                                            <option value="actif">Actif</option>
                                            <option value="suspendu">Suspendu</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formAbonne" className="mb-3" xs={12} md={6}>
                                    <Form.Label>Abonne</Form.Label>
                                    <Form.Select 
                                        aria-label="Abonne" name="abonneId"
                                        value={abonneId} onChange={this.contratChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Ajouter l'abonné associé" >
                                            <option disabled value={0} key={0}>Choisir l'abonné à associer à cet contrat</option>
                                            {this.state.abonnesOptions.map((abonne) => <option key={abonne.value} value={abonne.value}>{abonne.nom + " " +abonne.prenom}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" xs={12} md={6}>
                                    <Form.Label htmlFor="offresIds">Offres</Form.Label>
                                    <Select
                                        inputId="offresIds" name="offresIds"
                                        options={this.state.offresOptions} selectedValues={offresIds}
                                        onChange={(selectedOptions) => this.contratChangeForMultiSelect(selectedOptions)}
                                        styles={multiSelectStyles}
                                        isMulti isClearable isSearchable
                                        closeMenuOnSelect={false}
                                        components={animatedComponenets}
                                        placeholder="Ajouter un ou plusieurs offres"
                                        noOptionsMessage={() => "Pas d'offre à ajouter"} />
                                </Form.Group>
                            </Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign":"right"}}>
                            <Button size="sm" variant="dark" type="reset">
                                <FontAwesomeIcon icon={faUndo} />  Réinitialiser
                            </Button>{' '}
                            <Button size="sm" variant="warning" type="submit">
                                <FontAwesomeIcon icon={faSave} />  Enregistrer
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        );
    }
}

const animatedComponenets = makeAnimated();

const multiSelectStyles = {

    control: (base, state) => ({
        ...base,
        background: '#212529',
        borderRadius: '6px',
        borderColor: '#ffc107',
        outline: 0,
        boxShadow: state.isFocused ? '0 0 0 4px rgba(25, 83, 190, 0.5)' : null,
        '&:hover': {
            borderColor: '#ffc107'
          }
      }),

    menuList: styles => ({
        ...styles,
        background: '#212529',
        borderRadius: '6px',
        border:'0.3px solid rgb(100, 100, 100)',
        padding: 0
    }),

    option: (styles, {isFocused, isSelected}) => ({
        ...styles,
        color: 'white',
        background: isFocused ? 'rgb(105, 105, 105)' : isSelected ? 'rgb(105, 105, 105)' : undefined,
        zIndex: 1,
        height:'29px',
        padding: '2px 0 2px 5px'
    }),

    menu: base => ({
        ...base,
        zIndex: 100,
        marginTop: 0,
        hyphens: 'auto',
    }),

    dropdownIndicator:(provided) => ({
        ...provided,
        color:'rgb(53, 53, 53)',
        '&:hover': {
            color: 'rgb(53, 53, 53)'
          }
      }),
    
    input:(provided) => ({
        ...provided,
        color:'white'
      }),

    placeholder:(provided) => ({
        ...provided,
        color:'white'
      }),  
}