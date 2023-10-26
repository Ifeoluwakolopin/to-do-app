import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const fadeIn = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        delay: 500
    });

    const handleGetStartedClick = () => {
        navigate("/signup");
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div style={{ 
            position: 'relative', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh'  // set height to 100% of the viewport height
        }}>
            {/* Image section */}
            <animated.img
                src="/landingpage.png"
                alt="Creative To-Do List"
                style={{ ...fadeIn, width: '100%', maxWidth: '100vw', objectFit: 'cover' }}
            />

            {/* Text and button overlay */}
            <Container style={{
                position: 'absolute',
                bottom: '10%',
                textAlign: 'center',
                backdropFilter: 'blur(5px)', // Add a slight blur to the backdrop
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white backdrop
                borderRadius: '10px',
                padding: '20px'
            }}>
                <h1 style={{
                    color: 'black', 
                    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.7)', 
                    fontWeight: 'bold' // Increase font weight
                }}>
                    Welcome to Hierarchical To-Do!
                </h1>
                <p style={{
                    color: 'black', 
                    textShadow: '1px 1px 3px rgba(255, 255, 255, 0.7)'
                }}>
                    Organize your tasks and sub-tasks with ease.
                </p>
                {/* Adjust button styles for side-by-side display */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button variant="primary" onClick={handleGetStartedClick} style={{ fontSize: '1.5em', padding: '10px 30px' }}>
                        Get Started
                    </Button>
                    <Button variant="secondary" onClick={handleLoginClick} style={{ fontSize: '1.5em', padding: '10px 30px' }}>
                        Login
                    </Button>
                </div>
            </Container>
        </div>
    );
}