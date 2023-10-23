import React, { useState, useEffect } from 'react';
import AddList from '../components/AddList';
import ListCardArea from '../components/ListCardArea';
import { useApi } from '../contexts/ApiProvider';

export default function HomePage() {
    const [lists, setLists] = useState([]);
    const { fetchRequest } = useApi();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await fetchRequest('/lists', 'GET');
                if (response.status === 200) {
                    setLists(response.data);
                } else {
                    console.error('Failed to fetch lists:', response.data.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        fetchLists();
    }, [fetchRequest]);

    const addNewList = (newList) => {
        setLists(prevLists => {
            const updatedLists = [...prevLists, newList];
            console.log('Updated lists:', updatedLists);
            return updatedLists;
        });
    };

    const handleListDeleted = (deletedListId) => {
        // Remove the deleted list from the lists state
        setLists((prevLists) => prevLists.filter((list) => list.id !== deletedListId));
    };

    return (
        <div className="home-page-content">
            <div className="mb-4">
                <AddList onListAdded={addNewList} />
            </div>
            <ListCardArea lists={lists} onListDeleted={handleListDeleted} /> {/* Corrected prop name */}
        </div>
    );
}
