import { createContext, useContext } from 'react';

const ApiContext = createContext();

export function useApi() {
    return useContext(ApiContext);
}

const API_BASE_URL = 'http://127.0.0.1:5000';

export function fetchRequest(endpoint, method = 'GET', body, token) {

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const config = {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null,
        credentials: 'include',
    };

    return fetch(`${API_BASE_URL}${endpoint}`, config)
        .then(response => {
            return response.json()
                .then(data => ({
                    data: data,
                    status: response.status
                }));
        });
}

export default function ApiProvider({ children }) {
    const apiFunctions = {
        fetchRequest,
    };

    return <ApiContext.Provider value={apiFunctions}>{children}</ApiContext.Provider>;
}