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

    const handleTaskMoved = (taskId, sourceListId, destListId) => {
        if (sourceListId === destListId) return;

        let taskToMove = null;
        const sourceListTasks = lists.find(l => l.id === sourceListId).items;
        taskToMove = sourceListTasks.find(t => t.id === taskId);

        // Remove the task from the source list
        const updatedSourceList = lists.map(l => {
            if (l.id === sourceListId) {
                return { ...l, items: l.items.filter(t => t.id !== taskId) };
            }
            return l;
        });

        // Add the task to the destination list
        const updatedDestList = updatedSourceList.map(l => {
            if (l.id === destListId) {
                return { ...l, items: [...l.items, taskToMove] };
            }
            return l;
        });

        setLists(updatedDestList);
        if(!selectedListId) {
            setDisplayedLists(updatedDestList);
        }
    };
    

    return (
        <Container fluid className="home-page-content py-5 position-relative">
            {!isSidebarOpen && (
                <div style={{ position: 'absolute', top: '20px', left: '15px' }}> {/* Adjusted positioning here */}
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
                            onListDeleted={handleListDeleted}
                            onTaskMoved={handleTaskMoved}
                        />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}