import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ListCard from '../components/ListCard';

export default function ListCardArea({ initialLists, selectedListId, onSelectList, onListDeleted, onTaskMoved }) {
    const itemsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(0);
    const [lists, setLists] = useState(() => initialLists || []);
    
    // You already have lists state to manage current lists, so you don't need the currentLists state
    // Removing redundant useState and useEffect related to currentLists
    useEffect(() => {
        setLists(initialLists);
    }, [initialLists]);

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

    const currentIndex = lists.findIndex(list => list.id === selectedListId);

    const updateListWithTask = (movedTaskId, targetListId) => {
        // Get the task's original list
        let sourceList = lists.find(l => l.items.some(t => t.id === movedTaskId));
        if (!sourceList) return;
        
        let taskObject = sourceList.items.find(t => t.id === movedTaskId);
    
        // Remove the task from the source list
        sourceList.items = sourceList.items.filter(t => t.id !== movedTaskId);
    
        // Update the target list with the new task and the source list without the moved task
        const updatedLists = lists.map(l => {
            if (l.id === targetListId) {
                return { ...l, items: [...l.items, taskObject] };
            }
            if (l.id === sourceList.id) {
                return sourceList;
            }
            return l;
        });
    
        setLists(updatedLists);
    
        if (onTaskMoved) {
            onTaskMoved(movedTaskId, targetListId);
        }
    };

    return (
        <Container className="py-4" style={{ backgroundColor: "#f7f7f7" }}>
            <Row>
                {displayedLists.map(list => (
                    <Col key={list.id} className="mb-3 mx-auto" style={{ maxWidth: '650px' }}>
                        <ListCard 
                            list={list} 
                            onListDeleted={onListDeleted} 
                            onTaskMoved={updateListWithTask} 
                            selectedListId={selectedListId}
                        />
                    </Col>
                ))}
            </Row>
            {(lists.length > itemsPerPage || selectedListId) && (
                <Row className="justify-content-center mt-3">
                    <Col xs="auto">
                        <Button 
                            variant="outline-primary" 
                            className="mr-2" 
                            onClick={handlePrevious}
                            disabled={selectedListId ? currentIndex <= 0 : currentPage <= 0}
                        >
                            Previous
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button 
                            variant="outline-primary" 
                            onClick={handleNext}
                            disabled={selectedListId ? currentIndex >= lists.length - 1 : (currentPage + 1) * itemsPerPage >= lists.length}
                        >
                            Next
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
