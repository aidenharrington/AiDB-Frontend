import axios from 'axios';
import { FeedbackDTO, FeedbackSubmissionResponse } from '../types/Feedback';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';

const feedbackUrl = `${baseUrl}/feedback`;

export const submitFeedback = async (token: string, feedback: FeedbackDTO): Promise<FeedbackSubmissionResponse> => {
  try {
    const response = await axios.post<{ meta: any; data: string }>(
      feedbackUrl,
      feedback,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // Backend returns APIResponse<String> format with 200 status for success
    return {
      success: true,
      message: 'Feedback submitted successfully'
    };
  } catch (error: any) {
    // Handle specific feedback submission errors
    const status = error?.response?.status;
    let message = 'Failed to submit feedback. Please try again.';
    
    switch (status) {
      case 400:
        message = 'Invalid feedback data. Please check your input and try again.';
        break;
      case 401:
        message = 'Authentication failed. Please log in again.';
        break;
      case 403:
        message = 'You do not have permission to submit feedback.';
        break;
      case 422:
        message = 'Please provide a valid message.';
        break;
      case 429:
        message = 'Too many requests. Please wait a moment and try again.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
          message = 'Network error. Please check your internet connection.';
        }
        break;
    }
    
    throw new Error(message);
  }
};
