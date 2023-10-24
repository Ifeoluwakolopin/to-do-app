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

    return (
        <TaskComponent
            item={{...item, children: tasks}}
            listId={listId}
            onTaskAdded={handleTaskAdded}
            onTaskDeleted={onTaskDeleted}
            tasks={tasks}  
            setTasks={setTasks}
        />
    );
}