import React from 'react';
import { BsPencil, BsPlus, BsTrash } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function TaskActions() {
    return (
        <div className="d-flex justify-content-end">
            <Button as={Link} to="/api/addtask" variant="link" className="btn-sm p-0 text-decoration-none mr-2">
                <BsPlus />
            </Button>

            <Button as={Link} to="/api/edittask" variant="link" className="btn-sm p-0 text-decoration-none mr-2">
                <BsPencil />
            </Button>

            <Button as={Link} to="/api/deletetask" variant="link" className="btn-sm p-0 text-decoration-none mr-2">
                <BsTrash />
            </Button>
        </div>
    );
}
