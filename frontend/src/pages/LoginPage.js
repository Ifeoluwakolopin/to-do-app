import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { useLocation, useNavigate } from 'react-router-dom';
import Body from '../components/Body';
import { Alert, Container } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { login } = useAuth();

    const [showAlert, setShowAlert] = useState(false);
    const { fetchRequest } = useApi();  // <-- Destructure fetchRequest from the API context

    useEffect(() => {
        if (location.state?.fromSignup) {
            setShowAlert(true);
        }
    }, [location.state]);

    const handleLogin = async (event) => {
        event.preventDefault();

        const username = event.target[0].value;
        const password = event.target[1].value;

        // Create a user object
        const user = {
            username,
            password
        };

        try {
            // Use fetchRequest from ApiProvider to send user details to the server
            const data = await fetchRequest('/login', 'POST', user);

            if (data && data.message === "Logged in successfully") {
                // Handle successful login - Redirect to HomePage
                navigate('/home');
                login();
            } else {
                // Handle failed login attempt
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            // Handle network errors or issues with server response
            alert('Failed to login. Please try again later.');
        }
    };

    return (
        <Body>
            {
                showAlert &&
                <Container className="mb-4">
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                        Account created successfully. Login now.
                    </Alert>
                </Container>
            }
            <LoginForm onLogin={handleLogin} />
        </Body>
    );
};