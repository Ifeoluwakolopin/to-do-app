import { Alert, Container } from 'react-bootstrap';
import { useEffect } from 'react';

export default function AlertComponent({ variant = 'success', message, show, onClose, small }) {
    
    useEffect(() => {
        let timer;
        if (show) {
            timer = setTimeout(() => {
                onClose();
            }, 3000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [show, onClose]);

    return (
        show &&
        <Container className={`mb-2 ${small ? 'p-1' : ''}`}>
            <Alert 
                variant={variant} 
                onClose={onClose} 
                dismissible 
                className={`${small ? 'small' : ''}`}
            >
                {message}
            </Alert>
        </Container>
    );
}
