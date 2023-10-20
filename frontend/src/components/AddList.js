import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

export default function AddList() {
    return (
        <div className="add-list mt-4">
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4} className="d-flex">
                    <Form.Control 
                        type="text" 
                        placeholder="Add a new list..." 
                        className="me-2"  // adds margin to the right of the element
                    />
                    <Button variant="outline-secondary">
                        <FaPlus />
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
