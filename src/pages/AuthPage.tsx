import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AiDBLogo from '../components/AiDBLogo';
import MessageDisplay from '../components/MessageDisplay';
import { auth } from '../config/firebase';
import { setupNewUser } from '../service/UserService';
import { AuthErrorHandler } from '../util/AuthErrorHandler';
import { PasswordValidator } from '../util/PasswordValidator';


const AuthPage: React.FC = () => {
    const ProjectsPage = "/projects";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState<ReturnType<typeof PasswordValidator.validatePassword> | null>(null);
    const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; message: string } | null>(null);

    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    // Focus management
    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const validateForm = (): string | null => {
        if (!email.trim()) {
            return "Email is required.";
        }
        
        // Check email format
        if (emailValidation && !emailValidation.isValid) {
            return "Please enter a valid email address.";
        }
        
        if (!password) {
            return "Password is required.";
        }
        
        if (isRegistering) {
            if (password !== confirmPassword) {
                return "Passwords do not match.";
            }
            
            // Check password strength for registration
            if (passwordValidation && !passwordValidation.isValid) {
                return "Please fix password issues before continuing.";
            }
        }
        
        return null;
    };

    const handleAuth = async () => {
        if (isLoading) return;
        
        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
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
                try {
                    const { user: userData, tier } = await setupNewUser(idToken);
                    navigate(ProjectsPage);
                } catch (setupError: any) {
                    // Handle user setup errors specifically
                    if (setupError.userFriendlyMessage) {
                        setErrorMessage(setupError.userFriendlyMessage);
                        
                        // If the error is not retryable, we might want to clean up the Firebase user
                        if (!setupError.isRetryable && setupError.message.includes('already exists')) {
                            // User was created in Firebase but backend setup failed due to existing user
                            // We could potentially sign out the user here, but for now just show the error
                            console.warn('User setup failed after Firebase account creation:', setupError);
                        }
                    } else {
                        // Fallback to generic error handling
                        setErrorMessage("Failed to create account. Please try again.");
                    }
                }
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                navigate(ProjectsPage);
            }
        } catch (err: any) {
            // Use the AuthErrorHandler to get user-friendly error messages
            const userFriendlyMessage = AuthErrorHandler.getAuthErrorMessage(err);
            setErrorMessage(userFriendlyMessage);
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

    const validateEmail = (email: string): { isValid: boolean; message: string } => {
        if (!email) {
            return { isValid: false, message: '' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        
        return { isValid: true, message: '' };
    };

    const handleEmailChange = (newEmail: string) => {
        setEmail(newEmail);
        if (newEmail) {
            setEmailValidation(validateEmail(newEmail));
        } else {
            setEmailValidation(null);
        }
    };

    const handlePasswordChange = (newPassword: string) => {
        setPassword(newPassword);
        if (isRegistering && newPassword) {
            setPasswordValidation(PasswordValidator.validatePassword(newPassword));
        } else {
            setPasswordValidation(null);
        }
    };

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        setPasswordValidation(null);
        setEmailValidation(null);
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
                    onChange={(e) => handleEmailChange(e.target.value)}
                    inputRef={emailRef}
                    inputProps={{
                        'aria-describedby': 'email-helper-text',
                        'aria-required': 'true',
                    }}
                    error={!!emailValidation && !emailValidation.isValid}
                    helperText={
                        emailValidation && !emailValidation.isValid 
                            ? emailValidation.message 
                            : !email && errorMessage 
                                ? "Email is required" 
                                : ""
                    }
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
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    inputRef={passwordRef}
                    inputProps={{
                        'aria-describedby': 'password-helper-text',
                        'aria-required': 'true',
                    }}
                    error={!!errorMessage && !password}
                    helperText={!password && errorMessage ? "Password is required" : ""}
                />
                
                {/* Password strength indicator for registration */}
                {isRegistering && passwordValidation && (
                    <Box sx={{ mt: -1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: PasswordValidator.getStrengthColor(passwordValidation.strength),
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {PasswordValidator.getStrengthDescription(passwordValidation.strength)}
                            </Typography>
                        </Box>
                        
                        {/* Show suggestions for weak passwords */}
                        {passwordValidation.suggestions.length > 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Suggestions: {passwordValidation.suggestions.join(', ')}
                            </Typography>
                        )}
                        
                        {/* Show errors for invalid passwords */}
                        {passwordValidation.errors.length > 0 && (
                            <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                                {passwordValidation.errors.join(', ')}
                            </Typography>
                        )}
                    </Box>
                )}
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
                
                {/* Forgot password link for login mode */}
                {!isRegistering && (
                    <Button 
                        variant="text" 
                        onClick={() => {
                            // TODO: Implement forgot password functionality
                            setErrorMessage("Password reset functionality coming soon. Please contact support if you need assistance.");
                        }}
                        type="button"
                        size="small"
                        sx={{ fontSize: '0.875rem' }}
                    >
                        Forgot your password?
                    </Button>
                )}
                
                <MessageDisplay 
                    message={errorMessage} 
                    type="error" 
                    maxWidth="400px"
                    sx={{ 
                        mx: 'auto',
                        '& .MuiAlert-root': {
                            textAlign: 'center'
                        }
                    }}
                />
                
                {/* Show retry suggestion for retryable errors */}
                {errorMessage.includes('try again') && !errorMessage.includes('do not match') && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ display: 'block', mt: 1 }}
                    >
                        You can try again with the same information.
                    </Typography>
                )}
                
                {/* Show specific help for common errors */}
                {errorMessage.includes('Email already in use') && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ display: 'block', mt: 1 }}
                    >
                        Try signing in instead, or use a different email address.
                    </Typography>
                )}
                
                {errorMessage.includes('Password is too weak') && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ display: 'block', mt: 1 }}
                    >
                        Use at least 6 characters with a mix of letters, numbers, and symbols.
                    </Typography>
                )}
                
                {errorMessage.includes('Network error') && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ display: 'block', mt: 1 }}
                    >
                        Check your internet connection and try again.
                    </Typography>
                )}
                
                {errorMessage.includes('Invalid email address') && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ display: 'block', mt: 1 }}
                    >
                        Please enter a valid email address (e.g., user@example.com).
                    </Typography>
                )}
                
                {errorMessage.includes('Too many failed attempts') && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ display: 'block', mt: 1 }}
                    >
                        Wait a few minutes before trying again, or reset your password.
                    </Typography>
                )}
                
                {errorMessage.includes('No account found') && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ display: 'block', mt: 1 }}
                    >
                        Check your email address or create a new account.
                    </Typography>
                )}

            </Stack>
        </Container>
    );
};

export default AuthPage;