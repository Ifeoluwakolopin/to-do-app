import { useState } from 'react';
import AddTask from '../AddTask'; 
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa'; 

export default function AddTaskButton({ listId, itemId, onTaskAdded }) {
    const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);

    const isFromTask = !!itemId; // Check if itemId is provided
    const tooltipText = isFromTask ? "Add Sub-Task" : "Add Task";
    const modalTitle = isFromTask ? "Add Sub-Task" : "Add Task";

    const handleOpenAddSubtaskModal = () => setShowAddSubtaskModal(true);
    const handleCloseAddSubtaskModal = () => setShowAddSubtaskModal(false);

    return (
        <>
            <OverlayTrigger overlay={<Tooltip id="tooltip-add">{tooltipText}</Tooltip>}>
                <Button variant="link" className="btn-sm p-0 text-decoration-none mr-3" onClick={handleOpenAddSubtaskModal}>
                    <FaPlus size={10} color="#0056b3" />
                </Button>
            </OverlayTrigger>

            <Modal show={showAddSubtaskModal} onHide={handleCloseAddSubtaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTask
                        listId={listId}
                        parentId={itemId} 
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
        </>
    );
}
