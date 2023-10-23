import { Alert, Container } from 'react-bootstrap';
import { useEffect } from 'react';

export default function AlertComponent({ variant = 'success', message, show, onClose }) {

    console.log("AlertComponent rendered. show:", show);

    
    useEffect(() => {
        console.log("Inside AlertComponent useEffect.");
        let timer;
        if (show) {
            timer = setTimeout(() => {
                console.log("Attempting to close the alert.");
                onClose();
            }, 3000); // Set to 3 seconds
        }

        // Cleanup the timer to avoid potential issues if the component is unmounted before the timer fires.
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
