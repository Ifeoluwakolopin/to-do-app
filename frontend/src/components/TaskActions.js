import React from 'react';
import { Container } from 'react-bootstrap'; 

// Import the button components
import AddTaskButton from './actions/AddTaskButton';
import CompleteTaskButton from './actions/CompleteTaskButton';
import DeleteTaskButton from './actions/DeleteTaskButton';
import MoveTaskButton from './actions/MoveTaskButton';

export default function TaskActions({ 
    itemId, 
    listId, 
    parentId = null, 
    depth, 
    onTaskAdded, 
    onTaskDeleted, 
    isComplete, 
    onCompletionToggle,
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

            <CompleteTaskButton 
                isComplete={isComplete}
                onCompletionToggle={(itemId, status) => {
                    console.log("CompleteTaskButton's onCompletionToggle called");
                    onCompletionToggle(itemId, status);
                }}
                itemId={itemId}
                className="mr-3"  
            />

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
