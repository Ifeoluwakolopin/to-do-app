import React, { useState } from 'react';
import TaskComponent from './TaskComponent';

export default function TaskItem({ item, listId, onTaskDeleted }) {
    const [tasks, setTasks] = useState(item.children || []);

    const handleTaskAdded = (newSubtask, parentId) => {
        if (parentId === item.id) {
            setTasks(prevTasks => [...prevTasks, newSubtask]);
        } else {
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === parentId 
                        ? { ...task, children: [...task.children, newSubtask] }
                        : task
                )
            );
        }
    };

    const handleTaskDelete = (deletedTaskId) => {
        const deleteRecursive = (tasks, taskId) => {
            // Try finding task directly in the current list
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            
            // If no task was deleted, try looking in children
            if (updatedTasks.length === tasks.length) {
                return tasks.map(task => ({
                    ...task,
                    children: task.children ? deleteRecursive(task.children, taskId) : []
                }));
            }
            
            return updatedTasks;
        };

        setTasks(prevTasks => deleteRecursive(prevTasks, deletedTaskId));
        onTaskDeleted(deletedTaskId);
    };

    return (
        <TaskComponent
            item={{...item, children: tasks}}
            listId={listId}
            onTaskAdded={handleTaskAdded}
            onTaskDeleted={handleTaskDelete}
            parentId={null}
        />
    );
}
