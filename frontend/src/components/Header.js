import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            try {
                await logout();
                // Remove authentication state from local storage
                localStorage.removeItem('isAuthenticated');
                navigate('/');  // Redirect to homepage
            } catch (error) {
                console.error("Failed to log out:", error);
            }
        }
    };

    return (
        <Navbar bg="dark" sticky="top" className="Header">
            <Container fluid>
            <Navbar.Brand as={Link} to="/">
                <img
                    src="/favicon.png" 
                    width="30" 
                    height="30"
                    className="d-inline-block align-top"
                    alt="ToDo App Icon"
                />
                <span style={{ color: 'white', marginLeft: '10px' }}>ToDo App</span>
            </Navbar.Brand>

                <Nav className="ml-auto">
                    {isAuthenticated ? (
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
                    )}
                </Nav>
            </Container>
        </Navbar>     
    );
}
