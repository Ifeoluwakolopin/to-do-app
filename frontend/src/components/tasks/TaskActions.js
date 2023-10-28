import React from 'react';
import { Container } from 'react-bootstrap'; 

// Import the button components
import AddTaskButton from '../buttons/AddTaskButton';
import DeleteTaskButton from '../buttons/DeleteTaskButton';
import MoveTaskButton from '../buttons/MoveTaskButton';

export default function TaskActions({ 
    itemId, 
    listId, 
    parentId = null, 
    depth, 
    onTaskAdded, 
    onTaskDeleted,
    onTaskMoved
}) {

    const handleTaskMoved = (taskId, targetListId) => {
        // Bubble up the event
        if (onTaskMoved) {
            onTaskMoved(taskId, targetListId);
        }
    };

    return (
        <Container className="d-flex justify-content-between align-items-center"> 
            {depth < 3 && (
                <AddTaskButton 
                    listId={listId}
                    itemId={itemId}
                    onTaskAdded={onTaskAdded}
                    className="mr-3"  // Added spacing
                />
            )}

            <MoveTaskButton 
                taskId={itemId}
                currentListId={listId}
                onTaskMoved={handleTaskMoved}
                className="mr-3"  // Added spacing
            />

            <DeleteTaskButton 
                itemId={itemId}
                parentId={parentId}
                onTaskDeleted={onTaskDeleted}
            />
        </Container>
    );
}
