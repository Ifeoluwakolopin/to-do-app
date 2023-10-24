// src/components/Footer.js

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
    const currentYear = new Date().getFullYear();  // Get the current year

    return (
        <Container fluid className="bg-dark text-white py-1 mt-1 mb-0">
            <Row className="justify-content-center">
                <Col md={6} className="text-center">
                    <p>&copy; {currentYear} IfeoluwakolopinAre. All Rights Reserved.</p>
                </Col>
            </Row>
        </Container>
    );
}
