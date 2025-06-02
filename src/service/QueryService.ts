import axios from 'axios';
import { UserQueryData } from '../types/UserQueryData';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
const queryUrl = `${baseUrl}/queries`;

export const executeSql = async (sqlQuery: string): Promise<UserQueryData> => {
    try {
        const response = await axios.post(queryUrl, sqlQuery, {
            headers: {
                'Content-Type': 'text/plain',
            }
        });

        return response.data;
    } catch (error) {
        // Check if the error is from Axios (network-related)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status;

                // Handle specific HTTP status codes
                switch (status) {
                    case 403:
                        throw new Error('Forbidden: You do not have permission to perform this action.');
                    case 400:
                        throw new Error('SQL execution failed. Please check the query.');
                    case 500:
                        throw new Error('Server error: Something went wrong on our end.');
                    default:
                        throw new Error(error.response.data || 'Unexpected error occurred.');
                }
            } else if (error.request) {
                // No response received (e.g., network issue, server down)
                throw new Error('Network error: Please check your internet connection or try again later.');
            } else {
                // Other errors
                throw new Error(`Unexpected error: ${error.message}`);
            }
        } else {
            throw new Error('Unknown error occurred.');
        }
    }
}

export const translateNlToSql = async (nlQuery: string): Promise<string> => {
    const translateUrl = `${queryUrl}/translate`;

    try {
        const response = await axios.post(translateUrl, nlQuery, {
            headers: {
                'Content-Type': 'text/plain',
            }
        });

        return response.data;
    } catch (error) {
        // Check if the error is from Axios (network-related)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status;

                // Handle specific HTTP status codes
                switch (status) {
                    case 403:
                        throw new Error('Forbidden: You do not have permission to perform this action.');
                    case 422:
                        throw new Error('Translation failed. Please check the natural language content.');
                    case 500:
                        throw new Error('Server error: Something went wrong on our end.');
                    default:
                        throw new Error(error.response.data || 'Unexpected error occurred.');
                }
            } else if (error.request) {
                // No response received (e.g., network issue, server down)
                throw new Error('Network error: Please check your internet connection or try again later.');
            } else {
                // Other errors
                throw new Error(`Unexpected error: ${error.message}`);
            }
        } else {
            throw new Error('Unknown error occurred.');
        }
    }
}

export const getQueryHistory = async (userId: string): Promise<string> => {
    // TODO resume
    try {
        const response = await axios.post(queryUrl, userId, {
            headers: {
                'Content-Type': 'text/plain',
            }
        });

        return response.data;
    } catch (error) {
        // Check if the error is from Axios (network-related)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const status = error.response.status;

                // Handle specific HTTP status codes
                switch (status) {
                    case 403:
                        throw new Error('Forbidden: You do not have permission to perform this action.');
                    case 422:
                        throw new Error('Translation failed. Please check the natural language content.');
                    case 500:
                        throw new Error('Server error: Something went wrong on our end.');
                    default:
                        throw new Error(error.response.data || 'Unexpected error occurred.');
                }
            } else if (error.request) {
                // No response received (e.g., network issue, server down)
                throw new Error('Network error: Please check your internet connection or try again later.');
            } else {
                // Other errors
                throw new Error(`Unexpected error: ${error.message}`);
            }
        } else {
            throw new Error('Unknown error occurred.');
        }
    }
}

