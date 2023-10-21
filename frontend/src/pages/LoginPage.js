import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { useLocation, useNavigate } from 'react-router-dom';
import Body from '../components/Body';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthContext';
import AlertComponent from '../components/Alert';

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const { fetchRequest } = useApi();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');

    useEffect(() => {
        if (location.state?.fromSignup) {
            setAlertMessage('Account created successfully. Login now.');
            setAlertVariant('success');
            setShowAlert(true);
        }
    }, [location.state]);

    const handleLogin = async (event) => {
        event.preventDefault();
    
        const username = event.target[0].value;
        const password = event.target[1].value;
        const user = { username, password };
    
        try {
            const response = await fetchRequest('/login', 'POST', user);
    
            if (response.status && response.status === 200) {
                console.log("Logged IN")
                login();
                navigate('/home');
            } else {
                setAlertVariant('danger');
                setAlertMessage(response.message || 'Login failed. Please check your credentials.');
                setShowAlert(true);
            }
        } catch (error) {
            const errorMessage = error.data?.message || 'Failed to login. Please try again later.';
            setAlertVariant('danger');
            setAlertMessage(errorMessage);
            setShowAlert(true);
        }
    };
    
    return (
        <Body>
            <AlertComponent
                show={showAlert}
                message={alertMessage}
                variant={alertVariant}
                onClose={() => setShowAlert(false)}
            />
            <LoginForm onLogin={handleLogin} />
        </Body>
    );
};
