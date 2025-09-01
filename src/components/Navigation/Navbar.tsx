import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useDesignSystem } from '../../theme/ThemeProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import AiDBLogo from '../AiDBLogo';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, typography } = useDesignSystem();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Session timeout management (8 hours)
  const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check session timeout every minute
    const timeoutCheck = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        handleLogout();
      }
    }, 60000);

    setSessionTimeout(timeoutCheck);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      if (timeoutCheck) clearInterval(timeoutCheck);
    };
  }, [lastActivity]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      if (sessionTimeout) clearInterval(sessionTimeout);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    handleMenuClose();
    // Navigate to profile page when implemented
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    // Navigate to settings page when implemented
  };

  const navigationItems = [
    { label: 'Projects', path: '/projects' },
    { label: 'Why AiDB', path: '/why-aidb' },
    { label: 'How to Use', path: '/how-to-use' },
    { label: 'Roadmap', path: '/roadmap' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/projects') {
      return location.pathname === '/projects' || location.pathname.startsWith('/projects/');
    }
    return location.pathname === path;
  };

  const getUserInitials = () => {
    if (!user?.displayName && !user?.email) return 'U';
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: colors.background.paper,
        borderBottom: `1px solid ${colors.border.light}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 3 }}>
        {/* Logo Section - Left Aligned */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            mr: 4,
          }}
          onClick={() => navigate('/projects')}
        >
          <AiDBLogo size="small" variant="horizontal" showTagline={false} />
        </Box>

        {/* Navigation Items - Center */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                color: isActive(item.path) 
                  ? colors.primary.main 
                  : colors.text.secondary,
                fontWeight: isActive(item.path) 
                  ? typography.fontWeight.medium 
                  : typography.fontWeight.regular,
                textTransform: 'none',
                px: 2,
                py: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: isActive(item.path)
                    ? `${colors.primary.main}15`
                    : colors.neutral[50],
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User Section - Right Aligned */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={user?.email || 'User'}
            size="small"
            sx={{
              backgroundColor: colors.primary.light,
              color: colors.primary.contrastText,
              fontWeight: typography.fontWeight.medium,
              maxWidth: 200,
              '& .MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
          />
          
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuOpen}
              sx={{ color: colors.text.primary }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                border: `1px solid ${colors.border.light}`,
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: colors.error.main }}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
