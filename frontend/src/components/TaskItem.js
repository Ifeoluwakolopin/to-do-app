import React, { useState, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import TaskActions from './TaskActions';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Title from './Title'; // Import the Title component
import { useApi } from '../contexts/ApiProvider'; // Import the API context

export default function TaskItem({ item, listId }) {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const { fetchRequest } = useApi(); // Use the fetchRequest function from the API context

    // Function to handle saving the title
    const handleSaveTitle = async (newTitle, endpoint) => {
        try {
            const payload = {
                content: newTitle,
                list_id: listId,
            };

            const response = await fetchRequest(endpoint, 'PUT', payload);

            if (response.status === 200) {
                // Title saved successfully, you can handle any additional logic here
                return response;
            } else {
                console.error('Failed to update task title:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while updating task title:', error);
        }
    };

    return (
        <>
            <Card className="mb-2 mx-1 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                    <Title
                        initialTitle={item.content}
                        onSave={(newTitle) => handleSaveTitle(newTitle, `/items/${item.id}`)}
                    />
                    <div className="d-flex align-items-center">
                        <TaskActions subtasks={item.children} />
                        {item.children && item.children.length > 0 && (
                            <Button
                                variant="link"
                                onClick={() => setShowSubtasks(!showSubtasks)}
                                className="ml-2 p-0"
                            >
                                {showSubtasks ? (
                                    <BsChevronUp size="20" />
                                ) : (
                                    <BsChevronDown size="20" />
                                )}
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {showSubtasks && item.children && item.children.length > 0 && (
                item.children.map((child) => (
                    <div key={child.id} className="ml-4">
                        <Card className="mb-2 mx-2 shadow-sm">
                            <Card.Body className="d-flex justify-content-between align-items-center py-2">
                                <Title
                                    initialTitle={child.content}
                                    onSave={(newTitle) => handleSaveTitle(newTitle, `/items/${child.id}`)}
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