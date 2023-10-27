import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useApi } from '../contexts/ApiProvider';
import AlertComponent from '../components/AlertComponent';

export default function AddList({ onListAdded }) {
    const { fetchRequest } = useApi();
    const [title, setTitle] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('danger');

    const handleAddList = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setAlertVariant('warning')
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
    
                // Call the callback passed from HomePage with the newly added list
                if (response.data) {
                    onListAdded(response.data);
                }
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddList(e);
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
    <Col xs={12} md={8} lg={6} className="d-flex">
        <Form.Control 
            type="text" 
            placeholder="Add a new list..." 
            className="me-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            size="lg"
        />
        <Button variant="outline-secondary" onClick={handleAddList}>
            <FaPlus />
        </Button>
    </Col>
</Row>

        </div>
    );
}
