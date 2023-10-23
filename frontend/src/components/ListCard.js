import React, { useState } from 'react';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';
import TaskItem from '../components/TaskItem';
import ListActions from './ListActions';
import Title from './Title';
import { useApi } from '../contexts/ApiProvider';

export default function ListCard({ list, onListDeleted }) {
    const [items, setItems] = useState(list.items || []); // Initialize with list items

    const { fetchRequest } = useApi();

    const handleSaveTitle = async (newTitle, endpoint) => {
        try {
            const response = await fetchRequest(endpoint, 'PUT', { title: newTitle });
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
                    <TaskItem key={item.id} item={item} />
                ))}
            </ListGroup>
        </Card>
    );
}
