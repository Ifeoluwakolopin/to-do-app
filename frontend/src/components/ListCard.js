// ListCard.js
import { Card, ListGroup, Row, Col } from 'react-bootstrap';
import TaskItem from '../components/TaskItem';
import ListActions from './ListActions';
import Title from './Title';
import { useApi } from '../contexts/ApiProvider';

export default function ListCard({ list }) {

    const items = list.items || [];

    const { fetchRequest } = useApi();

    const handleSaveTitle = async (newTitle, endpoint) => {
        try {
            const response = await fetchRequest(endpoint, 'PUT', { title: newTitle });
            return response; // Return the response object
        } catch (error) {
            console.error("Error updating title:", error);
            throw error; // Rethrow the error
        }
    };

    const handleDeleteList = async () => {
        try {
            // Perform the delete_list API request
            const response = await fetch(`/delete_list/${list.id}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                // List deleted successfully, you can handle this as needed
                // For example, remove the list from the UI or perform any cleanup
                console.log('List deleted successfully');
            } else {
                // Handle error response from the API
                console.error('Failed to delete list:', response.data.message);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('An error occurred:', error);
        }
    };

    return (
        <Card className="w-100">
            <Card.Header>
                <Row className="align-items-center">
                    <Col>
                        <Title 
                            initialTitle={list.title}
                            onSave={handleSaveTitle} // Pass the handleSaveTitle function
                            endpoint={`/edit_list/${list.id}`}
                        />
                    </Col>
                    <Col xs="auto">
                        <ListActions 
                            onDelete={handleDeleteList} // Pass the handleDeleteList function
                            listId={list.id}
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