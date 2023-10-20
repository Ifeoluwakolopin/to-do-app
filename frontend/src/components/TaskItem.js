import { ListGroup } from 'react-bootstrap';

export default function TaskItem({ item }) {
    return (
        <ListGroup.Item className="mb-2"> {/* Added margin-bottom */}
            {item.content}
            {item.children.length > 0 && (
                <ListGroup>
                    {item.children.map(child => (
                        <TaskItem key={child.id} item={child} />
                    ))}
                </ListGroup>
            )}
        </ListGroup.Item>
    );
}
