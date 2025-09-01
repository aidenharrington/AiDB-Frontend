import axios from 'axios';
import { handleHttpError } from '../util/HttpUtil';
import { APIResponse, Tier } from '../types/Tier';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';

const usersUrl = `${baseUrl}/users`;

export interface UserDTO {
  userId: string;
}

export interface UserSetupError {
  message: string;
  userFriendlyMessage: string;
  isRetryable: boolean;
}

export const setupNewUser = async (token: string): Promise<{ user: UserDTO, tier: Tier | null }> => {
  try {
    const response = await axios.post<APIResponse<UserDTO>>(usersUrl, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return {
      user: response.data.data,
      tier: response.data.meta.tier
    };
  } catch (error: any) {
    // Handle specific user setup errors with user-friendly messages
    const userSetupError = handleUserSetupError(error);
    
    throw userSetupError;
  }
};

/**
 * Handles user setup specific errors and converts them to user-friendly messages
 */
const handleUserSetupError = (error: any): UserSetupError => {
  const status = error?.response?.status;
  const errorData = error?.response?.data;
  
  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      return {
        message: errorData?.message || 'Bad request during user setup',
        userFriendlyMessage: 'Invalid user information. Please try again.',
        isRetryable: false
      };
    case 401:
      return {
        message: 'Unauthorized during user setup',
        userFriendlyMessage: 'Authentication failed. Please log in again.',
        isRetryable: true
      };
    case 403:
      return {
        message: 'Forbidden during user setup',
        userFriendlyMessage: 'You do not have permission to create an account.',
        isRetryable: false
      };
    case 409:
      return {
        message: 'User already exists',
        userFriendlyMessage: 'An account with this email already exists. Please sign in instead.',
        isRetryable: false
      };
    case 422:
      return {
        message: errorData?.message || 'Validation error during user setup',
        userFriendlyMessage: 'Please check your information and try again.',
        isRetryable: true
      };
    case 429:
      return {
        message: 'Too many requests during user setup',
        userFriendlyMessage: 'Too many attempts. Please wait a moment and try again.',
        isRetryable: true
      };
    case 500:
      return {
        message: 'Server error during user setup',
        userFriendlyMessage: 'Server error. Please try again in a moment.',
        isRetryable: true
      };
    case 503:
      return {
        message: 'Service unavailable during user setup',
        userFriendlyMessage: 'Service temporarily unavailable. Please try again later.',
        isRetryable: true
      };
    default:
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        return {
          message: 'Network error during user setup',
          userFriendlyMessage: 'Network error. Please check your internet connection and try again.',
          isRetryable: true
        };
      }
      
      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          message: 'Timeout during user setup',
          userFriendlyMessage: 'Request timed out. Please try again.',
          isRetryable: true
        };
      }
      
      // Generic error fallback
      return {
        message: errorData?.message || error.message || 'Unknown error during user setup',
        userFriendlyMessage: 'Failed to create account. Please try again.',
        isRetryable: true
      };
  }
};
