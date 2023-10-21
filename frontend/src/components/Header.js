import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiProvider';
import { useNavigate } from 'react-router-dom';

export default function Header() {

    const navigate = useNavigate();

    const { isAuthenticated, logout: authLogout, token} = useAuth();
    const { fetchRequest } = useApi();

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            try {
                await fetchRequest('/logout', 'POST', null, token);
                authLogout();
                navigate('/');  // Redirect to login page
            } catch (error) {
                console.error("Failed to log out:", error);
            }
        }
    };


    return (
        <Navbar bg="dark" sticky="top" className="Header">
            <Container fluid>
                <Navbar.Brand href="/" style={{ color: 'white' }}>ToDo App</Navbar.Brand>
                <Nav className="ml-auto">
                {
                    isAuthenticated ? (
                        <Button variant="outline-info" onClick={handleLogout}>
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
