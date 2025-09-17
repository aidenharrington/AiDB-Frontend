import React from 'react';
import { Box, Typography, Alert, AlertTitle } from '@mui/material';
import { CheckCircle as SuccessIcon, Error as ErrorIcon, Info as InfoIcon, Warning as WarningIcon } from '@mui/icons-material';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

interface MessageDisplayProps {
  message: string;
  type: MessageType;
  title?: string;
  showIcon?: boolean;
  maxWidth?: string | number;
  sx?: any;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ 
  message, 
  type, 
  title, 
  showIcon = true, 
  maxWidth = '100%',
  sx = {} 
}) => {
  if (!message) return null;

  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        mt: 2,
        maxWidth,
        width: '100%',
        ...sx
      }}
    >
      <Alert 
        severity={type}
        icon={getIcon()}
        sx={{
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            lineHeight: 1.5
          }}
        >
          {message}
        </Typography>
      </Alert>
    </Box>
  );
};

export default MessageDisplay;
