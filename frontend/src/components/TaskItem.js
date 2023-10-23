import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import TaskActions from './TaskActions'; 
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Title from './Title'; // Import the Title component
import { useApi } from '../contexts/ApiProvider'; // Import the API context

export default function TaskItem({ item, listId }) {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const { fetchRequest } = useApi(); // Use the fetchRequest function from the API context

    const updateTaskTitle = async (newTitle) => {
        try {
            // Include listId in the payload if needed
            const payload = {
                content: newTitle,
                list_id: listId, // Include the listId if necessary
            };
    
            // Make a PUT request to update the task title
            const response = await fetchRequest(`/items/${item.id}`, 'PUT', payload);
    
            if (response.status === 200) {
                // Title updated successfully
            } else {
                // Handle error response from the API
                console.error('Failed to update task title:', response.data.message);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('An error occurred while updating task title:', error);
        }
    };

    return (
        <>
            <Card className="mb-2 mx-1 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                    <Title
                        initialTitle={item.content}
                        onSave={updateTaskTitle} // Pass the updateTaskTitle function
                        endpoint={`/items/${item.id}`} // API endpoint for updating the title
                    />
                    <div className="d-flex align-items-center">
                        <TaskActions subtasks={item.children} />
                        {item.children && item.children.length > 0 && (
                            <Button 
                                variant="link"
                                onClick={() => setShowSubtasks(!showSubtasks)}
                                className="ml-2 p-0">
                                {showSubtasks ? <BsChevronUp size="20" /> : <BsChevronDown size="20" />}
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {showSubtasks && item.children && item.children.length > 0 && (
                item.children.map(child => (
                    <div key={child.id} className="ml-4">
                        <Card className="mb-2 mx-2 shadow-sm">
                            <Card.Body className="d-flex justify-content-between align-items-center py-2">
                                <Title
                                    initialTitle={child.content}
                                    onSave={(newTitle) => updateTaskTitle(newTitle, child.id)} // Pass the updateTaskTitle function
                                    endpoint={`/items/${child.id}`} // API endpoint for updating the title
                                />
                                <div className="d-flex align-items-center">
                                    <TaskActions subtasks={child.children} />
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))
            )}
        </>
    );
}
