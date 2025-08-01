import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Chip,
} from '@mui/material';
import { Logout, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthProvider';

const Navbar: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleLogoClick = () => {
        navigate('/projects');
    };

    const getUserDisplayName = () => {
        if (user?.displayName) {
            return user.displayName;
        }
        if (user?.email) {
            return user.email;
        }
        return 'User';
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.8
                        }
                    }}
                    onClick={handleLogoClick}
                >
                    AiDB
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
                    <Chip
                        icon={<Person />}
                        label={getUserDisplayName()}
                        variant="outlined"
                        sx={{ 
                            color: 'white', 
                            borderColor: 'white',
                            '& .MuiChip-label': { color: 'white' }
                        }}
                    />
                </Box>
                
                <IconButton color="inherit" onClick={handleLogout} title="Sign Out">
                    <Logout />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 