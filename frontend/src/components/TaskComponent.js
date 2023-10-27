import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Title from './Title';
import TaskActions from './TaskActions';
import { useApi } from '../contexts/ApiProvider';

export default function TaskComponent({ 
    item, 
    listId, 
    onTaskAdded, 
    onTaskDeleted, 
    parentId = null, 
    onCompletionToggle,
    onTaskMoved
}) {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { fetchRequest } = useApi();
    const [items, setItems] = useState(item.children || []);
    const [isComplete, setIsComplete] = useState(item.is_complete);

    const handleItemAdded = (newItem, parentId) => {
        if (parentId === item.id) {
            setItems(prevItems => [...prevItems, newItem]);
        } else {
            setItems(prevItems => 
                prevItems.map(singleItem => 
                    singleItem.id === parentId 
                        ? { ...singleItem, children: [...singleItem.children, newItem] }
                        : singleItem
                )
            );
        }
    };

    const handleItemDelete = (deletedItemId) => {
        const deleteRecursive = (items, itemId) => {
            const updatedItems = items.filter(singleItem => singleItem.id !== itemId);
            
            if (updatedItems.length === items.length) {
                return items.map(singleItem => ({
                    ...singleItem,
                    children: singleItem.children ? deleteRecursive(singleItem.children, itemId) : []
                }));
            }
            
            return updatedItems;
        };

        setItems(prevItems => deleteRecursive(prevItems, deletedItemId));
        onTaskDeleted(deletedItemId);
    };

    const markChildrenComplete = (items) => {
        console.log("Marking children as complete");
        return items.map(singleItem => ({
            ...singleItem,
            is_complete: true,
            children: singleItem.children ? markChildrenComplete(singleItem.children) : []
        }));
    };
    
    const handleItemCompletionToggle = (itemId, status) => {
        console.log("Top-level toggling item completion:", itemId, status);
    
        const toggleRecursive = (items, itemId, status) => {
            return items.map(singleItem => {
                if (singleItem.id === itemId) {
                    console.log(`Setting item ${itemId} status to ${status}`);
                    return {
                        ...singleItem,
                        is_complete: status,
                        children: status ? markChildrenComplete(singleItem.children || []) : singleItem.children
                    };
                }
                return {
                    ...singleItem,
                    children: singleItem.children ? toggleRecursive(singleItem.children, itemId, status) : singleItem.children
                };
            });
        };
    
        const newItems = toggleRecursive(items, itemId, status);
        console.log("Updated items list after toggle:", newItems);
        setItems(newItems);
    
        if (itemId === item.id) {
            console.log(`Root item ${itemId} status changed to ${status}`);
            setIsComplete(status);
        }
    
        if (parentId) {
            checkAndToggleParentStatus(itemId, status, newItems);
        }
    };
    
    const checkAndToggleParentStatus = (itemId, itemStatus, itemsList) => {
        const siblingStatus = itemsList.filter(singleItem => singleItem.id !== itemId).every(singleItem => singleItem.is_complete);
        console.log(`Siblings (excluding item ${itemId}) completion status:`, siblingStatus);
        const allSiblingsComplete = siblingStatus && itemStatus;
    
        console.log(`Item ${itemId} and all its siblings complete status:`, allSiblingsComplete);
    
        if (allSiblingsComplete) {
            console.log(`Setting parent of item ${itemId} status to true`);
            onCompletionToggle(parentId, true);
        } else {
            console.log(`Setting parent of item ${itemId} status to false`);
            onCompletionToggle(parentId, false);
        }
    };
    

    const handleSaveTitle = async (newTitle, endpoint) => {
        try {
            const payload = {
                content: newTitle,
                list_id: listId,
            };

            const response = await fetchRequest(endpoint, 'PUT', payload);

            if (response.status === 200) {
                return response;
            } else {
                console.error('Failed to update item title:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while updating item title:', error);
        }
    };

    return (
        <div>
            <Card 
                className={`mb-2 mx-1 shadow-sm ${isHovered ? "hovered-card" : ""}`} 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                    <Title
                        initialTitle={item.content}
                        onSave={(newTitle) => handleSaveTitle(newTitle, `/items/${item.id}`)}
                        className="flex-grow-1 mr-2 text-break"
                    />
                    <div className="d-flex align-items-center">
                        {isHovered && (
                            <TaskActions 
                                itemId={item.id}
                                listId={listId}
                                depth={item.depth}
                                parentId={parentId}  
                                onTaskDeleted={onTaskDeleted} 
                                onTaskAdded={(newSubitem) => onTaskAdded(newSubitem, item.id)}
                                isComplete={isComplete}
                                onCompletionToggle={(itemId, status) => {
                                    handleItemCompletionToggle(itemId, status); // Handle current task's status first
                                    if (onCompletionToggle) {
                                        onCompletionToggle(itemId, status);  // Propagate the change to parent, if needed
                                    }
                                }}
                                onTaskMoved={onTaskMoved}
                            />
                        )}

                        {item.children && item.children.length > 0 && (
                            <Button
                                variant="link"
                                onClick={() => setShowSubtasks(!showSubtasks)}
                                className="ml-2 p-0"
                            >
                                {showSubtasks ? <BsChevronUp size="20" /> : <BsChevronDown size="20" />}
                            </Button>
                        )}
                    </div>
                </Card.Body>
                {showSubtasks && item.children && item.children.length > 0 && (
                    <div className="ml-4">
                        {item.children.map((child) => (
                            <TaskComponent 
                                key={child.id}
                                item={child}
                                listId={listId} 
                                onTaskAdded={handleItemAdded}
                                onTaskDeleted={handleItemDelete}
                                parentId={item.id}
                                onCompletionToggle={handleItemCompletionToggle}
                                onTaskMoved={onTaskMoved}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
