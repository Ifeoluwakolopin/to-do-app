import React, { useState } from 'react';
import Body from '../components/Body';
import SignUpForm from '../components/SignUpForm';
import { useApi } from '../contexts/ApiProvider';
import { useNavigate } from 'react-router-dom';
import AlertComponent from '../components/Alert';

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

        const user = {
            username,
            password
        };

        try {
            const response = await fetchRequest('/signup', 'POST', user);

            if (response.status === 201) {
                navigate('/login', { state: { fromSignup: true } });
            } else if (response.status === 409) {
                setAlertVariant('danger');
                setAlertMessage('Username already taken. Do you want to login instead?');
                setShowAlert(true);
            } else {
                setAlertVariant('danger');
                setAlertMessage(response.message || 'Failed to register. Please try again later.');
                setShowAlert(true);
            }

        } catch (error) {
                // Handle unexpected issues
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
        </Body>
    );
}