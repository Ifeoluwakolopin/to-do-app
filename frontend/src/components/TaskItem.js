import React, { useState } from 'react';
import TaskComponent from './TaskComponent';

export default function TaskItem({ item, listId, onTaskDeleted, index }) {
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
        return items.map(singleItem => ({
            ...singleItem,
            is_complete: true,
            children: singleItem.children ? markChildrenComplete(singleItem.children) : []
        }));
    };

    const handleItemCompletionToggle = (itemId, status) => {
    
        const toggleRecursive = (items, itemId, status) => {
            let allSiblingsComplete = true;  // Assuming initially
    
            const updatedItems = items.map(singleItem => {
                if (singleItem.id === itemId) {
                    // If marking as complete
                    if (status) {
                        return {
                            ...singleItem,
                            is_complete: true,
                            children: markChildrenComplete(singleItem.children || [])
                        };
                    }
                    return { ...singleItem, is_complete: false };
                } else {
                    // Check if any sibling is not complete
                    if (!singleItem.is_complete) {
                        allSiblingsComplete = false;
                    }
                }
    
                return {
                    ...singleItem,
                    children: singleItem.children ? toggleRecursive(singleItem.children, itemId, status) : singleItem.children
                };
            });
    
            // If all siblings are complete and the current item is also marked as complete
            if (allSiblingsComplete && status) {
                for (let i = 0; i < updatedItems.length; i++) {
                    if (updatedItems[i].id !== itemId && !updatedItems[i].is_complete) {
                        allSiblingsComplete = false;
                        break;
                    }
                }
                if (allSiblingsComplete) {
                    return updatedItems.map(singleItem => ({ ...singleItem, is_complete: true }));
                }
            }
    
            return updatedItems;
        };
    
        const newItems = toggleRecursive(items, itemId, status);
        setItems(newItems);
    
        if (itemId === item.id) {
            setIsComplete(status);
        }
    };
    
       
    
    return (
        <div>
            <TaskComponent
                item={{...item, children: items, is_complete: isComplete}}
                listId={listId}
                onTaskAdded={handleItemAdded}
                onTaskDeleted={handleItemDelete}
                parentId={null}
                isComplete={isComplete}
                onCompletionToggle={handleItemCompletionToggle}
                index={index}  // If it's necessary to pass the index down
            />
        </div>
    );
}