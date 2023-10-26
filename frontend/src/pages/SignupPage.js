import React, { useState } from 'react';
import Body from '../components/Body';
import SignUpForm from '../components/SignUpForm';
import { useApi } from '../contexts/ApiProvider';
import { useNavigate } from 'react-router-dom';
import AlertComponent from '../components/AlertComponent';
import { Link } from 'react-router-dom';


export default function SignUpPage() {
    const { fetchRequest } = useApi();
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('danger');

    const handleSignUp = async (event) => {
        event.preventDefault();

        const username = event.target[0].value;
        const password = event.target[1].value;
        const confirmPassword = event.target[2].value;

        if (password !== confirmPassword) {
            setAlertVariant('danger');
            setAlertMessage("Passwords do not match!");
            setShowAlert(true);
            return;
        }

        try {
            const response = await fetchRequest('/signup', 'POST', { username, password });

            if (response.status === 201) {
                navigate('/login', { state: { fromSignup: true } });
            } else if (response.status === 409) {
                setAlertVariant('danger');
                setAlertMessage(<span>Username already taken. Do you want to <Link to="/login">login</Link> instead?</span>);
                setShowAlert(true);
            } else {
                setAlertVariant('danger');
                setAlertMessage(response.data.message || 'Failed to register. Please try again later.');
                setShowAlert(true);
            }
        } catch (error) {
            setAlertVariant('danger');
            setAlertMessage('An unexpected error occurred. Please try again later.');
            setShowAlert(true);
        }
    };

    return (
        <Body>
            <AlertComponent
                show={showAlert}
                variant={alertVariant}
                message={alertMessage}
                onClose={() => setShowAlert(false)}
            />
            <SignUpForm onSignUp={handleSignUp} />
            <div className="mt-3 text-center">
                Already have an account? <Link to="/login">Login here</Link>
            </div>
        </Body>
    );
}