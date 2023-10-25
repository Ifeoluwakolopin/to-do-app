import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { BsTrash, BsCheckCircle } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import AddTask from './AddTask';
import { useApi } from '../contexts/ApiProvider';

export default function TaskActions({ taskId, listId, parentId = null, depth, onTaskAdded, onTaskDeleted, isComplete, onCompletionToggle }) {
    const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const { fetchRequest } = useApi();

    const handleOpenAddSubtaskModal = () => setShowAddSubtaskModal(true);
    const handleCloseAddSubtaskModal = () => setShowAddSubtaskModal(false);

    const handleTaskCompletion = async () => {
        const url = `/items/${taskId}/complete`;
    
        try {
            const response = await fetchRequest(url, 'PUT');
    
            if (response.status === 200) {
                console.log('Task toggled successfully');
                onCompletionToggle(taskId);  // Notify the parent of the change
            } else {
                console.error('Failed to toggle task status:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleDeleteTaskClick = async () => {
        if (!deleteConfirmation) {
            setDeleteConfirmation(true);
            return;
        }

        const url = parentId ? `/items/${taskId}?parent_id=${parentId}` : `/items/${taskId}`;

        try {
            const response = await fetchRequest(url, 'DELETE');

            if (response.status === 200) {
                console.log('Task deleted successfully');
                onTaskDeleted(taskId);
            } else {
                console.error('Failed to delete task:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

        setDeleteConfirmation(false);
    };

    return (
        <div className="d-flex justify-content-end">
            <OverlayTrigger overlay={<Tooltip id="tooltip-complete">{isComplete ? "Mark as Incomplete" : "Mark as Complete"}</Tooltip>}>
                <Button variant="link" className="btn-sm p-0 text-decoration-none mr-3" onClick={handleTaskCompletion}>
                    <BsCheckCircle size={16} color={isComplete ? "#0056b3" : "#b0c4de"} /> {/* Deep blue for completed, light blue for incomplete */}
                </Button>
            </OverlayTrigger>

            {depth < 3 && (
                <OverlayTrigger overlay={<Tooltip id="tooltip-add">Add Sub-Task</Tooltip>}>
                    <Button variant="link" className="btn-sm p-0 text-decoration-none mr-3" onClick={handleOpenAddSubtaskModal}>
                        <FaPlus size={10} color="#0056b3" /> {/* Standard blue for icons */}
                    </Button>
                </OverlayTrigger>
            )}

            <OverlayTrigger 
                overlay={<Tooltip id="tooltip-delete">{deleteConfirmation ? "Confirm Delete?" : "Delete Task"}</Tooltip>}
            >
                <Button 
                    variant="link" 
                    className={`btn-sm p-0 text-decoration-none ${deleteConfirmation ? "text-danger" : ""}`} 
                    onClick={handleDeleteTaskClick}
                    onMouseLeave={() => setDeleteConfirmation(false)}
                >
                    <BsTrash color="#0056b3" /> {/* Standard blue for icons */}
                </Button>
            </OverlayTrigger>

            <Modal show={showAddSubtaskModal} onHide={handleCloseAddSubtaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Sub-Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTask
                        listId={listId}
                        parentId={taskId} 
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
