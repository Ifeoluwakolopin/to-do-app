import  { createContext, useContext } from 'react';

const ApiContext = createContext();

export function useApi() {
    return useContext(ApiContext);
}

const API_BASE_URL = 'http://127.0.0.1:5000';

function fetchRequest(endpoint, method = 'GET', body, token) {  // Re-add the token parameter

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
            // First, check if the request was successful based on the status code
            if (response.status >= 200 && response.status < 300) {
                // Return the parsed JSON if request was successful
                return response.json();
            } else {
                // If request failed, reject the promise with the status code
                throw response.status;
            }
        });
}

export default function ApiProvider({ children }) {
    const apiFunctions = {
        fetchRequest,
    };

    return <ApiContext.Provider value={apiFunctions}>{children}</ApiContext.Provider>;
}
