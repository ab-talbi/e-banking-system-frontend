import React, {Component} from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare, faUndo} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "./MessageToast";

import axios from "axios";

const CREATE_OFFRE_REST_API_URL = 'http://localhost:8089/api/offres';

export default class AjouterOffre extends Component{

    constructor(props){
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.successOuDanger = 'success';
        this.offreChange = this.offreChange.bind(this);
        this.ajouterOffre = this.ajouterOffre.bind(this);
    }

    initialState = {
        libelle: '',
        description: ''
    }

    ajouterOffre = e => {
        e.preventDefault();

        const offre = {
            libelle : this.state.libelle,
            description : this.state.description
        }

        axios.post(CREATE_OFFRE_REST_API_URL,offre)
            .then(response => {
                if(response.data != null){
                    console.log(response.data);
                    this.resetOffre()
                    this.setState({'show':true});
                    this.setState({'successOuDanger':'success'});
                    setTimeout(()=>this.setState({'show':false}), 5000)
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

    offreChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    resetOffre = () => {
        this.setState(() => this.initialState)
    }

    render(){

        const {libelle, description} = this.state;
        const show = this.state.show;
        const successOuDanger = this.state.successOuDanger;
        const message = successOuDanger === 'success' ? "L'offre est enregistré par succés" : successOuDanger;

        return (
            <div>
                <div style={{"display":this.state.show ? 'block' : 'none'}}>
                    <MessageToast children={{show:show, header:successOuDanger, message:message}} />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Ajouter un Offre</Card.Header>
                    <Form onReset={this.resetOffre} onSubmit={this.ajouterOffre} id="offreFormId" className="form-control border border-dark bg-dark text-white">
                        <Card.Body>
                            <Row>
                                <Form.Group as={Col} controlId="formLibelle" className="mb-3" xs={12} md={4}>
                                    <Form.Label>Libellé</Form.Label>
                                    <Form.Control 
                                        type="text" name="libelle" autoComplete="off"
                                        value={libelle} onChange={this.offreChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Libellé de l'offre" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formDescription" className="mb-3" xs={12} md={8}>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea" rows={3} name="description" autoComplete="off"
                                        value={description} onChange={this.offreChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Description de l'offre" required />
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