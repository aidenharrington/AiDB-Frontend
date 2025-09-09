import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Feedback, BugReport } from '@mui/icons-material';
import { useDesignSystem } from '../theme/ThemeProvider';
import { FeedbackType, FeedbackDTO } from '../types/Feedback';
import { submitFeedback } from '../service/FeedbackService';
import { useAuth } from '../context/AuthProvider';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const { colors, typography, spacing, borderRadius } = useDesignSystem();
  
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('FEEDBACK');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackType(event.target.value as FeedbackType);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (!user) {
      setError('You must be logged in to submit feedback');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const feedback: FeedbackDTO = {
        type: feedbackType,
        message: message.trim(),
      };

      const token = await user.getIdToken();
      const response = await submitFeedback(token, feedback);

      if (response.success) {
        setSuccess(true);
        setMessage('');
        setFeedbackType('FEEDBACK');
        // Auto-close after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      setSuccess(false);
      setMessage('');
      setFeedbackType('FEEDBACK');
      onClose();
    }
  };

  const getTypeLabel = () => {
    return feedbackType === 'FEEDBACK' ? 'Feedback' : 'Bug Report';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: borderRadius.lg,
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: spacing[3],
          borderBottom: `1px solid ${colors.border.light}`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
          }}
        >
          Submit Feedback
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: spacing[4] }}>
        {success ? (
          <Alert
            severity="success"
            sx={{
              mb: spacing[3],
              borderRadius: borderRadius.base,
            }}
          >
            Thank you for your {getTypeLabel().toLowerCase()}! We'll review it and get back to you if needed.
          </Alert>
        ) : (
          <>
            <FormControl component="fieldset" sx={{ mb: spacing[1] }}>
              <FormLabel
                component="legend"
                sx={{
                  color: colors.text.primary,
                  fontWeight: typography.fontWeight.medium,
                  mb: spacing[1],
                }}
              >
                What would you like to submit?
              </FormLabel>
              <RadioGroup
                value={feedbackType}
                onChange={handleTypeChange}
                sx={{ 
                  gap: spacing[1],
                  flexDirection: 'row',
                }}
              >
                <FormControlLabel
                  value="FEEDBACK"
                  control={
                    <Radio
                      sx={{
                        color: colors.primary.main,
                        '&.Mui-checked': {
                          color: colors.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                      <Feedback sx={{ fontSize: 20, color: colors.info.main }} />
                      <Typography sx={{ color: colors.text.primary }}>
                        General Feedback
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="BUG"
                  control={
                    <Radio
                      sx={{
                        color: colors.primary.main,
                        '&.Mui-checked': {
                          color: colors.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                      <BugReport sx={{ fontSize: 20, color: colors.success.main }} />
                      <Typography sx={{ color: colors.text.primary }}>
                        Bug Report
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={6}
              value={message}
              onChange={handleMessageChange}
              placeholder={
                feedbackType === 'FEEDBACK'
                  ? 'Tell us what you think about AiDB. What do you like? What could be improved?'
                  : 'Describe the bug you encountered. Include steps to reproduce it if possible.'
              }
              variant="outlined"
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: borderRadius.base,
                  '& fieldset': {
                    borderColor: colors.border.medium,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.border.dark,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: typography.body1.fontSize,
                  color: colors.text.primary,
                },
                '& .MuiInputBase-input::placeholder': {
                  color: colors.text.disabled,
                  opacity: 1,
                },
              }}
            />

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: spacing[2],
                  borderRadius: borderRadius.base,
                }}
              >
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: spacing[3],
          pt: spacing[2],
          borderTop: `1px solid ${colors.border.light}`,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            color: colors.text.secondary,
            textTransform: 'none',
            fontWeight: typography.fontWeight.medium,
          }}
        >
          {success ? 'Close' : 'Cancel'}
        </Button>
        {!success && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim()}
            variant="contained"
            sx={{
              backgroundColor: colors.primary.main,
              color: colors.primary.contrastText,
              textTransform: 'none',
              fontWeight: typography.fontWeight.medium,
              px: spacing[3],
              py: spacing[1],
              borderRadius: borderRadius.base,
              '&:hover': {
                backgroundColor: colors.primary.light,
              },
              '&:disabled': {
                backgroundColor: colors.neutral[300],
                color: colors.text.disabled,
              },
            }}
          >
            {isSubmitting ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                <CircularProgress size={16} sx={{ color: colors.primary.contrastText }} />
                Submitting...
              </Box>
            ) : (
              `Submit ${getTypeLabel()}`
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
