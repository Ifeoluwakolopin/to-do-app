import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ListCard from '../components/ListCard';

export default function ListCardArea({ lists, selectedListId, onSelectList, onListDeleted }) {
    const itemsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (selectedListId) {
            const currentIndex = lists.findIndex(list => list.id === selectedListId);
            const nextIndex = currentIndex + 1;
            if (nextIndex < lists.length) {
                onSelectList(lists[nextIndex].id);
            }
        } else {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }

    const handlePrevious = () => {
        if (selectedListId) {
            const currentIndex = lists.findIndex(list => list.id === selectedListId);
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                onSelectList(lists[prevIndex].id);
            }
        } else {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }

    const displayedLists = selectedListId
        ? lists.filter(list => list.id === selectedListId)
        : lists.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const hasPreviousPage = selectedListId
        ? lists.findIndex(list => list.id === selectedListId) > 0
        : currentPage > 0;
        
    const hasNextPage = selectedListId
        ? lists.findIndex(list => list.id === selectedListId) < lists.length - 1
        : (currentPage + 1) * itemsPerPage < lists.length;

    return (
        <Container className="py-4" style={{ backgroundColor: "#f7f7f7" }}>
            <Row>
                {displayedLists.map(list => (
                    <Col key={list.id} className="mb-3 mx-auto" style={{ maxWidth: '650px' }}>
                        <ListCard list={list} onListDeleted={onListDeleted} />
                    </Col>
                ))}
            </Row>
            {(hasPreviousPage || hasNextPage) && (
                <Row className="justify-content-center mt-3">
                    <Col xs="auto">
                        <Button 
                            variant="outline-primary" 
                            className="mr-2" 
                            onClick={handlePrevious}
                            disabled={!hasPreviousPage}
                        >
                            Previous
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button 
                            variant="outline-primary" 
                            onClick={handleNext}
                            disabled={!hasNextPage}
                        >
                            Next
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
