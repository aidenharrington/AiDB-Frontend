import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../context/AuthProvider';
import { useDesignSystem } from '../../theme/ThemeProvider';
import Navbar from '../Navigation/Navbar';
import LoadingSpinner from '../Loading/LoadingSpinner';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { colors } = useDesignSystem();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading application..." />;
  }

  if (!user) {
    return null; // Let the router handle redirect
  }

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.background.default,
            pt: '64px', // Navbar height
          }}
        >
          {/* Page Content */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              overflow: 'auto',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default MainLayout;
