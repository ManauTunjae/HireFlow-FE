import {useState, useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthModal = ({isOpen, OnClose}) => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({email: "", password: ""});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    

    return (

    )
}

export default AuthModal;