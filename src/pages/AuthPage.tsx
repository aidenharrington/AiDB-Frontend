import React, { useState } from 'react';
import {
    Container, TextField, Button, Typography, Stack,
} from '@mui/material';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { setupNewUser } from '../service/UserService';


const AuthPage: React.FC = () => {
    const ProjectsPage = "/projects";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate = useNavigate();

    const handleAuth = async () => {
        if (isRegistering) {
            if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match.");
                return;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Get the Firebase ID token
                const idToken = await user.getIdToken();
                
                // Call backend to setup user in database
                const { user: userData, tier } = await setupNewUser(idToken);
                
                navigate(ProjectsPage);
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                navigate(ProjectsPage);
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        }
    };

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
    }

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                {isRegistering ? 'Register' : 'Sign In'}
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isRegistering && (
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}

                <Button variant="contained" onClick={handleAuth}>
                    {isRegistering ? 'Register' : 'Login'}
                </Button>

                <Button variant="text" onClick={() => toggleAuthMode()}>
                    {isRegistering
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Register"}
                </Button>
                
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

            </Stack>
        </Container>
    );
};

export default AuthPage;