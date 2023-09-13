import React, {Component} from "react";
import { Button } from "react-bootstrap";

export default class PageNotFound extends Component{
    render(){
        return (
            <div className="d-flex align-items-center justify-content-center vh-50">
                <div className="text-center text-white">
                    <h1 className="display-1 fw-bold">404</h1>
                    <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                    <p className="lead">
                        La page que vous recherchez n’existe pas.
                    </p>
                    <Button href="/" variant="outline-danger">Revenir à la page d'acceuil</Button>
                </div>
            </div>
        );
    }
}