import { Card, ListGroup } from 'react-bootstrap';
import TaskItem from '../components/TaskItem';

export default function ListCard({ list }) {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Header>{list.title}</Card.Header>
            <ListGroup variant="flush">
                {list.items.map(item => (
                    <TaskItem key={item.id} item={item} />
                ))}
            </ListGroup>
        </Card>
    );
}
