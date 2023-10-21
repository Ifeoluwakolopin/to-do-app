import { createContext, useContext, useState } from 'react';

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

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null); // 3. Reset the token on logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
}
