import React, { useState, useEffect } from 'react';
import AddList from '../components/AddList';
import ListCardArea from '../components/ListCardArea';
import Sidebar from '../components/Sidebar';
import { useApi } from '../contexts/ApiProvider';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

export default function HomePage() {
    const [lists, setLists] = useState([]);
    const [displayedLists, setDisplayedLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { fetchRequest } = useApi();

    
    

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await fetchRequest('/lists', 'GET');
                if (response.status === 200) {
                    setLists(response.data);
                    if(!selectedListId) {
                        setDisplayedLists(response.data);
                    }
                } else {
                    console.error('Failed to fetch lists:', response.data.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        fetchLists();
    }, [fetchRequest, selectedListId]);

    useEffect(() => {
        if (!selectedListId) {
            setDisplayedLists(lists);
        } else {
            const updatedDisplayedList = lists.find(list => list.id === selectedListId);
            setDisplayedLists([updatedDisplayedList]);
        }
    }, [lists, selectedListId]);

    const handleSelectList = (listId) => {
        setSelectedListId(listId);
        const selectedList = lists.find(list => list.id === listId);
        setDisplayedLists([selectedList]);
    };

    const addNewList = (newList) => {
        setLists(prevLists => [...prevLists, newList]);
        if(!selectedListId) {
            setDisplayedLists(prevLists => [...prevLists, newList]);
        }
    };

    const handleListDeleted = (deletedListId) => {
        setLists(prevLists => prevLists.filter(list => list.id !== deletedListId));
        if(!selectedListId) {
            setDisplayedLists(prevLists => prevLists.filter(list => list.id !== deletedListId));
        }
        if(selectedListId === deletedListId) {
            setSelectedListId(null);
            setDisplayedLists(lists.filter(list => list.id !== deletedListId));
        }
    };
    
    const handleTaskMoved = async (movedTaskId, targetListId) => {
        // Update the lists based on the moved task
        const updatedLists = lists.map(list => {
            if (list.id === targetListId) {
                const taskObject = lists.reduce((acc, currList) => {
                    const foundTask = currList.items.find(t => t.id === movedTaskId);
                    return foundTask ? foundTask : acc;
                }, null);
    
                if (taskObject) {
                    return { ...list, items: [...list.items, taskObject] };
                }
            } else if (list.items.some(task => task.id === movedTaskId)) {
                return { ...list, items: list.items.filter(task => task.id !== movedTaskId) };
            }
            return { ...list };
        });
    
        setLists(updatedLists);
        const response = await fetchRequest('/lists', 'GET');
        if (response.status === 200) {
            setLists(response.data);
            if(!selectedListId) {
                setDisplayedLists(response.data);
            }
        }
    };

    return (
        <Container fluid className="home-page-content py-5 position-relative">
            {!isSidebarOpen && (
                <div style={{ position: 'absolute', top: '20px', left: '15px' }}>
                    <FaBars 
                        size={30} 
                        onClick={() => setIsSidebarOpen(true)} 
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            )}
            <Row>
                {isSidebarOpen && (
                    <Col md={3} className="border-right">
                        <Sidebar 
                            lists={lists} 
                            onSelectList={handleSelectList} 
                            onClose={() => setIsSidebarOpen(false)} 
                        />
                    </Col>
                )}
                <Col md={isSidebarOpen ? 9 : 12}>
                    <Row className="mb-3 justify-content-center">
                        <Col md={8}>
                            <AddList onListAdded={addNewList} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center">
                        <ListCardArea 
                            initialLists={displayedLists} 
                            selectedListId={selectedListId} 
                            onSelectList={handleSelectList}
                            onTaskMoved={handleTaskMoved}
                            onListDeleted={handleListDeleted}
                        />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}