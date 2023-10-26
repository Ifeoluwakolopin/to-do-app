import React, { useState } from 'react';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';
import { Droppable } from "react-beautiful-dnd";
import TaskItem from '../components/TaskItem';
import ListActions from './ListActions';
import Title from './Title';
import { useApi } from '../contexts/ApiProvider';

export default function ListCard({ list, onListDeleted }) {

    // Only include items without a parentId (i.e., top-level tasks)
    const topLevelTasks = list.items.filter(item => !item.parentId);

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

    const handleTaskAdded = (newTask) => {
        // Update the items state with the new task
        setItems([...items, newTask]);
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

    return (
        <Card className="w-100">
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
            <Droppable droppableId={`listCard-${list.id}`}>
                {(provided, snapshot) => (
                    <ListGroup 
                        variant="flush" 
                        className="p-3" 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        style={{backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'transparent'}}
                    >
                        {items.map((item, index) => (
                            <TaskItem 
                                key={item.id} 
                                item={item} 
                                listId={list.id}
                                onTaskDeleted={handleTaskDeleted} 
                                index={index}  // added index prop for react-beautiful-dnd
                            />
                        ))}
                        {provided.placeholder}
                    </ListGroup>
                )}
            </Droppable>
        </Card>
    );
}
