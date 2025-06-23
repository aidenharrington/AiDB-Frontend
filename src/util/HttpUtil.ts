import axios from 'axios';

type ErrorOverride = Record<number, string>;

export function handleHttpError(status: number,
    error: any,
    overrides: ErrorOverride = {}
): never {
    const defaultMessages: Record<number, string> = {
        401: 'Unauthorized: You are not authorized.',
        403: 'Forbidden: You do not have permission to perform this action.',
        422: 'Unprocessable Entity.',
        500: 'Server error: Something went wrong on our end.'
    };

    const message = 
    overrides[status] ??
    defaultMessages[status] ??
    error?.response?.data ??
    'Unexpected error occurred.';

    throw new Error(message);

    
}