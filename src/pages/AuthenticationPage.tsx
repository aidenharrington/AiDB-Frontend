import React, { useState } from 'react';
import {
    Container, TextField, Button, Typography, Stack,
} from '@mui/material';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../config/firebase';


const AuthenticationPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleAuth = () => {
        if (isRegistering) {
            if (password !== confirmPassword) {
                // TODO - MVP - Proper error
                alert("Passwords do not match.");
                return;
            }
            createUserWithEmailAndPassword(auth, email, password)
                .then((user) => console.log('Signed up: ', user))
                // TODO - MVP - Proper error
                .catch((err) => alert(err.message));
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then((user) => console.log('Signed in: ', user))
                // TODO - MVP - Proper error
                .catch((err) => alert(err.message));
        }
    };

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
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
            </Stack>
        </Container>
    );
};

export default AuthenticationPage;