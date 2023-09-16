import React, {Component} from "react";
import { Toast } from "react-bootstrap";
import {ToastContainer} from "react-bootstrap";

export default class MessageToast extends Component{

    render(){

        const styles={
            zIndex:'1'
        };

        const show = this.props.show;
        const message = this.props.message;
        const header = this.props.header === 'success' ? 'Success' : 'Erreur';
        const classBackground = this.props.header === 'success' ? 'bg-success' : 'bg-danger';

        return (
            <div>
                <ToastContainer
                    className="p-3"
                    position={'bottom-start'}
                    style={show?styles:null} >
                    <Toast className={"border border-warning bg-dark text-white"} show={show}>
                        <Toast.Header className={classBackground + " text-white"} closeButton={false}>
                            <strong className="me-auto">{header}</strong>
                        </Toast.Header>
                        <Toast.Body>
                            {message}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>
        );
    }
}