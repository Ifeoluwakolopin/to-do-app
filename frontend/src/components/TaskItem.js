import React, { useState, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import TaskActions from './TaskActions'; 
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Title from './Title'; // Import the Title component
import { useApi } from '../contexts/ApiProvider'; // Import the API context

export default function TaskItem({ item, listId }) {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(item.content);
    const inputRef = useRef(null);
    const { fetchRequest } = useApi(); // Use the fetchRequest function from the API context

    const updateTaskTitle = async () => {
        try {
            const payload = {
                content: newTitle,
                list_id: listId,
            };

            const response = await fetchRequest(`/items/${item.id}`, 'PUT', payload);

            if (response.status === 200) {
                setIsEditing(false);
                if (inputRef.current) {
                    inputRef.current.blur();
                }
            } else {
                console.error('Failed to update task title:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while updating task title:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateTaskTitle();
        }
    };

    return (
        <>
            <Card className="mb-2 mx-1 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                    <Title
                        initialTitle={item.content}
                        onSave={updateTaskTitle}
                        endpoint={`/items/${item.id}`}
                        isEditing={isEditing} // Pass isEditing to the Title component
                        setIsEditing={setIsEditing} // Pass setIsEditing to the Title component
                        inputRef={inputRef} // Pass inputRef to the Title component
                        type="task" // Pass the type as "task" to Title
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
                                    onSave={updateTaskTitle}
                                    endpoint={`/items/${child.id}`}
                                    isEditing={isEditing} // Pass isEditing to the Title component
                                    setIsEditing={setIsEditing} // Pass setIsEditing to the Title component
                                    inputRef={inputRef} // Pass inputRef to the Title component
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