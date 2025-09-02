import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase'; 
import { useTier } from './TierProvider';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
});

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProviderContent: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { refreshTier } = useTier();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const idToken = await firebaseUser.getIdToken();
                setToken(idToken);
                // Force refresh tier info when user logs in
                await refreshTier(idToken);
            } else {
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [refreshTier]);

    return (
        <AuthContext.Provider value={{ user, token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    return (
        <AuthProviderContent>
            {children}
        </AuthProviderContent>
    );
};

export const useAuth = () => useContext(AuthContext);