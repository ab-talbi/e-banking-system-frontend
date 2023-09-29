import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare, faUndo} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "../MessageToast";
import PageNotFound from "../PageNotFound";

import { useParams } from "react-router-dom";

import axios from "axios";

const GET_ET_UPDATE_ABONNE_REST_API_URL = 'http://localhost:8089/api/abonnes/';

export default function Abonne(){

    const {id} = useParams();
    const [abonne, setAbonne] = useState({
        nom:'', 
        prenom:'', 
        email:'', 
        adresse:'', 
        telephone:'', 
        sexe:0, 
        statut:0,
        agenceId:0, 
        backOfficeId:0 
    });

    const [agences, setAgences] = useState([
        { value: "1", nom: "MARRAKECH ABDELKRIM EL KHATABI"},
        { value: "2", nom: "AIN CHOCK"},
        { value: "3", nom: "AGADIR DRARGA"}
      ])

    const [backOffices, setBackOffices] = useState([
        { value: "1", nom: "El Amrani", prenom: "Amine"},
        { value: "2", nom: "Moussaoui", prenom: "Leila"},
        { value: "3", nom: "Benjelloun", prenom: "Youssef"},
      ])

    const [show, setShow] = useState(false);
    const [found, setFound] = useState(false);
    const [successOuDanger, setSuccessOuDanger] = useState('success');

    useEffect(() => {
        if(/^\d+$/.test(id) && parseInt(id) >= 1){
            trouverUnAbonneById(id);
        }else{
            setFound(false);
        }     
    }, [id]);

    useEffect(() => {
        
    }, [abonne]);
    
    const trouverUnAbonneById = (id) => {
        axios.get(GET_ET_UPDATE_ABONNE_REST_API_URL+id)
            .then(response => {

                if(response.data != null){
                    setAbonne({
                        id : id,
                        nom: response.data.nom, 
                        prenom: response.data.prenom, 
                        email: response.data.email, 
                        adresse: response.data.adresse, 
                        telephone: response.data.telephone, 
                        sexe: response.data.sexe, 
                        statut: response.data.statut,
                        agenceId: response.data.agence != null ? response.data.agence.id : 0, 
                        backOfficeId: response.data.backOffice != null ? response.data.backOffice.id : 0
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

    const modifierAbonne = (e) => {

        e.preventDefault();

        axios.put(GET_ET_UPDATE_ABONNE_REST_API_URL+abonne.id,abonne)
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
                console.log(err.response.data)
                let message = '';
                if(err.response.data.nom != null){
                    message = err.response.data.nom;
                }else if(err.response.data.prenom != null){
                    message = err.response.data.prenom;
                }if(err.response.data.telephone != null){
                    message = err.response.data.telephone;
                }else{
                    message = JSON.stringify(err.response.data);
                }
                setShow(true);
                setSuccessOuDanger(message);
                setTimeout(()=>setShow(false), 5000)
            })
    };

    const abonneChange = e => {
        setAbonne({
            ...abonne,
            [e.target.name]: e.target.value}
        );
    };

    const resetAbonne = () => {
        trouverUnAbonneById(id);
    };

    const {nom, prenom, email, telephone, adresse, sexe, statut, agenceId, backOfficeId } = abonne;
    const message = successOuDanger === 'success' ? "L'abonné est modifié avec succés" : successOuDanger;

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
                    <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Modifier l'abonné de l'id : {id}</Card.Header>
                    <Form onReset={resetAbonne} onSubmit={e => modifierAbonne(e)} id="abonneFormId" className="form-control border border-dark bg-dark text-white">
                        <Card.Body>
                            <Row>
                                <Form.Group as={Col} controlId="formNom" className="mb-3" xs={12} sm={6} md={3}>
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control 
                                        type="text" name="nom"
                                        value={nom}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Le nom de l'abonné" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formPrenom" className="mb-3" xs={12} sm={6} md={3}>
                                    <Form.Label>Prenom</Form.Label>
                                    <Form.Control 
                                        type="text" name="prenom"
                                        value={prenom}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Le prenom de l'abonné" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formEmail" className="mb-3" xs={12} sm={12} md={6}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" name="email"
                                        value={email}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="L'email de l'abonné" required />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formTel" className="mb-3" xs={12} sm={12} md={4}>
                                    <Form.Label>Numéro de Télephone</Form.Label>
                                    <Form.Control 
                                        type="tel" name="telephone"
                                        value={telephone}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Le numéro de télephonde de l'abonné" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formSexe" className="mb-3" xs={12} sm={6} md={4}>
                                    <Form.Label>Sexe</Form.Label>
                                    <Form.Select 
                                        aria-label="Sexe" name="sexe"
                                        value={sexe?sexe:0}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"}>
                                            <option disabled value={0} key={0}>Choisir le sexe de l'abonné</option>
                                            <option value="homme">Homme</option>
                                            <option value="femme">Femme</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formStatut" className="mb-3" xs={12} sm={6} md={4}>
                                    <Form.Label>Statut</Form.Label>
                                    <Form.Select 
                                        aria-label="Statut" name="statut"
                                        value={statut?statut:0}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"}>
                                            <option disabled value={0} key={0}>Choisir le statut de l'abonné</option>
                                            <option value="actif">Actif</option>
                                            <option value="suspendu">Suspendu</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formAdresse" className="mb-3" xs={12} sm={12} md={12}>
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control
                                        as="textarea" rows={2} name="adresse"
                                        value={adresse}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="L'adresse de l'abonné" required />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formAgence" className="mb-3" xs={12} md={6}>
                                    <Form.Label>Agence</Form.Label>
                                    <Form.Select 
                                        aria-label="Agence" name="agenceId"
                                        value={agenceId?agenceId:0}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"} >
                                            <option disabled value={0} key={0}>Choisir l'agence à associer à cet abonné</option>
                                            {agences.map((agence) => <option key={agence.value} value={agence.value}>{agence.nom}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formBackOffice" className="mb-3" xs={12} md={6}>
                                    <Form.Label>Back Office</Form.Label>
                                    <Form.Select 
                                        aria-label="BackOffice" name="backOfficeId"
                                        value={backOfficeId?backOfficeId:0}
                                        onChange={abonneChange}
                                        className={"border border-warning bg-dark text-white"} >
                                            <option disabled value={0} key={0}>Choisir le back office à associer à cet abonné</option>
                                            {backOffices.map((backoffice) => <option key={backoffice.value} value={backoffice.value}>{backoffice.nom +" "+backoffice.prenom}</option>)}
                                    </Form.Select>
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