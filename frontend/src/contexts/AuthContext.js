import { createContext, useContext, useState } from 'react';
import { fetchRequest } from './ApiProvider';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('isAuthenticated') === 'true'
    );

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await fetchRequest('/logout', 'POST');
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Failed to log out:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
