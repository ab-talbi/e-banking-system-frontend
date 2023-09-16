import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare, faUndo} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "./MessageToast";
import PageNotFound from "./PageNotFound";

import { useParams } from "react-router-dom";

import axios from "axios";

const GET_ET_UPDATE_OFFRE_REST_API_URL = 'http://localhost:8089/api/offres/';

export default function Offre(){

    const {id} = useParams();
    const [offre, setOffre] = useState({
        id: '',
        libelle: '',
        description: ''
    });
    const [show, setShow] = useState(false);
    const [found, setFound] = useState(false);
    const [successOuDanger, setSuccessOuDanger] = useState('success');

    useEffect(() => {
        if(/^\d+$/.test(id) && parseInt(id) >= 1){
            trouverUnOffreById(id);
        }else{
            setFound(false);
        }     
    }, [id]);
    
    const trouverUnOffreById = (id) => {
        axios.get(GET_ET_UPDATE_OFFRE_REST_API_URL+id)
            .then(response => {

                if(response.data != null){
                    setOffre({
                        id : id,
                        libelle : response.data.libelle,
                        description : response.data.description
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

    const modifierOffre = (e) => {

        e.preventDefault();

        axios.put(GET_ET_UPDATE_OFFRE_REST_API_URL+offre.id,offre)
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

    const offreChange = e => {
        setOffre({
            ...offre,
            [e.target.name]: e.target.value}
        );
    };

    const resetOffre = () => {
        trouverUnOffreById(id);
    };

    const {libelle, description} = offre;
    const message = successOuDanger === 'success' ? "L'offre est modifié avec succés" : successOuDanger;

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
                    <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Modifier l'offre de l'id : {}</Card.Header>
                    <Form onReset={resetOffre} onSubmit={e => modifierOffre(e)} id="offreFormId" className="form-control border border-dark bg-dark text-white">
                        <Card.Body>
                            <Row>
                                <Form.Group as={Col} controlId="formLibelle" className="mb-3" xs={12} md={4}>
                                    <Form.Label>Libellé</Form.Label>
                                    <Form.Control 
                                        type="text" name="libelle" autoComplete="off"
                                        value={libelle} onChange={offreChange}
                                        className={"border border-warning bg-dark text-white"}
                                        placeholder="Libellé de l'offre" required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formDescription" className="mb-3" xs={12} md={8}>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea" rows={3} name="description" autoComplete="off"
                                        value={description} onChange={offreChange}
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