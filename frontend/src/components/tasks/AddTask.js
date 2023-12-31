import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useApi } from '../../contexts/ApiProvider';
import AlertComponent from '../AlertComponent'; // Step 1: Import AlertComponent

export default function AddTask({ listId, parentId, onTaskAdded }) {
    const { fetchRequest } = useApi();
    const [content, setContent] = useState('');
    const [alertShow, setAlertShow] = useState(false);     // State for alert visibility
    const [alertMessage, setAlertMessage] = useState('');  // State for alert message
    const [alertVariant, setAlertVariant] = useState('');  // State for alert variant

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setAlertVariant('warning');                     // Set the variant to warning
            setAlertMessage('Please enter a task title.');        // Set the appropriate message
            setAlertShow(true);                             // Display the alert
            return; // Prevent adding empty tasks
        }

        try {
            const response = await fetchRequest('/items', 'POST', {
                content,
                list_id: listId,
                parent_id: parentId,
            });

            if (response.status === 201) {
                setContent(''); // Clear the input field
                onTaskAdded(response.data); // Pass the new task data to the parent component
                setAlertVariant('success');                  // Set the variant to success
                setAlertMessage('Task added successfully.'); // Set the appropriate message
                setAlertShow(true);                          // Display the alert
            } else {
                setAlertVariant('error');                    // Set the variant to error
                setAlertMessage(response.data.message || 'Error adding task.'); // Set the error message
                setAlertShow(true);                          // Display the alert
                console.error('Failed to add task:', response.data.message);
            }
        } catch (error) {
            setAlertVariant('error');                       // Set the variant to error
            setAlertMessage('An unexpected error occurred.'); // Set a generic error message
            setAlertShow(true);                             // Display the alert
            console.error('An error occurred:', error);
        }
    };

    return (
        <div>
            <AlertComponent
                show={alertShow}
                variant={alertVariant}
                message={alertMessage}
                onClose={() => setAlertShow(false)}
                small
                style={{ marginBottom: '0px' }} // Adjust this value to your preference
            />
            <Form onSubmit={handleAddTask} style={{ marginTop: '0' }}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Add a new task..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <div className="mt-3">
                    <Button variant="primary" type="submit">
                        Add Task
                    </Button>
                </div>
            </Form>
        </div>
    );
}    
