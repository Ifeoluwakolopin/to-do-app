import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
    const navigate = useNavigate();

    // Function to handle button click
    const handleReturnHomeClick = () => {
        navigate("/");
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            {/* Image section */}
            <img
                src="/404.png"  // Replace with the path to the chosen 404 image
                alt="404 Not Found"
                style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
            />

            {/* Text and button overlay */}
            <Container style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                backdropFilter: 'blur(3px)', // Reduced blur
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '10px',
                padding: '20px'
            }}>
                <h1 style={{
                    color: 'black', 
                    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.7)', 
                    fontWeight: 'bold',
                    fontSize: '2em' // Reduced font size
                }}>
                    Oops! Page not found.
                </h1>
                <p style={{
                    color: 'black', 
                    textShadow: '1px 1px 3px rgba(255, 255, 255, 0.7)',
                    fontSize: '1.2em' // Reduced font size
                }}>
                    The page you're looking for might have been removed or is temporarily unavailable.
                </p>
                <Button variant="primary" onClick={handleReturnHomeClick} style={{ fontSize: '1.2em', padding: '8px 24px' }}>  {/* Reduced font size and padding */}
                    Return to Home
                </Button>
            </Container>
        </div>
    );
}
