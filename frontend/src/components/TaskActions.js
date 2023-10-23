import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function TaskActions() {
    return (
        <div className="d-flex justify-content-end">
            <OverlayTrigger overlay={<Tooltip id="tooltip-add" style={{ fontSize: '11px' }}>Add Sub-Task</Tooltip>}>
                <Button as={Link} to="/api/addtask" variant="link" className="btn-sm p-0 text-decoration-none mr-2">
                    <FaPlus size={10} />
                </Button>
            </OverlayTrigger>
            
            <OverlayTrigger overlay={<Tooltip id="tooltip-add" style={{ fontSize: '11px' }}>Delete Task</Tooltip>}>
                <Button as={Link} to="/api/deletetask" variant="link" className="btn-sm p-0 text-decoration-none mr-2">
                    <BsTrash />
                </Button>
            </OverlayTrigger>
            
        </div>
    );
}
