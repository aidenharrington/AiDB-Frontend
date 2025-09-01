import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  AlertTitle
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  loading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'error.main'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: 'error.main',
        fontWeight: 'bold'
      }}>
        <WarningIcon color="error" />
        {title}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Warning: This action cannot be undone</AlertTitle>
            {message}
          </Alert>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            You are about to delete: <strong>{itemName}</strong>
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            This will permanently remove all associated data and cannot be recovered.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
          sx={{ minWidth: 80 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={loading}
          variant="contained" 
          color="error"
          sx={{ 
            minWidth: 80,
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
