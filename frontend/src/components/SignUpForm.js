import { Form, Button, Container } from 'react-bootstrap';

export default function SignUpForm({ onSignUp }) {
    return (
            <Container className="mt-5">
                <h2 className="mb-4">Sign Up</h2>
                <Form onSubmit={onSignUp}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" required />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Sign Up
                    </Button>
                </Form>
            </Container>
    );
};
