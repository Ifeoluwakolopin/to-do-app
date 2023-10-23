// ListActions.js
import React, { useState } from 'react';
import { BsPlus, BsTrash } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import AddTask from './AddTask';
import { useApi } from '../contexts/ApiProvider';

export default function ListActions({ onDelete, listId }) {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);

    const { fetchRequest } = useApi();

    const handleDeleteList = async () => {
        try {
            // Perform the delete_list API request
            const response = await fetchRequest(`/delete_list/${listId}`, 'DELETE');

            if (response.status === 200) {
                // List deleted successfully, you can handle this as needed
                // For example, close the modal if it's open
                setShowAddTaskModal(false);

                // Call the onDelete function passed as a prop
                onDelete();
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

    return (
        <div className="d-flex justify-content-end">
            <OverlayTrigger overlay={<Tooltip id="tooltip-add">Add Task</Tooltip>}>
                <button
                    className="btn btn-link btn-sm mr-2 icon-link"
                    onClick={handleOpenAddTaskModal}
                >
                    <BsPlus className="icon-plus" />
                </button>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip id="tooltip-delete">Delete List</Tooltip>}>
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
                        listId={listId} // Pass the listId to AddTask
                        onClose={handleCloseAddTaskModal}
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