import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Title from './Title';
import TaskActions from './TaskActions';
import { useApi } from '../contexts/ApiProvider';

export default function TaskComponent({ item, listId, onTaskAdded, onTaskDeleted, tasks, setTasks }) {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const { fetchRequest } = useApi();

    const handleSaveTitle = async (newTitle, endpoint) => {
        try {
            const payload = {
                content: newTitle,
                list_id: listId,
            };

            const response = await fetchRequest(endpoint, 'PUT', payload);

            if (response.status === 200) {
                return response;
            } else {
                console.error('Failed to update task title:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while updating task title:', error);
        }
    };

    return (
        <>
            <Card className="mb-2 mx-1 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                    <Title
                        initialTitle={item.content}
                        onSave={(newTitle) => handleSaveTitle(newTitle, `/items/${item.id}`)}
                        className="flex-grow-1 mr-2 text-break"
                    />
                    <div className="d-flex align-items-center">
                        <TaskActions 
                            taskId={item.id} 
                            listId={listId} 
                            onTaskDeleted={onTaskDeleted} 
                            onTaskAdded={(newSubtask) => onTaskAdded(newSubtask, item.id)}
                        />

                        {item.children && item.children.length > 0 && (
                            <Button
                                variant="link"
                                onClick={() => setShowSubtasks(!showSubtasks)}
                                className="ml-2 p-0"
                            >
                                {showSubtasks ? <BsChevronUp size="20" /> : <BsChevronDown size="20" />}
                            </Button>
                        )}
                    </div>
                </Card.Body>
                    {showSubtasks && tasks && tasks.length > 0 && (
                        tasks.map((child) => (
                            <div key={child.id} className="ml-4">
                                <TaskComponent 
                                    item={child} 
                                    listId={item.id} 
                                    onTaskAdded={onTaskAdded} 
                                    onTaskDeleted={onTaskDeleted} 
                                    tasks={child.children || []} 
                                    setTasks={setTasks}  
                                />
                            </div>
                        ))
                    )}
            </Card>
        </>
    );
}