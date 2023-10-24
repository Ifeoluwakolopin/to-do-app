import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
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

    return (
        // Remove padding from the Container
        <Container fluid className="h-100 d-flex flex-column justify-content-center align-items-center no-padding">
            <Row className="mb-4">
                {/* Remove padding from the Col */}
                <Col xs={12} md={7} className="no-padding">
                    <animated.img
                        src="/LandingPageImage.png" 
                        alt="Creative To-Do List"
                        style={{ ...fadeIn, maxWidth: '100%', height: 'auto' }}
                    />
                </Col>

                <Col xs={12} md={5} className="d-flex flex-column justify-content-center align-items-center">
                    <h1>Welcome to Hierarchical To-Do!</h1>
                    <p>
                        Organize your tasks and sub-tasks with ease.
                    </p>
                    <Button variant="primary" onClick={handleGetStartedClick} style={{ width: 'auto' }}>
                        Get Started
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}