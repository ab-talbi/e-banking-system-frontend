import React, {Component} from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare} from "@fortawesome/free-solid-svg-icons";

export default class AjouterOffre extends Component{

    constructor(props){
        super(props);
        this.state = {libelle:'', description:''};
        this.offreChange = this.offreChange.bind(this);
        this.ajouterOffre = this.ajouterOffre.bind(this);
    }

    ajouterOffre(e){
        alert("Libelle : "+this.state.libelle+", Description : "+this.state.description);
        e.preventDefault();
    }

    offreChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render(){
        return (
            <Card className={"border border-dark bg-dark text-white"}>
                <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Ajouter un Offre</Card.Header>
                <Form onSubmit={this.ajouterOffre} id="offreFormId" className="form-control border border-dark bg-dark text-white">
                    <Card.Body>
                        <Row>
                            <Form.Group as={Col} controlId="formLibelle" className="mb-3" xs={12} md={4}>
                                <Form.Label>Libellé</Form.Label>
                                <Form.Control 
                                    type="text" name="libelle"
                                    value={this.state.libelle}
                                    onChange={this.offreChange}
                                    className={"border border-warning bg-dark text-white"}
                                    placeholder="Libellé de l'offre" required />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formDescription" className="mb-3" xs={12} md={8}>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea" rows={3} name="description"
                                    value={this.state.description}
                                    onChange={this.offreChange}
                                    className={"border border-warning bg-dark text-white"}
                                    placeholder="Description de l'offre" required />
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