import axios from 'axios';
import { UserQueryData } from '../types/UserQueryData';
import { Query } from '../types/Query';
import { handleHttpError } from '../util/HttpUtil';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
const queryUrl = `${baseUrl}/queries`;

export const executeSql = async (token: string, sqlQuery: string): Promise<UserQueryData> => {
    try {
        const response = await axios.post(queryUrl, sqlQuery, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            }
        });

        return response.data;
    } catch (error: any) {
        handleHttpError(error?.response?.status, error, {
            400: 'SQL execution failed. Please check the query.'
        });
    }
}

export const translateNlToSql = async (token: string, nlQuery: string): Promise<string> => {
    const translateUrl = `${queryUrl}/translate`;

    try {
        const response = await axios.post(translateUrl, nlQuery, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            }
        });

        return response.data;
    } catch (error: any) {
        handleHttpError(error?.response?.status, error, {
            422: 'Translation failed. Please check the natural language content.',
        });
    }
}

export const getQueryHistory = async (token: string): Promise<Query[]> => {
    try {
        const response = await axios.get(queryUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data;
    } catch (error: any) {
        return handleHttpError(error?.response?.status, error);
    }
}

