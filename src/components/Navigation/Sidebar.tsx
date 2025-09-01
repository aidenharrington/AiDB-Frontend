import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import {
  Folder,
  Help,
  Info,
  Timeline,
  Person,
  Home,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDesignSystem } from '../../theme/ThemeProvider';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
}

const DRAWER_WIDTH = 280;

const navigationItems = [
  {
    label: 'AiDB',
    path: '/projects',
    icon: <Home />,
    primary: true,
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: <Folder />,
    primary: true,
  },
  {
    label: 'Why AiDB',
    path: '/why-aidb',
    icon: <Info />,
    primary: false,
  },
  {
    label: 'How to Use',
    path: '/how-to-use',
    icon: <Help />,
    primary: false,
  },
  {
    label: 'Roadmap',
    path: '/roadmap',
    icon: <Timeline />,
    primary: false,
  },
  {
    label: 'About the Creator',
    path: '/about',
    icon: <Person />,
    primary: false,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onClose, 
  variant = 'persistent' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, typography } = useDesignSystem();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const isActive = (path: string) => {
    if (path === '/projects') {
      return location.pathname === '/projects' || location.pathname.startsWith('/projects/');
    }
    return location.pathname === path;
  };

  const primaryItems = navigationItems.filter(item => item.primary);
  const secondaryItems = navigationItems.filter(item => !item.primary);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand Section */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${colors.border.light}`,
          backgroundColor: colors.background.paper,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.bold,
            color: colors.primary.main,
            textAlign: 'center',
          }}
        >
          AiDB
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.text.secondary,
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          AI Database Assistant
        </Typography>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Primary Navigation */}
        <List sx={{ pt: 2 }}>
          <Typography
            variant="overline"
            sx={{
              px: 3,
              py: 1,
              color: colors.text.secondary,
              fontWeight: typography.fontWeight.medium,
              fontSize: '0.75rem',
            }}
          >
            Main Navigation
          </Typography>
          
          {primaryItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: isActive(item.path) 
                    ? `${colors.primary.main}15` 
                    : 'transparent',
                  color: isActive(item.path) 
                    ? colors.primary.main 
                    : colors.text.primary,
                  '&:hover': {
                    backgroundColor: isActive(item.path)
                      ? `${colors.primary.main}25`
                      : colors.neutral[50],
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive(item.path) 
                      ? colors.primary.main 
                      : colors.text.secondary,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) 
                      ? typography.fontWeight.medium 
                      : typography.fontWeight.regular,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Secondary Navigation */}
        <List>
          <Typography
            variant="overline"
            sx={{
              px: 3,
              py: 1,
              color: colors.text.secondary,
              fontWeight: typography.fontWeight.medium,
              fontSize: '0.75rem',
            }}
          >
            Information
          </Typography>
          
          {secondaryItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: isActive(item.path) 
                    ? `${colors.primary.main}15` 
                    : 'transparent',
                  color: isActive(item.path) 
                    ? colors.primary.main 
                    : colors.text.primary,
                  '&:hover': {
                    backgroundColor: isActive(item.path)
                      ? `${colors.primary.main}25`
                      : colors.neutral[50],
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive(item.path) 
                      ? colors.primary.main 
                      : colors.text.secondary,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) 
                      ? typography.fontWeight.medium 
                      : typography.fontWeight.regular,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${colors.border.light}`,
          backgroundColor: colors.background.paper,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: colors.text.secondary,
            textAlign: 'center',
            display: 'block',
          }}
        >
          © 2024 AiDB
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: `1px solid ${colors.border.light}`,
          backgroundColor: colors.background.default,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
