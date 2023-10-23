import { Alert, Container } from 'react-bootstrap';
import { useEffect } from 'react';

export default function AlertComponent({ variant = 'success', message, show, onClose }) {

    console.log("AlertComponent rendered. show:", show);

    
    useEffect(() => {
        console.log("Inside AlertComponent useEffect.");
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
        <Container className="mb-4">
            <Alert variant={variant} onClose={onClose} dismissible>
                {message}
            </Alert>
        </Container>
    );
}
