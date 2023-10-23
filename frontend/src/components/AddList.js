import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useApi } from '../contexts/ApiProvider';
import AlertComponent from '../components/Alert';

export default function AddList() {
    const { fetchRequest } = useApi();
    const [title, setTitle] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('danger');

    const handleAddList = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setAlertMessage("Please enter a title for the new list.");
            setShowAlert(true);
            return;
        }

        try {
            const response = await fetchRequest('/add_list', 'POST', { title });

            if (response.status === 201) {
                setTitle('');  // Clear the input field
                setAlertVariant('success');
                setAlertMessage('New list added successfully!');
                setShowAlert(true);
            } else {
                setAlertVariant('danger');
                setAlertMessage(response.data.message || 'Failed to add the list. Please try again.');
                setShowAlert(true);
            }
        } catch (error) {
            setAlertVariant('danger');
            setAlertMessage('An error occurred. Please try again later.');
            setShowAlert(true);
        }
    };

    return (
        <div className="add-list mt-4">
            <AlertComponent
                show={showAlert}
                message={alertMessage}
                variant={alertVariant}
                onClose={() => setShowAlert(false)}
            />
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4} className="d-flex">
                    <Form.Control 
                        type="text" 
                        placeholder="Add a new list..." 
                        className="me-2"  // adds margin to the right of the element
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={handleAddList}>
                        <FaPlus />
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
