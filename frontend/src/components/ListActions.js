import React from 'react';
import { BsPencil, BsPlus, BsTrash } from 'react-icons/bs';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

export default function ListActions({ onAdd, onEdit, onDelete }) {
    return (
        <div className="d-flex justify-content-end">
            <OverlayTrigger overlay={<Tooltip id="tooltip-add">Add Task</Tooltip>}>
                <Link 
                    to="/addtask" 
                    className="btn btn-link btn-sm mr-2 icon-link"
                >
                    <BsPlus className="icon-plus" />
                </Link>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip id="tooltip-edit">Edit Title</Tooltip>}>
                <Link 
                    to="/editlist" 
                    className="btn btn-link btn-sm mr-2 icon-link"
                >
                    <BsPencil className="icon-pencil" />
                </Link>
            </OverlayTrigger>

            <OverlayTrigger overlay={<Tooltip id="tooltip-delete">Delete List</Tooltip>}>
                <Link 
                    to="/deletelist" 
                    className="btn btn-link btn-sm icon-link"
                >
                    <BsTrash className="icon-trash" />
                </Link>
            </OverlayTrigger>

            <style jsx>{`
                .icon-link:hover .icon-plus {
                    color: rgba(0, 128, 0, 0.6); /* soft green */
                }
                .icon-link:hover .icon-pencil {
                    color: rgba(255, 165, 0, 0.6); /* soft orange */
                }
                .icon-link:hover .icon-trash {
                    color: rgba(255, 0, 0, 0.6); /* soft red */
                }
            `}</style>
        </div>
    );
}
