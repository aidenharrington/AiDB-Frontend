import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
} from '@mui/material';
import { useDesignSystem } from '../../theme/ThemeProvider';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'circular' | 'linear';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  variant = 'circular',
  fullScreen = false,
}) => {
  const { colors, typography } = useDesignSystem();

  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 64;
      default:
        return 40;
    }
  };

  const getMessageSize = () => {
    switch (size) {
      case 'small':
        return 'body2';
      case 'large':
        return 'h6';
      default:
        return 'body1';
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      {variant === 'circular' ? (
        <CircularProgress
          size={getSize()}
          sx={{
            color: colors.primary.main,
          }}
        />
      ) : (
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <LinearProgress
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.neutral[200],
              '& .MuiLinearProgress-bar': {
                backgroundColor: colors.primary.main,
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}
      
      {message && (
        <Typography
          variant={getMessageSize()}
          sx={{
            color: colors.text.secondary,
            fontWeight: typography.fontWeight.medium,
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.background.default,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;
