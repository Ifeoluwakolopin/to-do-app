import React from 'react';

// Import the new button components
import AddTaskButton from './actions/AddTaskButton';
import CompleteTaskButton from './actions/CompleteTaskButton';
import DeleteTaskButton from './actions/DeleteTaskButton';

export default function TaskActions({ 
    itemId, 
    listId, 
    parentId = null, 
    depth, 
    onTaskAdded, 
    onTaskDeleted, 
    isComplete, 
    onCompletionToggle 
}) {

    return (
        <div className="d-flex justify-content-end">
            <CompleteTaskButton 
                isComplete={isComplete}
                onCompletionToggle={onCompletionToggle}
                itemId={itemId}
            />

            {depth < 3 && (
                <AddTaskButton 
                    listId={listId}
                    itemId={itemId}
                    onTaskAdded={onTaskAdded}
                />
            )}

            <DeleteTaskButton 
                itemId={itemId}
                parentId={parentId}
                onTaskDeleted={onTaskDeleted}
            />
        </div>
    );
}