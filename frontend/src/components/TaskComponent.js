import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Title from './Title';
import TaskActions from './TaskActions';
import { useApi } from '../contexts/ApiProvider';

export default function TaskComponent({ 
    item, 
    listId, 
    onTaskAdded, 
    onTaskDeleted, 
    parentId = null, 
    onCompletionToggle,
    onTaskMoved
}) {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { fetchRequest } = useApi();

    const handleSaveTitle = async (newTitle, endpoint) => {
        try {
            const payload = {
                content: newTitle,
                list_id: listId,
            };

            const response = await fetchRequest(endpoint, 'PUT', payload);

            if (response.status === 200) {
                return response;
            } else {
                console.error('Failed to update item title:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while updating item title:', error);
        }
    };

    return (
        <div>
            <Card 
                className={`mb-2 mx-1 shadow-sm ${isHovered ? "hovered-card" : ""}`} 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                    <Title
                        initialTitle={item.content}
                        onSave={(newTitle) => handleSaveTitle(newTitle, `/items/${item.id}`)}
                        className="flex-grow-1 mr-2 text-break"
                    />
                    <div className="d-flex align-items-center">
                        {isHovered && (
                            <TaskActions 
                                itemId={item.id}
                                listId={listId}
                                depth={item.depth}
                                parentId={parentId}  
                                onTaskDeleted={onTaskDeleted} 
                                onTaskAdded={(newSubitem) => onTaskAdded(newSubitem, item.id)}
                                isComplete={item.is_complete}
                                onCompletionToggle={(itemId, status) => {
                                    onCompletionToggle(itemId, status);
                                }}
                                onTaskMoved={onTaskMoved}
                            />
                        )}

                        {item.children && item.children.length > 0 && (
                            <Button
                                variant="link"
                                onClick={() => setShowSubtasks(!showSubtasks)}
                                className="ml-2 p-0"
                            >
                                {showSubtasks ? <BsChevronUp size="20" /> : <BsChevronDown size="20" />}
                            </Button>
                        )}
                    </div>
                </Card.Body>
                {showSubtasks && item.children && item.children.length > 0 && (
                    <div className="ml-4">
                        {item.children.map((child, index) => (
                            <TaskComponent 
                                key={child.id}
                                item={child} 
                                listId={listId} 
                                onTaskAdded={onTaskAdded} 
                                onTaskDeleted={onTaskDeleted}
                                parentId={item.id}
                                onCompletionToggle={onCompletionToggle}
                                onTaskMoved={onTaskMoved}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
