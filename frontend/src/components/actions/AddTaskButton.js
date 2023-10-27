import { useState } from 'react';
import AddTask from '../AddTask'; 
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa'; 



export default function AddTaskButton({ listId, itemId, onTaskAdded }) {
    const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);

    const handleOpenAddSubtaskModal = () => setShowAddSubtaskModal(true);
    const handleCloseAddSubtaskModal = () => setShowAddSubtaskModal(false);

    return (
        <>
            <OverlayTrigger overlay={<Tooltip id="tooltip-add">Add Sub-Task</Tooltip>}>
                <Button variant="link" className="btn-sm p-0 text-decoration-none mr-3" onClick={handleOpenAddSubtaskModal}>
                    <FaPlus size={10} color="#0056b3" />
                </Button>
            </OverlayTrigger>

            <Modal show={showAddSubtaskModal} onHide={handleCloseAddSubtaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Sub-Task</Modal.Title>
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
