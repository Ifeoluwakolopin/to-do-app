import React, { useState } from 'react';
import AddTask from '../tasks/AddTask';
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import { FaPlusCircle } from 'react-icons/fa'; // Using a more prominent "plus" icon

export default function AddTaskButton({ listId, itemId, onTaskAdded }) {
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const isFromTask = !!itemId; // Check if itemId is provided
    const tooltipText = isFromTask ? "Add Sub-Task" : "Add Task";

    return (
        <div>
            <OverlayTrigger overlay={<Tooltip id="tooltip-add">{tooltipText}</Tooltip>}>
                <Button 
                    variant="link" 
                    className="btn-sm p-0 text-decoration-none mr-3" 
                    onClick={() => setShowModal(true)}
                >
                    <FaPlusCircle size={18} color="#0056b3" /> {/* Increased size and changed to a more prominent icon */}
                </Button>
            </OverlayTrigger>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{tooltipText}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTask
                        listId={listId}
                        parentId={itemId}
                        onTaskAdded={onTaskAdded}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
}
