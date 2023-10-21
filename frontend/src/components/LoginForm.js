import { Form, Button, Container } from 'react-bootstrap';

export default function LoginForm({ onLogin }) {
    return (
        <Container className="mt-5">
            <h2 className="mb-4">Login</h2>
            <Form onSubmit={onLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    );
};
