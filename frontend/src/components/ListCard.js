import React, { useState } from 'react';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';
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
        // Remove the deleted task from the items state
        setItems((prevItems) => prevItems.filter((item) => item.id !== deletedTaskId));
    };

    return (
        <Card className="w-100">
            <Card.Header>
                <Row className="align-items-center">
                    <Col>
                        <Title 
                            initialTitle={list.title}
                            onSave={handleSaveTitle} // Pass the handleSaveTitle function
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
                {items.map(item => (
                    <TaskItem 
                        key={item.id} 
                        item={item} 
                        listId={list.id}
                        onTaskDeleted={handleTaskDeleted} 
                        />
                ))}
            </ListGroup>
        </Card>
    );
}
