import { useState } from 'react'; 
import { useApi } from '../../contexts/ApiProvider';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';  

export default function DeleteListButton({ listId, onListDeleted }) {
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const { fetchRequest } = useApi();

    const handleDeleteListClick = async () => {
        if (!deleteConfirmation) {
            setDeleteConfirmation(true);
            return;
        }

        const url = `/delete_list/${listId}`;
        try {
            const response = await fetchRequest(url, 'DELETE');
            if (response.status === 200) {
                onListDeleted(listId);
            } else {
                console.error('Failed to delete list:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

        setDeleteConfirmation(false);
    };

    return (
        <OverlayTrigger 
            overlay={<Tooltip id="tooltip-delete-list">{deleteConfirmation ? "Confirm Delete?" : "Delete List"}</Tooltip>}
        >
            <Button 
                className={`btn btn-link btn-sm icon-link ${deleteConfirmation ? "text-danger" : ""}`} 
                onClick={handleDeleteListClick}
                style={{ backgroundColor: 'transparent', borderColor: 'transparent' }} // Added this line
            >
                <BsTrash className="icon-trash" color={deleteConfirmation ? "red" : "#0056b3"} />
            </Button>
        </OverlayTrigger>
    );
}
