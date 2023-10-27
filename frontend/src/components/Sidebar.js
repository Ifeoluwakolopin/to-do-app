import React from 'react';
import { ListGroup, Container, Row, Col, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Sidebar({ lists, onSelectList, onClose }) {
    const title = lists.length ? "View Lists" : "No Lists Added yet";
    
    return (
        <div className="sidebar" style={{ maxWidth: '250px', height: '100vh', overflowY: 'auto' }}>
            <Container fluid>
                <Row className="align-items-center my-2"> {/* Adjusted margins */}
                    <Col xs={8} className="pl-0"> {/* Removed left padding */}
                        <span>{title}</span>
                    </Col>
                    <Col xs={4} className="text-right pr-0"> {/* Removed right padding */}
                        <FaTimes 
                            size={30} 
                            onClick={onClose} 
                            style={{ cursor: 'pointer' }}
                        />
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col className="pl-0"> {/* Removed left padding */}
                        <Link to="/">
                            <Button variant="outline-primary" block>
                                Home
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ListGroup>
                            {lists.map(list => (
                                <ListGroup.Item key={list.id} action onClick={() => onSelectList(list.id)}>
                                    {list.title}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
