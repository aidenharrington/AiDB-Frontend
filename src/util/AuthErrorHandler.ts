import { FirebaseError } from 'firebase/app';

export interface AuthError {
    code: string;
    message: string;
    userFriendlyMessage: string;
}

export class AuthErrorHandler {
    /**
     * Converts Firebase authentication errors to user-friendly messages
     */
    static getAuthErrorMessage(error: FirebaseError | Error | unknown): string {
        // Handle Firebase errors
        if (error instanceof FirebaseError) {
            return this.getFirebaseErrorMessage(error);
        }
        
        // Handle generic errors
        if (error instanceof Error) {
            return this.getGenericErrorMessage(error);
        }
        
        // Handle unknown errors
        return "An unexpected error occurred. Please try again.";
    }

    /**
     * Maps Firebase error codes to user-friendly messages
     */
    private static getFirebaseErrorMessage(error: FirebaseError): string {
        switch (error.code) {
            // Registration errors
            case 'auth/email-already-in-use':
                return "Email already in use. Please try a different email or sign in.";
            case 'auth/invalid-email':
                return "Invalid email address. Please check your email and try again.";
            case 'auth/operation-not-allowed':
                return "Email/password accounts are not enabled. Please contact support.";
            case 'auth/weak-password':
                return "Password is too weak. Please choose a stronger password (at least 6 characters).";
            case 'auth/user-disabled':
                return "This account has been disabled. Please contact support.";
            
            // Login errors
            case 'auth/user-not-found':
                return "No account found with this email. Please check your email or create a new account.";
            case 'auth/wrong-password':
                return "Incorrect password. Please check your password and try again.";
            case 'auth/too-many-requests':
                return "Too many failed attempts. Please try again later.";
            case 'auth/network-request-failed':
                return "Network error. Please check your internet connection and try again.";
            case 'auth/invalid-credential':
                return "Invalid email or password. Please check your credentials and try again.";
            
            // General authentication errors
            case 'auth/requires-recent-login':
                return "Please log in again to continue with this action.";
            case 'auth/account-exists-with-different-credential':
                return "An account already exists with the same email but different sign-in credentials.";
            case 'auth/credential-already-in-use':
                return "This credential is already associated with a different user account.";
            case 'auth/invalid-verification-code':
                return "Invalid verification code. Please check the code and try again.";
            case 'auth/invalid-verification-id':
                return "Invalid verification ID. Please request a new verification code.";
            case 'auth/quota-exceeded':
                return "Service temporarily unavailable. Please try again later.";
            case 'auth/unauthorized-domain':
                return "This domain is not authorized for OAuth operations.";
            
            // Default case for unknown Firebase errors
            default:
                console.warn('Unhandled Firebase error code:', error.code, error.message);
                return "Authentication failed. Please try again.";
        }
    }

    /**
     * Handles generic JavaScript errors
     */
    private static getGenericErrorMessage(error: Error): string {
        // Handle common network errors
        if (error.message.includes('network') || error.message.includes('fetch')) {
            return "Network error. Please check your internet connection and try again.";
        }
        
        // Handle timeout errors
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
            return "Request timed out. Please try again.";
        }
        
        // Handle generic errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return "Unable to connect to the server. Please check your internet connection.";
        }
        
        // Log unexpected errors for debugging
        console.warn('Unhandled generic error:', error.message);
        return "An error occurred. Please try again.";
    }

    /**
     * Checks if an error is a Firebase authentication error
     */
    static isFirebaseAuthError(error: unknown): error is FirebaseError {
        return error instanceof FirebaseError && error.code.startsWith('auth/');
    }

    /**
     * Gets detailed error information for debugging (development only)
     */
    static getDetailedErrorInfo(error: FirebaseError | Error | unknown): string {
        if (process.env.NODE_ENV === 'development') {
            if (error instanceof FirebaseError) {
                return `Firebase Error: ${error.code} - ${error.message}`;
            }
            if (error instanceof Error) {
                return `Error: ${error.message}`;
            }
            return `Unknown error: ${String(error)}`;
        }
        return '';
    }
}
