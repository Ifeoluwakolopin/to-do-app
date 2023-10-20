import { Container, Row, Col, Button } from 'react-bootstrap';
import ListCard from '../components/ListCard';

export default function ListCardArea({ lists }) {
    return (
        <Container>
            <Row>
                {lists.slice(0, 3).map(list => (
                    <Col key={list.id} sm={12} md={4} className="mb-3"> {/* Adjusted column sizes and added margin */}
                        <ListCard list={list} />
                    </Col>
                ))}
            </Row>
            <Row className="justify-content-center mt-3">
                {lists.length > 3 && <Button variant="outline-primary">View More</Button>}
            </Row>
        </Container>
    );
}
