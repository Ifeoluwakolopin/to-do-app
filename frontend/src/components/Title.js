import React, { useState } from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Title({ initialTitle, onSave, endpoint }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);

    const handleSave = async () => {
        if (title.trim() !== "") {
            // Make the API request to update the title
            try {
                const response = await onSave(title, endpoint);
                if (response.status === 200) {
                    setIsEditing(false); // Only exit editing mode if the request was successful
                } else {
                    // Handle error response from the API
                    console.error("Error updating title:", response.data.message);
                }
            } catch (error) {
                // Handle network or other errors
                console.error("Error updating title:", error);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    const titleTooltip = (
        <Tooltip id="title-tooltip" style={{ fontSize: '12px' }}>
            Click to edit title
        </Tooltip>
    );

    return (
        <>
            {isEditing ? (
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown} // Handle Enter key press
                    autoFocus
                />
            ) : (
                <OverlayTrigger overlay={titleTooltip} placement="top">
                    <span
                        onClick={() => setIsEditing(true)}
                        style={{ cursor: 'pointer' }}
                        title="Click to edit title"
                    >
                        {title}
                    </span>
                </OverlayTrigger>
            )}
        </>
    );
}
