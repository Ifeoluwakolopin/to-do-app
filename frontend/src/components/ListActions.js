import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import AddTask from './AddTask';
import { useApi } from '../contexts/ApiProvider';

export default function ListActions({ listId, onTaskAdded, onListDeleted }) {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const { fetchRequest } = useApi();

    const handleDeleteList = async () => {
        // Show a confirmation dialog to the user
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this list? This will also delete any tasks left on the list.'
        );

        if (!confirmDelete) {
            // User canceled the delete operation
            return;
        }

        try {
            // Perform the delete_list API request
            const response = await fetchRequest(`/delete_list/${listId}`, 'DELETE');

            if (response.status === 200) {
                // List deleted successfully
                onListDeleted(listId);
                // For example, close the modal if it's open
                setShowAddTaskModal(false);
            } else {
                // Handle error response from the API
                console.error('Failed to delete list:', response.data.message);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('An error occurred:', error);
        }
    };

    const handleOpenAddTaskModal = () => {
        setShowAddTaskModal(true);
    };

    const handleCloseAddTaskModal = () => {
        setShowAddTaskModal(false);
    };

    const handleTaskAdded = (newTask) => {
        // Call the parent's onTaskAdded function to update the ListCard
        onTaskAdded(newTask);
    };

    return (
        <div className="d-flex justify-content-end">
            <OverlayTrigger overlay={<Tooltip id="tooltip-add" style={{ fontSize: '11px' }}>Add Task</Tooltip>}>
                <button
                    className="btn btn-link btn-sm mr-2 icon-link"
                    onClick={handleOpenAddTaskModal}
                >
                    <FaPlus size={12} />
                </button>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip id="tooltip-add" style={{ fontSize: '11px' }}>Delete List</Tooltip>}>
                <button
                    className="btn btn-link btn-sm icon-link"
                    onClick={handleDeleteList}
                >
                    <BsTrash className="icon-trash" />
                </button>
            </OverlayTrigger>

            <Modal show={showAddTaskModal} onHide={handleCloseAddTaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTask
                        listId={listId}
                        onClose={handleCloseAddTaskModal}
                        onTaskAdded={handleTaskAdded} // Pass the function to update ListCard
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddTaskModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
