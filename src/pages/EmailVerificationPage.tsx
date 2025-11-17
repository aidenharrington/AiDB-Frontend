import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import { sendEmailVerification } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AiDBLogo from '../components/AiDBLogo';
import MessageDisplay from '../components/MessageDisplay';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthProvider';

const EmailVerificationPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
    const [isCheckingVerification, setIsCheckingVerification] = useState<boolean>(false);

    const emailVerificationEnabled = process.env.REACT_APP_ENABLE_EMAIL_VERIFICATION === 'true';

    // Timer effect - only runs when there's a cooldown active
    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setTimeout(() => {
                setRemainingTime(remainingTime - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (remainingTime === 0 && isResendDisabled) {
            setIsResendDisabled(false);
        }
    }, [remainingTime, isResendDisabled]);

    // Check verification status periodically
    useEffect(() => {
        const checkVerification = async () => {
            if (!user) return;

            try {
                // Reload user to get latest email verification status
                await user.reload();
                const refreshedUser = auth.currentUser;

                if (refreshedUser?.emailVerified || !emailVerificationEnabled) {
                    // Email is verified or verification is disabled, redirect to projects
                    navigate('/projects', { replace: true });
                }
            } catch (error) {
                console.error('Error checking email verification:', error);
            }
        };

        // Check immediately on mount
        checkVerification();

        // Check every 60 seconds
        const interval = setInterval(checkVerification, 60000);

        return () => clearInterval(interval);
    }, [user, navigate, emailVerificationEnabled]);

    // Redirect if verification not enabled or user not logged in
    useEffect(() => {
        if (!emailVerificationEnabled) {
            navigate('/projects', { replace: true });
            return;
        }

        if (!user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate, emailVerificationEnabled]);

    const handleResendEmail = async () => {
        if (!user || isResendDisabled) return;

        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Configure action code settings with redirect URL
            const actionCodeSettings = {
                url: `${window.location.origin}/projects`,
                handleCodeInApp: false,
            };

            await sendEmailVerification(user, actionCodeSettings);
            setSuccessMessage('Verification email sent! Please check your inbox.');
            
            // Start cooldown based on Firebase's typical rate limit (60 seconds)
            setIsResendDisabled(true);
            setRemainingTime(60);
        } catch (error: any) {
            console.error('Error sending verification email:', error);
            
            if (error.code === 'auth/too-many-requests') {
                // Firebase's rate limit is active - set a cooldown timer
                setErrorMessage('Too many requests. Please wait before trying again.');
                setIsResendDisabled(true);
                setRemainingTime(60);
            } else {
                setErrorMessage('Failed to send verification email. Please try again.');
            }
        }
    };

    const handleManualRefresh = async () => {
        if (!user) return;

        setErrorMessage('');
        setSuccessMessage('');
        setIsCheckingVerification(true);

        try {
            await user.reload();
            const refreshedUser = auth.currentUser;

            if (refreshedUser?.emailVerified) {
                setSuccessMessage('Email verified! Redirecting...');
                setTimeout(() => {
                    navigate('/projects', { replace: true });
                }, 1000);
            } else {
                setErrorMessage('Email not verified yet. Please check your inbox and click the verification link.');
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
            setErrorMessage('Failed to check verification status. Please try again.');
        } finally {
            setIsCheckingVerification(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: '12vh', mb: 4 }}>
            {/* Logo Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                <AiDBLogo size="large" variant="vertical" />
            </Box>

            <Typography variant="h5" align="center" gutterBottom sx={{ mb: 2, color: 'text.primary' }}>
                Verify Your Email
            </Typography>

            <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
                We've sent a verification email to <strong>{user.email}</strong>.
                Please check your inbox and click the verification link to continue.
            </Typography>

            <Stack spacing={3}>
                <Box sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>What to do:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="ol" sx={{ pl: 2, mb: 0 }}>
                        <li>Check your email inbox (and spam folder)</li>
                        <li>Click the verification link in the email</li>
                        <li>You'll be automatically redirected to your dashboard</li>
                    </Typography>
                </Box>

                <Button 
                    variant="contained" 
                    onClick={handleResendEmail}
                    disabled={isResendDisabled}
                    fullWidth
                    sx={{ minHeight: 48 }}
                >
                    {isResendDisabled 
                        ? `Resend Email (${remainingTime}s)` 
                        : 'Resend Verification Email'}
                </Button>

                <Button 
                    variant="outlined" 
                    onClick={handleManualRefresh}
                    fullWidth
                    disabled={isCheckingVerification}
                >
                    {isCheckingVerification ? 'Checking...' : 'I\'ve Verified My Email'}
                </Button>

                <Button 
                    variant="text" 
                    onClick={() => {
                        auth.signOut();
                        navigate('/', { replace: true });
                    }}
                    fullWidth
                    size="small"
                >
                    Sign Out
                </Button>

                {successMessage && (
                    <MessageDisplay 
                        message={successMessage} 
                        type="success" 
                        maxWidth="600px"
                        sx={{ 
                            mx: 'auto',
                            '& .MuiAlert-root': {
                                textAlign: 'center'
                            }
                        }}
                    />
                )}

                {errorMessage && (
                    <MessageDisplay 
                        message={errorMessage} 
                        type="error" 
                        maxWidth="600px"
                        sx={{ 
                            mx: 'auto',
                            '& .MuiAlert-root': {
                                textAlign: 'center'
                            }
                        }}
                    />
                )}

            </Stack>
        </Container>
    );
};

export default EmailVerificationPage;

