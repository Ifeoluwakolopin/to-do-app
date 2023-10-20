import React from 'react';
import AddList from '../components/AddList';
import ListCardArea from '../components/ListCardArea';

export default function HomePage({ lists }) {
    return (
        <div className="home-page-content">
            <div className="mb-4">
                <AddList />
            </div>
            <ListCardArea lists={lists} />
        </div>
    );
}
