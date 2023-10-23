// ListActions.js
import React, { useState } from 'react';
import { BsPlus, BsTrash } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import AddTask from './AddTask';

export default function ListActions({ onDelete, listId }) {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);

    const handleDeleteList = () => {
        onDelete(listId);
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