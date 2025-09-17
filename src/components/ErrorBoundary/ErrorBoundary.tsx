import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh,
  Home,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDesignSystem } from '../../theme/ThemeProvider';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const ErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  const navigate = useNavigate();
  const { colors, typography } = useDesignSystem();

  const handleGoHome = () => {
    navigate('/projects');
    resetError();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        backgroundColor: colors.background.default,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          textAlign: 'center',
          border: `1px solid ${colors.border.light}`,
          borderRadius: 2,
        }}
      >
        <ErrorIcon
          sx={{
            fontSize: 64,
            color: colors.error.main,
            mb: 2,
          }}
        />
        
        <Typography
          variant="h4"
          sx={{
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            mb: 2,
          }}
        >
          Something went wrong
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: colors.text.secondary,
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          We encountered an unexpected error. Please try refreshing the page or go back to the home page.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              textAlign: 'left',
            }}
          >
            <AlertTitle>Error Details</AlertTitle>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {error.message}
            </Typography>
            {error.stack && (
              <details style={{ marginTop: '8px' }}>
                <summary style={{ cursor: 'pointer', color: colors.text.secondary }}>
                  Stack Trace
                </summary>
                <pre style={{ 
                  fontSize: '0.75rem', 
                  overflow: 'auto', 
                  maxHeight: '200px',
                  margin: '8px 0 0 0',
                  padding: '8px',
                  backgroundColor: colors.neutral[50],
                  borderRadius: '4px',
                  border: `1px solid ${colors.border.light}`,
                }}>
                  {error.stack}
                </pre>
              </details>
            )}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': {
                backgroundColor: colors.primary.dark,
              },
            }}
          >
            Refresh Page
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{
              borderColor: colors.border.medium,
              color: colors.text.primary,
              '&:hover': {
                borderColor: colors.primary.main,
                backgroundColor: `${colors.primary.main}08`,
              },
            }}
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Add error logging service here
      console.error('Error logged to external service');
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
