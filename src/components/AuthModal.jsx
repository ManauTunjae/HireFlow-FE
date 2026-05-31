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

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (isRegister) {
                setError("Registration coming soon, try Log In instead!")
                setLoading(false);
                return;
            }

            const result = await login(formData.email, formData.password);

            if (result.success) {
                onclose();
                // Just nu skickar vi dem till /dashboard, men i framtiden kan vi lägga en if-sats här:
                // if (user.role === 'candidate') { navigate('/candidate-dashboard') }
                navigate("/dashboard");
            } else {
                setError(result.message || "Invalid credential!")
            }
        } catch (error) {
            setError("Something wentwrong. Please try again.")
        } finally {
            setLoading(false);
        }
    };

    return (

    )
}

export default AuthModal;