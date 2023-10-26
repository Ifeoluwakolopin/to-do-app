import React from 'react';
import { Card, Container } from 'react-bootstrap';

export default function Body({ children }) {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ maxWidth: '40rem', width: '100%', padding: '50px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
                <Card.Body>
                    {children}
                </Card.Body>
            </Card>
        </Container>
    );
}