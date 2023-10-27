import { useState } from 'react'; 
import { useApi } from '../../contexts/ApiProvider';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';  


export default function DeleteTaskButton({ itemId, parentId, onTaskDeleted }) {
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const { fetchRequest } = useApi();

    const handleDeleteTaskClick = async () => {
        if (!deleteConfirmation) {
            setDeleteConfirmation(true);
            return;
        }

        const url = parentId ? `/items/${itemId}?parent_id=${parentId}` : `/items/${itemId}`;

        try {
            const response = await fetchRequest(url, 'DELETE');
            if (response.status === 200) {
                onTaskDeleted(itemId);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

        setDeleteConfirmation(false);
    };

    return (
        <OverlayTrigger 
            overlay={<Tooltip id="tooltip-delete">{deleteConfirmation ? "Confirm Delete?" : "Delete Task"}</Tooltip>}
        >
            <Button 
                variant="link" 
                className={`btn-sm p-0 text-decoration-none ${deleteConfirmation ? "text-danger" : ""}`} 
                onClick={handleDeleteTaskClick}
                onMouseLeave={() => setDeleteConfirmation(false)}
            >
                <BsTrash color="#0056b3" />
            </Button>
        </OverlayTrigger>
    );
}
