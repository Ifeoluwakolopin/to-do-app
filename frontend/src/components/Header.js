import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

export default function Header({ isUserLoggedIn }) {
    return (
        <Navbar bg="dark" sticky="top" className="Header">
            <Container fluid>
                <Navbar.Brand href="/" style={{ color: 'white' }}>ToDo App</Navbar.Brand>
                <Nav className="ml-auto">
                    {
                        isUserLoggedIn ? (
                            <Button variant="outline-info" onClick={() => {
                                // TODO: logout logic here
                            }}>
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline-info" href="/login" className="mx-1">
                                    Login
                                </Button>
                                <Button variant="outline-info" href="/signup" className="mx-1 no-wrap">
                                    Sign Up
                                </Button>
                            </>
                        )
                    }
                </Nav>
            </Container>
        </Navbar>     
    );
}
