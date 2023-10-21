import { createContext, useContext, useState } from 'react';
import { fetchRequest } from './ApiProvider';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null); // 1. Add a state for the token

    const login = (authToken) => { // 2. Modify the login to accept a token
        setIsAuthenticated(true);
        setToken(authToken);
    };

    const authLogout = () => {
        setIsAuthenticated(false);
        setToken(null);
    };

    const logout = async () => {
        try {
            await fetchRequest('/logout', 'POST');
            authLogout();
        } catch (error) {
            console.error("Failed to log out:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
}
