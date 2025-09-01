import React, { useState, useRef, useEffect } from 'react';
import {
    Container, TextField, Button, Typography, Stack, Box,
} from '@mui/material';
import AiDBLogo from '../components/AiDBLogo';
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
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    // Focus management
    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const handleAuth = async () => {
        if (isLoading) return;
        
        if (isRegistering) {
            if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match.");
                return;
            }
        }
        
        if (!email || !password) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }
        
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            if (isRegistering) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Get the Firebase ID token
                const idToken = await user.getIdToken();
                
                // Call backend to setup user in database
                const { user: userData, tier } = await setupNewUser(idToken);
                
                navigate(ProjectsPage);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                navigate(ProjectsPage);
            }
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAuth();
        }
    };

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        // Focus on email field when switching modes
        setTimeout(() => emailRef.current?.focus(), 100);
    }

    return (
        <Container maxWidth="xs" sx={{ mt: '12vh', mb: 4 }}>
            {/* Logo Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                <AiDBLogo size="large" variant="vertical" />
            </Box>

            <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4, color: 'text.secondary' }}>
                {isRegistering ? 'Create your account' : 'Welcome back'}
            </Typography>

            <Stack 
                spacing={3} 
                component="form" 
                onSubmit={(e) => { e.preventDefault(); handleAuth(); }}
                onKeyPress={handleKeyPress}
                aria-label={isRegistering ? "Registration form" : "Login form"}
            >
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputRef={emailRef}
                    inputProps={{
                        'aria-describedby': 'email-helper-text',
                        'aria-required': 'true',
                    }}
                    error={!!errorMessage && !email}
                    helperText={!email && errorMessage ? "Email is required" : ""}
                    autoFocus
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    autoComplete={isRegistering ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    inputRef={passwordRef}
                    inputProps={{
                        'aria-describedby': 'password-helper-text',
                        'aria-required': 'true',
                    }}
                    error={!!errorMessage && !password}
                    helperText={!password && errorMessage ? "Password is required" : ""}
                />
                {isRegistering && (
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        inputRef={confirmPasswordRef}
                        inputProps={{
                            'aria-describedby': 'confirm-password-helper-text',
                            'aria-required': 'true',
                        }}
                        error={!!errorMessage && password !== confirmPassword}
                        helperText={password !== confirmPassword && errorMessage ? "Passwords do not match" : ""}
                    />
                )}

                <Button 
                    variant="contained" 
                    onClick={handleAuth}
                    disabled={isLoading}
                    type="submit"
                    aria-describedby="auth-error"
                >
                    {isLoading ? (isRegistering ? 'Creating Account...' : 'Signing In...') : (isRegistering ? 'Register' : 'Login')}
                </Button>

                <Button 
                    variant="text" 
                    onClick={toggleAuthMode}
                    type="button"
                    aria-label={isRegistering ? "Switch to login mode" : "Switch to registration mode"}
                >
                    {isRegistering
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Register"}
                </Button>
                
                {errorMessage && (
                    <Typography 
                        variant="body2" 
                        color="error" 
                        align="center" 
                        sx={{ mt: 1 }}
                        id="auth-error"
                        role="alert"
                        aria-live="polite"
                    >
                        {errorMessage}
                    </Typography>
                )}

            </Stack>
        </Container>
    );
};

export default AuthPage;