import React, { useState } from 'react';
import { Button, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useApi } from '../../contexts/ApiProvider';
import { FaShare } from 'react-icons/fa';

export default function MoveTaskButton({ taskId, currentListId, onTaskMoved }) {
    const [lists, setLists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { fetchRequest } = useApi();

    const fetchLists = async () => {
        setIsLoading(true);
        try {
            const response = await fetchRequest('/lists', 'GET');
            if (response.status === 200) {
                const availableLists = response.data.filter(list => list.id !== currentListId);
                setLists(availableLists);
            }
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
        setIsLoading(false);
    };

    const handleShowModal = async () => {
        await fetchLists();
        setShowModal(true);
    };

    const handleMoveTask = async (targetListId) => {
        try {
            const response = await fetchRequest(`/move_item/${taskId}`, 'PUT', { new_list_id : targetListId });
            if (response.status === 200) {
                onTaskMoved(taskId, targetListId);
                console.log('Task moved successfully');
                setShowModal(false);
            } else {
                console.error('Failed to move task:', response.data.message);
            }
        } catch (error) {
            console.error('Error moving task:', error);
        }
    };

    return (
        <>
            <OverlayTrigger
                overlay={<Tooltip id="move-tooltip">Move Task</Tooltip>}
            >
                <Button variant="link" onClick={handleShowModal}>
                    <FaShare />
                </Button>
            </OverlayTrigger>

            <Modal show={!isLoading && showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Move Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {lists.map(list => (
                        <Button 
                            variant="outline-primary"  // Change to blue outline
                            key={list.id} 
                            onClick={() => handleMoveTask(list.id)}
                            className="d-block mb-2 w-100"
                        >
                            {list.title}
                        </Button>
                    ))}
                </Modal.Body>
            </Modal>
        </>
    );
}