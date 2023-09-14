import React, {Component} from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select"
import makeAnimated from "react-select/animated"


export default class AjouterContrat extends Component{

    constructor(props){
        super(props);
        this.state = {intitule:'', statut:'', abonneId:'', offresIds:[]};
        this.contratChange = this.contratChange.bind(this);
        this.ajouterContrat = this.ajouterContrat.bind(this);
        this.contratChangeForMultiSelect = this.contratChangeForMultiSelect.bind(this);
        this.offres = [
            { value: "1", label: "Offre1" },
            { value: "2", label: "Offre2" },
            { value: "3", label: "Offre3" },
            { value: "4", label: "Offre4" }
          ];
        this.abonnes = [
            { value: "1", nom: "Abonne", prenom: "1" },
            { value: "2", nom: "Abonne", prenom: "2" }
          ];
    }

    ajouterContrat(e){
        alert("intitule : "+this.state.intitule+", statut : "+this.state.statut+", abonneId : "+this.state.abonneId+", offresIds : "+this.state.offresIds);
        e.preventDefault();
    }

    contratChange(e) {
        if(e.target.name === "abonneId"){
            e.target.value = Number(e.target.value)
        }
        this.setState({[e.target.name]: e.target.value});
    }

    contratChangeForMultiSelect(selectedOptions){
        const offresIds = [];

        for (const options of selectedOptions) {
            offresIds.push(Number(options.value));
        }

        this.setState({ offresIds : offresIds});
    }

    render(){
        return (
            <Card className={"border border-dark bg-dark text-white"}>
                <Card.Header><FontAwesomeIcon icon={faPlusSquare} /> Ajouter un Contrat</Card.Header>
                <Form onSubmit={this.ajouterContrat} id="contratFormId" className="form-control border border-dark bg-dark text-white">
                    <Card.Body>
                        <Row>
                            <Form.Group as={Col} controlId="formIntitule" className="mb-3" xs={12} md={8}>
                                <Form.Label>Intitulé</Form.Label>
                                <Form.Control 
                                    type="text" name="intitule"
                                    value={this.state.intitule}
                                    onChange={this.contratChange}
                                    className={"border border-warning bg-dark text-white"}
                                    placeholder="L'intitulé du contrat" required />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formStatut" className="mb-3" xs={12} md={4}>
                                <Form.Label>Statut</Form.Label>
                                <Form.Select 
                                    aria-label="Statut" name="statut"
                                    value={this.state.statut?this.state.statut:0}
                                    onChange={this.contratChange}
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
                                    value={this.state.abonneId?this.state.abonneId:0}
                                    onChange={this.contratChange}
                                    className={"border border-warning bg-dark text-white"}
                                    placeholder="Ajouter l'abonné associé" >
                                        <option disabled value={0} key={0}>Choisir l'abonné à associer à cet contrat</option>
                                        {this.abonnes.map((abonne) => <option key={abonne.value} value={abonne.value}>{abonne.nom + " " +abonne.prenom}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" xs={12} md={6}>
                                <Form.Label htmlFor="offresIds">Offres</Form.Label>
                                <Select
                                    inputId="offresIds" name="offresIds"
                                    options={this.offres}
                                    selectedValues={this.state.offresIds}
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
                        <Button size="sm" variant="warning" type="submit">
                            <FontAwesomeIcon icon={faSave} />  Enregistrer
                        </Button>
                    </Card.Footer>
                </Form>
            </Card>
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