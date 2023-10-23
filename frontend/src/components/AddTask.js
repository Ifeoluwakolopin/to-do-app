import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider';

export default function AddTask({ listId, parentId, onTaskAdded }) {
    const { fetchRequest } = useApi();
    const [content, setContent] = useState('');

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            return; // Prevent adding empty tasks
        }

        try {
            const response = await fetchRequest('/items', 'POST', {
                content,
                list_id: listId, // Pass the listId here
                parent_id: parentId,
            });

            if (response.status === 201) {
                setContent(''); // Clear the input field
                onTaskAdded(response.data); // Pass the new task data to the parent component
            } else {
                // Handle error response from the API
                console.error('Failed to add task:', response.data.message);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('An error occurred:', error);
        }
    };

    return (
        <Form onSubmit={handleAddTask}>
            <Form.Group>
                <Form.Control
                    type="text"
                    placeholder="Add a new task..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </Form.Group>
            <div className="mt-2">
                <Button variant="primary" type="submit">
                    Add Task
                </Button>
            </div>
        </Form>
    );
}
