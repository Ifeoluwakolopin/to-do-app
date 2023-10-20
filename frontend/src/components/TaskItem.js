import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import TaskActions from './TaskActions'; 
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'; 

export default function TaskItem({ item }) {
    const [showSubtasks, setShowSubtasks] = useState(false);

    return (
        <>
            <Card className="mb-2 mx-1 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                    {item.content}
                    <div className="d-flex align-items-center">
                        <TaskActions subtasks={item.children} />
                        {item.children && item.children.length > 0 && (
                            <Button 
                                variant="link"
                                onClick={() => setShowSubtasks(!showSubtasks)}
                                className="ml-2 p-0">
                                {showSubtasks ? <BsChevronUp size="20" /> : <BsChevronDown size="20" />}
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {showSubtasks && item.children && item.children.length > 0 && (
                item.children.map(child => (
                    <div key={child.id} className="ml-4">
                        <Card className="mb-2 mx-2 shadow-sm">
                            <Card.Body className="d-flex justify-content-between align-items-center py-2">
                                {child.content}
                                <div className="d-flex align-items-center">
                                    <TaskActions subtasks={child.children} />
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))
            )}
        </>
    );
}
