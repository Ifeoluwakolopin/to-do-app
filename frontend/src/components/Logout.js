import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from 'react-bootstrap';

export default function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                navigate('/');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        };

        performLogout();
    }, [logout, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <Spinner animation="border" variant="primary" />
        </div>
    );
}