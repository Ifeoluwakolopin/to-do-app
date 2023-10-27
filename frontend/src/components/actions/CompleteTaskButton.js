import React from 'react';
import { useApi } from '../../contexts/ApiProvider';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { BsCheckSquare, BsSquare } from 'react-icons/bs'; // Importing the square icons

export default function CompleteTaskButton({ isComplete, onCompletionToggle, itemId }) {
    const { fetchRequest } = useApi();

    const handleTaskCompletion = async () => {
        const url = `/items/${itemId}/complete`;
    
        try {
            const response = await fetchRequest(url, 'PUT');
            if (response.status === 200) {
                return !isComplete;
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
        return undefined;
    };

    return (
        <OverlayTrigger overlay={<Tooltip id="tooltip-complete">{isComplete ? "Mark as Incomplete" : "Mark as Complete"}</Tooltip>}>
            <Button 
                variant="link" 
                className="btn-sm p-0 text-decoration-none mr-3" 
                onClick={ async () => {
                    const updatedStatus = await handleTaskCompletion(); 
                    if(updatedStatus !== undefined) {
                        onCompletionToggle(itemId, updatedStatus);
                    }
                }}
            >
                {isComplete ? (
                    <BsCheckSquare size={16} color="#0056b3" style={{ textDecoration: "line-through" }} />
                ) : (
                    <BsSquare size={16} color="#0056b3" style={{ opacity: 0.3 }} />
                )}
            </Button>

        </OverlayTrigger>
    );
}
