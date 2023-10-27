import React from 'react';
import { useApi } from '../../contexts/ApiProvider';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { BsCheckCircle } from 'react-icons/bs';


export default function CompleteTaskButton({ isComplete, onCompletionToggle, itemId }) {
    const { fetchRequest } = useApi();

    const handleTaskCompletion = async () => {
        const url = `/items/${itemId}/complete`;

        try {
            const response = await fetchRequest(url, 'PUT');
            if (response.status === 200) {
                const newStatus = !isComplete;
                onCompletionToggle(itemId, newStatus);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <OverlayTrigger overlay={<Tooltip id="tooltip-complete">{isComplete ? "Mark as Incomplete" : "Mark as Complete"}</Tooltip>}>
            <Button 
                variant="link" 
                className="btn-sm p-0 text-decoration-none mr-3" 
                onClick={handleTaskCompletion}
            >
                {isComplete ? (
                    <BsCheckCircle size={16} color="#0056b3" style={{ textDecoration: "line-through" }} />
                ) : (
                    <BsCheckCircle size={16} color="#0056b3" style={{ opacity: 0.3 }} />
                )}
            </Button>
        </OverlayTrigger>
    );
}
