import React from 'react';
import AddTaskButton from './actions/AddTaskButton'; // adjust path if needed
import DeleteListButton from './actions/DeleteListButton'; // adjust path if needed

export default function ListActions({ listId, onTaskAdded, onListDeleted }) {
    return (
        <div className="d-flex justify-content-end">
            <div className="mr-3">
                <AddTaskButton listId={listId} onTaskAdded={onTaskAdded} />
            </div>
            <DeleteListButton listId={listId} onListDeleted={onListDeleted} />
        </div>
    );
}
