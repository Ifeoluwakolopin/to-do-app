import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import ListCard from '../components/ListCard';
import { useApi } from '../contexts/ApiProvider';

export default function ListCardArea({ lists, onListDeleted }) {
    const itemsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if ((currentPage + 1) * itemsPerPage < lists.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }

    const { fetchRequest } = useApi();

    const handleDragEnd = async (result) => {
        const { destination, source } = result;
    
        // If the item was dropped outside of any droppable area
        if (!destination) {
            return;
        }
    
        // If the item was dropped in the same spot it started
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
    
        // Extracting the ID from source (the task that's being dragged)
        const sourceId = parseInt(source.droppableId.split('-')[1]);
    
        // Extracting info from the destination (where the task is being dropped)
        const destInfo = destination.droppableId.split('-'); // Example: ["listCard", "12"]
        const destType = destInfo[0];
        const destId = parseInt(destInfo[1]);
    
        if (destType !== 'listCard') {
            console.error('Invalid drop destination.');
            return;
        }
    
        // As tasks can only be dropped onto a listCard, the new list ID is the destination ID
        const newListId = destId;
    
        // Making the API call to move the task
        try {
            const payload = {
                list_id: newListId,
                parent_id: null // Since we're only dropping onto lists, not other tasks.
            };
    
            const response = await fetchRequest(`/move_item/${sourceId}/`, 'PUT', payload);
    
            if (response.status === 200) {
                // Handle successful API response here. 
                // You can update your frontend state with `response.data` if needed.
                console.log("Task moved successfully:", response.data);
            } else {
                // Handle any error messages from the API
                console.error('Failed to move task:', response.data.error);
            }
        } catch (error) {
            console.error('Error occurred while moving task:', error);
        }
    }
    

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
        <Container className="py-4" style={{ backgroundColor: "#f7f7f7" }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Row>
                    {lists.slice(startIndex, endIndex).map(list => (
                        <Col key={list.id} className="mb-3 mx-auto" style={{ maxWidth: '650px' }}>
                            <ListCard list={list} onListDeleted={onListDeleted} />
                        </Col>
                    ))}
                </Row>
            </DragDropContext>
            <Row className="justify-content-center mt-3">
                <Col xs="auto">
                    {currentPage > 0 && 
                        <Button variant="outline-primary" className="mr-2" onClick={handlePrevious}>
                            Previous
                        </Button>
                    }
                </Col>
                <Col xs="auto">
                    {endIndex < lists.length &&
                        <Button variant="outline-primary" onClick={handleNext}>
                            Next
                        </Button>
                    }
                </Col>
            </Row>
        </Container>
    );
}
