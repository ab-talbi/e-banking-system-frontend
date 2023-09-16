import React from "react";
import {useNavigate} from "react-router-dom"
import { Button } from "react-bootstrap";

export default function PageNotFound(){

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    
    return (
        <div className="d-flex align-items-center justify-content-center vh-50">
            <div className="text-center text-white">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead">
                    La page que vous recherchez n’existe pas.
                </p>
                <Button onClick={handleGoBack} variant="outline-danger">Revenir à la page précedente</Button>
            </div>
        </div>
    ); 
}