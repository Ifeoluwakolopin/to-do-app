import React, { createContext, useContext } from 'react';

// Create the API Context
const ApiContext = createContext();

// Custom Hook to access the API functions
export function useApi() {
    return useContext(ApiContext);
}

const API_BASE_URL = 'http://127.0.0.1:5000';

export function fetchRequest(endpoint, method = 'GET', body) {
    const headers = {
        'Content-Type': 'application/json',
    };

    const config = {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null,
        credentials: 'include',
    };

    return fetch(`${API_BASE_URL}${endpoint}`, config)
        .then(response => {
            return response.json().then(data => ({
                status: response.status, 
                data: data
            }));
        });
}

export default function ApiProvider({ children }) {
    // Bundle up all API functions into an object
    const apiFunctions = {
        fetchRequest,
    };

    // Provide the API functions to all children components
    return (
        <ApiContext.Provider value={apiFunctions}>
            {children}
        </ApiContext.Provider>
    );
}
