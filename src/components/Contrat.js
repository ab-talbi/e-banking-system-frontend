import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare, faUndo} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "./MessageToast";
import PageNotFound from "./PageNotFound";
import makeAnimated from "react-select/animated"
import Select from "react-select"

import { useParams } from "react-router-dom";

import axios from "axios";

const GET_ET_UPDATE_CONTRAT_REST_API_URL = 'http://localhost:8089/api/contrats/';
const OFFRES_REST_API_URL = 'http://localhost:8089/api/offres/tous';

export default function Contrat(){

    const {id} = useParams();
    const [contrat, setContrat] = useState({
        id: '',
        intitule: '',
        statut: '',
        offresIds: []
    });
    const [offresOptions, setOffresOptions] = useState([]);
    const [defaultOffresOptions, setDefaultOffresOptions] = useState([]);
    const [show, setShow] = useState(false);
    const [found, setFound] = useState(false);
    const [successOuDanger, setSuccessOuDanger] = useState('success');

    useEffect(() => {
        if(/^\d+$/.test(id) && parseInt(id) >= 1){
            trouverUnContratById(id);
            getLesOffres();
        }else{
            setFound(false);
        }     
    }, [id]);

    useEffect(() => {
        
    }, [contrat]);

    useEffect(() => {
        const defaultOptions = []
        console.log(contrat.offresIds)
        offresOptions.forEach((offre) => {
            for (var i = 0; i < contrat.offresIds.length; i++) {
                if (contrat.offresIds[i] === offre.id) {
                    defaultOptions.push({ value: offre.id, label: offre.libelle });
                }
            }   
        }); 

        console.log("default"+defaultOptions)
        setDefaultOffresOptions(defaultOptions);
        console.log("default state"+defaultOffresOptions)
    }, [offresOptions, contrat.offresIds]);
    
    const trouverUnContratById = (id) => {
        axios.get(GET_ET_UPDATE_CONTRAT_REST_API_URL+id)
            .then(response => {

                if(response.data != null){
                    setContrat({
                        id : id,
                        intitule : response.data.intitule,
                        statut : response.data.statut,
                        offresIds : Array.from(response.data.offres, offre => offre.id)
                    });
                    setFound(true);
                }else{
                    setFound(false);
                }

            }).catch(err => {
                console.log(err.message);
                setFound(false);
            });
    };

    const getLesOffres = () => {
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
                      setOffresOptions(() => offres);
                }
            }).catch(err => {
                console.log(err);
            });
    };

    const modifierContrat = (e) => {

        e.preventDefault();

        axios.put(GET_ET_UPDATE_CONTRAT_REST_API_URL+contrat.id,contrat)
            .then(response => {
                if(response.data != null){
                    console.log(response.data);
                    setShow(true);
                    setSuccessOuDanger('success');
                    setTimeout(()=>setShow(false), 5000)
                }else{
                    setShow(false);
                }
            }).catch(err => {
                console.log(err.message);
                setShow(true);
                setSuccessOuDanger(err.message);
                setTimeout(()=>setShow(false), 5000)
            })
    };

    const contratChange = e => {
        setContrat({
            ...contrat,
            [e.target.name]: e.target.value}
        );
    };

    const contratChangeForMultiSelect = selectedOptions => {
        const offresIds = [];

        for (const options of selectedOptions) {
            offresIds.push(Number(options.value));
        }

        setContrat({ 
            ...contrat,
            offresIds : offresIds
        });
    };

    const resetContrat = () => {
        trouverUnContratById(id);
    };

    const {intitule, statut, offresIds} = contrat;
    const message = successOuDanger === 'success' ? "Le contrat est modifié avec succés" : successOuDanger;

    return (
        <div>
            {found ? 
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
                    <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Modifier le contrat de l'id : {id}</Card.Header>
                    <Form onReset={resetContrat} onSubmit={e => modifierContrat(e)} id="contratFormId" className="form-control border border-dark bg-dark text-white">
                        <Card.Body>
                            <Row>
                                <Form.Group as={Col} controlId="formIntitule" className="mb-3" xs={12} md={8}>
                                    <Form.Label>Intitulé</Form.Label>
                                    <Form.Control 
                                        type="text" name="intitule"
                                        value={intitule} onChange={contratChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="L'intitulé du contrat" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formStatut" className="mb-3" xs={12} md={4}>
                                    <Form.Label>Statut</Form.Label>
                                    <Form.Select 
                                        aria-label="Statut" name="statut" onChange={contratChange}
                                        defaultValue={statut === 'ACTIF' ? 'actif' : 'suspendu'}
                                        className={"border border-warning bg-dark text-white"}>
                                            <option disabled value={0} key={0}>Choisir le statut du contrat</option>
                                            <option value="actif">Actif</option>
                                            <option value="suspendu">Suspendu</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row>
                                {/*
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
                                */}
                                <Form.Group as={Col} className="mb-3" xs={12} md={12}>
                                    <Form.Label htmlFor="offresIds">Offres</Form.Label>
                                    <Select
                                        inputId="offresIds" name="offresIds"
                                        options={offresOptions} selectedValues={offresIds}
                                        defaultValue={defaultOffresOptions}
                                        onChange={contratChangeForMultiSelect}
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
                                <FontAwesomeIcon icon={faSave} />  Enregistrer les modifications
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
            : 
            <div>
                <PageNotFound/>
            </div>
            }
        </div>
    );
    
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