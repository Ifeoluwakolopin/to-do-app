import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import AddTask from './AddTask';
import { useApi } from '../contexts/ApiProvider';

export default function TaskActions({ taskId, listId, onTaskAdded }) {
    const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
    const { fetchRequest } = useApi();

    const handleOpenAddSubtaskModal = () => setShowAddSubtaskModal(true);
    const handleCloseAddSubtaskModal = () => setShowAddSubtaskModal(false);

    const handleDeleteTask = async () => {
        try {
            const response = await fetchRequest(`/items/${taskId}`, 'DELETE');

            if (response.status === 200) {
                // Task deleted successfully. (Handle accordingly, like removing from list)
                console.log('Task deleted successfully');
            } else {
                console.error('Failed to delete task:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="d-flex justify-content-end">
            <OverlayTrigger overlay={<Tooltip id="tooltip-add">Add Sub-Task</Tooltip>}>
                <Button variant="link" className="btn-sm p-0 text-decoration-none mr-2" onClick={handleOpenAddSubtaskModal}>
                    <FaPlus size={10} />
                </Button>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip id="tooltip-delete">Delete Task</Tooltip>}>
                <Button variant="link" className="btn-sm p-0 text-decoration-none mr-2" onClick={handleDeleteTask}>
                    <BsTrash />
                </Button>
            </OverlayTrigger>

            <Modal show={showAddSubtaskModal} onHide={handleCloseAddSubtaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Sub-Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTask
                        listId={listId}
                        parentId={taskId} // Pass taskId as parentId
                        onTaskAdded={onTaskAdded}
                        onClose={handleCloseAddSubtaskModal}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddSubtaskModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
