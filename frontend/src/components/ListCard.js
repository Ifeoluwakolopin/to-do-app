import { Card, ListGroup, Row, Col } from 'react-bootstrap';
import TaskItem from '../components/TaskItem';
import ListActions from './ListActions';

export default function ListCard({ list }) {

    const items = list.items || [];

    return (
        <Card className="w-100"> {/* Use w-100 to make card responsive */}
            <Card.Header>
                <Row className="align-items-center">
                    <Col>{list.title}</Col>
                    <Col xs="auto">
                        <ListActions 
                            onAdd={() => console.log("Add")} 
                            onEdit={() => console.log("Edit")} 
                            onDelete={() => console.log("Delete")} 
                        />
                    </Col>
                </Row>
            </Card.Header>
            <ListGroup variant="flush" className="p-3">
                {items.map(item => (
                    <TaskItem key={item.id} item={item} />
                ))}
            </ListGroup>
        </Card>
    );
}