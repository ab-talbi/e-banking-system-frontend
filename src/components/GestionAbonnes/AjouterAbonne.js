import React, {Component} from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faUndo, faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "../MessageToast";

import axios from "axios";

const CONTRATS_REST_API_URL = 'http://localhost:8089/api/contrats/disponibles';
const CREATE_ABONNE_REST_API_URL = 'http://localhost:8089/api/abonnes';

export default class AjouterAbonne extends Component{

    constructor(props){
        super(props);
        this.state = this.initialState;
        this.abonneChange = this.abonneChange.bind(this);
        this.ajouterAbonne = this.ajouterAbonne.bind(this);
        this.state.contratsOptions = [];
        this.state.agences = [
            { value: "1", nom: "MARRAKECH ABDELKRIM EL KHATABI"},
            { value: "2", nom: "AIN CHOCK"},
            { value: "3", nom: "AGADIR DRARGA"}
          ];
        this.state.backOffices = [
            { value: "1", nom: "El Amrani", prenom: "Amine"},
            { value: "2", nom: "Moussaoui", prenom: "Leila"},
            { value: "3", nom: "Benjelloun", prenom: "Youssef"},
          ];
    }

    initialState = {
        nom:'', 
        prenom:'', 
        email:'', 
        adresse:'', 
        tel:'', 
        sexe:0, 
        statut:0, 
        contratId:0, 
        agenceId:0, 
        backOfficeId:0
    };

    componentDidMount = () => {
        this.getLesContrats();
    };

    getLesContrats = () => {
        axios.get(CONTRATS_REST_API_URL)
            .then((response) => {
                if(response.data !== undefined){
                    const contrats = [];
                    response.data.forEach((contrat) => {
                        const isValueUnique = !contrats.some((obj) => obj.value === contrat.id);
                        if(isValueUnique){
                            contrats.push({ value: contrat.id, intitule: contrat.intitule});
                        }
                    });
                    this.setState({
                        contratsOptions : contrats
                    });
                }
            }).catch(err => {
                console.log(err);
            });
    };

    ajouterAbonne(e){
        e.preventDefault();

        const abonne = {
            nom : this.state.nom,
            prenom : this.state.prenom,
            email : this.state.email,
            adresse : this.state.adresse,
            telephone : this.state.tel,
            statut : this.state.statut === 0 ? 'suspendu' : this.state.statut,
            sexe : this.state.sexe === 0 ? 'homme' : this.state.sexe,
            contratId : this.state.contratId === 0 ? null : this.state.contratId,
            agenceId : this.state.agenceId === 0 ? null : this.state.agenceId,
            backOfficeId : this.state.backOfficeId === 0 ? null : this.state.backOfficeId,
        }

        axios.post(CREATE_ABONNE_REST_API_URL,abonne)
            .then(response => {
                if(response.data != null){
                    console.log(response.data);
                    this.resetAbonne()
                    this.setState({'show':true});
                    this.setState({'successOuDanger':'success'});
                    setTimeout(()=>this.setState({'show':false}), 5000)
                    
                    this.getLesContrats();
                }else{
                    this.setState({'show':false});
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
                this.setState({'show':true});
                this.setState({'successOuDanger':message});
                setTimeout(()=>this.setState({'show':false}), 5000)
            })
    }

    resetAbonne = () => {
        this.setState(
            { 
                nom:'', 
                prenom:'', 
                email:'', 
                adresse:'', 
                tel:'', 
                sexe:0, 
                statut:0, 
                contratId:0, 
                agenceId:0, 
                backOfficeId:0 
            }
        )
    };

    abonneChange(e) {
        if(e.target.name === "contratId" || e.target.name === "agenceId" || e.target.name === "backOfficeId"){
            e.target.value = Number(e.target.value)
        }
        this.setState({[e.target.name]: e.target.value});
    }

    render(){

        const {nom, prenom, email, adresse, tel, sexe, statut, contratId, agenceId, backOfficeId} = this.state;
        const show = this.state.show;
        const successOuDanger = this.state.successOuDanger;
        const message = successOuDanger === 'success' ? "L'abonné est enregistré avec succés" : successOuDanger;

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
                    <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Ajouter un Abonné</Card.Header>
                    <Form onReset={this.resetAbonne} onSubmit={this.ajouterAbonne} id="abonneFormId" className="form-control border border-dark bg-dark text-white">
                        <Card.Body>
                            <Row>
                                <Form.Group as={Col} controlId="formNom" className="mb-3" xs={12} sm={6} md={3}>
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control 
                                        type="text" name="nom"
                                        value={nom}
                                        onChange={this.abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Le nom de l'abonné" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formPrenom" className="mb-3" xs={12} sm={6} md={3}>
                                    <Form.Label>Prenom</Form.Label>
                                    <Form.Control 
                                        type="text" name="prenom"
                                        value={prenom}
                                        onChange={this.abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Le prenom de l'abonné" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formEmail" className="mb-3" xs={12} sm={12} md={6}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" name="email"
                                        value={email}
                                        onChange={this.abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="L'email de l'abonné" required />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formTel" className="mb-3" xs={12} sm={12} md={4}>
                                    <Form.Label>Numéro de Télephone</Form.Label>
                                    <Form.Control 
                                        type="tel" name="tel"
                                        value={tel}
                                        onChange={this.abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Le numéro de télephonde de l'abonné" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formSexe" className="mb-3" xs={12} sm={6} md={4}>
                                    <Form.Label>Sexe</Form.Label>
                                    <Form.Select 
                                        aria-label="Sexe" name="sexe"
                                        value={sexe?sexe:0}
                                        onChange={this.abonneChange}
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
                                        onChange={this.abonneChange}
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
                                        onChange={this.abonneChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="L'adresse de l'abonné" required />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formContrat" className="mb-3" xs={12} md={4}>
                                    <Form.Label>Contrat</Form.Label>
                                    <Form.Select 
                                        aria-label="Contrat" name="contratId"
                                        value={contratId?contratId:0}
                                        onChange={this.abonneChange}
                                        className={"border border-warning bg-dark text-white"} >
                                            <option disabled value={0} key={0}>Choisir le contrat à associer à cet abonné</option>
                                            {this.state.contratsOptions.map((contrat) => <option key={contrat.value} value={contrat.value}>{contrat.intitule}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formAgence" className="mb-3" xs={12} md={4}>
                                    <Form.Label>Agence</Form.Label>
                                    <Form.Select 
                                        aria-label="Agence" name="agenceId"
                                        value={agenceId?agenceId:0}
                                        onChange={this.abonneChange}
                                        className={"border border-warning bg-dark text-white"} >
                                            <option disabled value={0} key={0}>Choisir l'agence à associer à cet abonné</option>
                                            {this.state.agences.map((agence) => <option key={agence.value} value={agence.value}>{agence.nom}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formBackOffice" className="mb-3" xs={12} md={4}>
                                    <Form.Label>Back Office</Form.Label>
                                    <Form.Select 
                                        aria-label="BackOffice" name="backOfficeId"
                                        value={backOfficeId?backOfficeId:0}
                                        onChange={this.abonneChange}
                                        className={"border border-warning bg-dark text-white"} >
                                            <option disabled value={0} key={0}>Choisir le back office à associer à cet abonné</option>
                                            {this.state.backOffices.map((backoffice) => <option key={backoffice.value} value={backoffice.value}>{backoffice.nom +" "+backoffice.prenom}</option>)}
                                    </Form.Select>
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