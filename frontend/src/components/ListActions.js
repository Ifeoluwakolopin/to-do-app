import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import AddTask from './AddTask';
import { useApi } from '../contexts/ApiProvider';

export default function ListActions({ listId, onTaskAdded, onListDeleted }) {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const { fetchRequest } = useApi();

    const handleDeleteList = async () => {
        try {
            const response = await fetchRequest(`/delete_list/${listId}`, 'DELETE');

            if (response.status === 200) {
                onListDeleted(listId);
                setShowAddTaskModal(false);
            } else {
                console.error('Failed to delete list:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleOpenDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(true);
    };

    const handleCloseDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
    };

    const handleOpenAddTaskModal = () => {
        setShowAddTaskModal(true);
    };

    const handleCloseAddTaskModal = () => {
        setShowAddTaskModal(false);
    };

    const handleTaskAdded = (newTask) => {
        onTaskAdded(newTask);
    };

    return (
        <div className="d-flex justify-content-end">
            <OverlayTrigger overlay={<Tooltip id="tooltip-add-task" style={{ fontSize: '11px' }}>Add Task</Tooltip>}>
                <button
                    className="btn btn-link btn-sm mr-2 icon-link"
                    onClick={handleOpenAddTaskModal}
                >
                    <FaPlus size={12} />
                </button>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip id="tooltip-delete-list" style={{ fontSize: '11px' }}>Delete List</Tooltip>}>
                <button
                    className="btn btn-link btn-sm icon-link"
                    onClick={handleOpenDeleteConfirmModal}
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
                        onTaskAdded={handleTaskAdded}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddTaskModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete confirmation modal */}
            <Modal show={showDeleteConfirmModal} onHide={handleCloseDeleteConfirmModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this list? This will also delete any tasks left on the list.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteList}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
