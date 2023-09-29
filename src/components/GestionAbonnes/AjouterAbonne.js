import React, {Component} from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare} from "@fortawesome/free-solid-svg-icons";

export default class AjouterAbonne extends Component{
    constructor(props){
        super(props);
        this.state = {nom:'', prenom:'', email:'', adresse:'', tel:'', sexe:'', statut:'', contratId:'', agenceId:'', backOfficeId:''};
        this.abonneChange = this.abonneChange.bind(this);
        this.ajouterAbonne = this.ajouterAbonne.bind(this);
        this.contrats = [
            { value: "1", intitule: "Contrat 1"},
            { value: "2", intitule: "Contrat 2"}
          ];
        this.agences = [
            { value: "1", nom: "MARRAKECH ABDELKRIM EL KHATABI"},
            { value: "2", nom: "AIN CHOCK"},
            { value: "3", nom: "AGADIR DRARGA"}
          ];
        this.backOffices = [
            { value: "1", nom: "El Amrani", prenom: "Amine"},
            { value: "2", nom: "Moussaoui", prenom: "Leila"},
            { value: "3", nom: "Benjelloun", prenom: "Youssef"},
          ];
    }

    ajouterAbonne(e){
        alert("nom et prenom : "+this.state.nom + " "+this.state.prenom +", email : "+this.state.email+", adresse : "+this.state.adresse+", tel : "+this.state.tel + ", sexe : "+this.state.sexe + ", statut : "+this.state.statut+", contratId : "+this.state.contratId + ", agenceId : "+this.state.agenceId + ", backOfficeId : "+this.state.backOfficeId);
        e.preventDefault();
    }

    abonneChange(e) {
        if(e.target.name === "contratId" || e.target.name === "agenceId" || e.target.name === "backOfficeId"){
            e.target.value = Number(e.target.value)
        }
        this.setState({[e.target.name]: e.target.value});
    }

    render(){
        return (
            <Card className={"border border-dark bg-dark text-white"}>
                <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Ajouter un Abonné</Card.Header>
                <Form onSubmit={this.ajouterAbonne} id="abonneFormId" className="form-control border border-dark bg-dark text-white">
                    <Card.Body>
                        <Row>
                            <Form.Group as={Col} controlId="formNom" className="mb-3" xs={12} sm={6} md={3}>
                                <Form.Label>Nom</Form.Label>
                                <Form.Control 
                                    type="text" name="nom"
                                    value={this.state.nom}
                                    onChange={this.abonneChange}
                                    className={"border border-warning bg-dark text-white"}
                                    placeholder="Le nom de l'abonné" required />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formPrenom" className="mb-3" xs={12} sm={6} md={3}>
                                <Form.Label>Prenom</Form.Label>
                                <Form.Control 
                                    type="text" name="prenom"
                                    value={this.state.prenom}
                                    onChange={this.abonneChange}
                                    className={"border border-warning bg-dark text-white"}
                                    placeholder="Le prenom de l'abonné" required />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formEmail" className="mb-3" xs={12} sm={12} md={6}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" name="email"
                                    value={this.state.email}
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
                                    value={this.state.tel}
                                    onChange={this.abonneChange}
                                    className={"border border-warning bg-dark text-white"}
                                    placeholder="Le numéro de télephonde de l'abonné" required />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formSexe" className="mb-3" xs={12} sm={6} md={4}>
                                <Form.Label>Sexe</Form.Label>
                                <Form.Select 
                                    aria-label="Sexe" name="sexe"
                                    value={this.state.sexe?this.state.sexe:0}
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
                                    value={this.state.statut?this.state.statut:0}
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
                                    value={this.state.adresse}
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
                                    value={this.state.contratId?this.state.contratId:0}
                                    onChange={this.abonneChange}
                                    className={"border border-warning bg-dark text-white"} >
                                        <option disabled value={0} key={0}>Choisir le contrat à associer à cet abonné</option>
                                        {this.contrats.map((contrat) => <option key={contrat.value} value={contrat.value}>{contrat.intitule}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formAgence" className="mb-3" xs={12} md={4}>
                                <Form.Label>Agence</Form.Label>
                                <Form.Select 
                                    aria-label="Agence" name="agenceId"
                                    value={this.state.agenceId?this.state.agenceId:0}
                                    onChange={this.abonneChange}
                                    className={"border border-warning bg-dark text-white"} >
                                        <option disabled value={0} key={0}>Choisir l'agence à associer à cet abonné</option>
                                        {this.agences.map((agence) => <option key={agence.value} value={agence.value}>{agence.nom}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formBackOffice" className="mb-3" xs={12} md={4}>
                                <Form.Label>Back Office</Form.Label>
                                <Form.Select 
                                    aria-label="BackOffice" name="backOfficeId"
                                    value={this.state.backOfficeId?this.state.backOfficeId:0}
                                    onChange={this.abonneChange}
                                    className={"border border-warning bg-dark text-white"} >
                                        <option disabled value={0} key={0}>Choisir le back office à associer à cet abonné</option>
                                        {this.backOffices.map((backoffice) => <option key={backoffice.value} value={backoffice.value}>{backoffice.nom +" "+backoffice.prenom}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                    </Card.Body>
                    <Card.Footer style={{"textAlign":"right"}}>
                        <Button size="sm" variant="warning" type="submit">
                            <FontAwesomeIcon icon={faSave} />  Enregistrer
                        </Button>
                    </Card.Footer>
                </Form>
            </Card>
        );
    }
}