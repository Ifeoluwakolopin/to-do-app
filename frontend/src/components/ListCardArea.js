import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import ListCard from '../components/ListCard';

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

    const handleDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // Here, you'll handle the logic to reorder the `lists` array 
        // based on the drag results if necessary.
        // This could involve setting new state, calling API endpoints, etc.
    }

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
        <Container className="py-4" style={{ backgroundColor: "#f7f7f7" }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Row>
                    {lists.slice(startIndex, endIndex).map(list => (
                        <Col key={list.id} sm={12} md={lists.length === 1 ? 12 : lists.length === 2 ? 6 : 4} className="mb-3">
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
