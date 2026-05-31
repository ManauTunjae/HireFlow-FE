import {useState, useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthModal = ({isOpen, OnClose}) => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    return (

    )
}

export default AuthModal;