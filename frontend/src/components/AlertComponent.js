import { Alert, Container } from 'react-bootstrap';

export default function AlertComponent({ variant = 'success', message, show, onClose }) {
    return (
        show &&
        <Container className="mb-4">
            <Alert variant={variant} onClose={onClose} dismissible>
                {message}
            </Alert>
        </Container>
    );
}
