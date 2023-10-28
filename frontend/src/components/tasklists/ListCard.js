import React, { useState } from 'react';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';
import TaskComponent from '../tasks/TaskComponent';
import ListActions from './ListActions';
import Title from '../Title';
import { useApi } from '../../contexts/ApiProvider';

export default function ListCard({ list ={}, onListDeleted, onTaskMoved }) {
    // Only include items without a parentId (i.e., top-level tasks)
    const filteredItems = list?.items?.filter(item => item !== undefined) || [];
    const topLevelTasks = filteredItems.filter(item => !item.parent_id);

    // Then, use this filtered list to set your items state
    const [items, setItems] = useState(topLevelTasks);

    const { fetchRequest } = useApi();

    const handleSaveTitle = async (newTitle, endpoint) => {
        try {
            const response = await fetchRequest(endpoint, 'PUT', { title: newTitle });
            console.log('Response:', response);
            return response; // Return the response object
        } catch (error) {
            console.error("Error updating title:", error);
            throw error; // Rethrow the error
        }
    };

    const handleTaskMoved = (movedTaskId, targetListId) => {
        const moveRecursive = (tasks, taskId) => {
            // Try finding task directly in the current list
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            
            // If no task was removed (because it wasn't found at this level), try looking in children
            if (updatedTasks.length === tasks.length) {
                return tasks.map(task => ({
                    ...task,
                    children: task.children ? moveRecursive(task.children, taskId) : []
                }));
            }
            
            return updatedTasks;
        };
        
        // Assuming the parent maintains a tasks/items state:
        setItems(prevItems => moveRecursive(prevItems, movedTaskId));
    
        if (onTaskMoved) {
            onTaskMoved(movedTaskId, targetListId);
        }
    };

    const handleTaskAdded = (newTask, parentId = null) => {
        const addRecursive = (tasks, task, parentId) => {
            if (!parentId) return [...tasks, task];
    
            return tasks.map(existingTask => {
                if (existingTask.id === parentId) {
                    return {
                        ...existingTask,
                        children: existingTask.children ? [...existingTask.children, task] : [task]
                    };
                } else {
                    return {
                        ...existingTask,
                        children: existingTask.children ? addRecursive(existingTask.children, task, parentId) : existingTask.children
                    };
                }
            });
        };
    
        setItems(prevItems => addRecursive(prevItems, newTask, parentId));
    };
    

    const handleTaskDeleted = (deletedTaskId) => {
        const deleteRecursive = (tasks, taskId) => {
            // Try finding task directly in the current list
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            
            // If no task was deleted, try looking in children
            if (updatedTasks.length === tasks.length) {
                return tasks.map(task => ({
                    ...task,
                    children: task.children ? deleteRecursive(task.children, taskId) : []
                }));
            }
            
            return updatedTasks;
        };
    
        // Assuming the parent maintains a tasks/items state:
        setItems(prevItems => deleteRecursive(prevItems, deletedTaskId));
    };

    const markChildrenComplete = (items) => {
        return items.map(singleItem => ({
            ...singleItem,
            is_complete: true,
            children: singleItem.children ? markChildrenComplete(singleItem.children) : []
        }));
    };

    const handleTaskCompletionToggle = (taskId, status) => {
        const toggleRecursive = (tasks, taskId, status) => {
            return tasks.map(task => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        is_complete: status,
                        children: status ? markChildrenComplete(task.children || []) : task.children
                    };
                } else {
                    return {
                        ...task,
                        children: task.children ? toggleRecursive(task.children, taskId, status) : task.children
                    };
                }
            });
        };
    
        setItems(prevItems => toggleRecursive(prevItems, taskId, status));
    };
    

    return (
        <Card className="w-100" style={{ maxWidth: '650px' }}>
            <Card.Header>
                <Row className="align-items-center">
                    <Col>
                        <Title 
                            initialTitle={list.title}
                            onSave={handleSaveTitle} 
                            endpoint={`/edit_list/${list.id}`}
                        />
                    </Col>
                    <Col xs="auto">
                        <ListActions
                            listId={list.id}
                            onTaskAdded={handleTaskAdded}
                            onListDeleted={onListDeleted}
                        />
                    </Col>
                </Row>
            </Card.Header>
            <ListGroup variant="flush" className="p-3">
                {items.map((item) => (
                    <TaskComponent 
                        key={item.id} 
                        item={item} 
                        listId={list.id}
                        onTaskAdded={handleTaskAdded}
                        onTaskDeleted={handleTaskDeleted}
                        onTaskMoved={handleTaskMoved}
                        onCompletionToggle={handleTaskCompletionToggle} 
                    />

                ))}
            </ListGroup>
        </Card>
    );
}