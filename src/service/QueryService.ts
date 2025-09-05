import axios from 'axios';
import { UserQueryData } from '../types/UserQueryData';
import { Query } from '../types/Query';
import { handleHttpError } from '../util/HttpUtil';
import { APIResponse, Tier } from '../types/Tier';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
const queryUrl = `${baseUrl}/queries`;

export const executeSql = async (token: string, query: Query): Promise<{ data: UserQueryData, tier: Tier | null }> => {
    try {
        const response = await axios.post<APIResponse<UserQueryData>>(queryUrl, query, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        return {
            data: response.data.data,
            tier: response.data.meta.tier
        };
    } catch (error: any) {
        handleHttpError(error?.response?.status, error, {
            400: 'SQL execution failed. Please check the query.'
        });
    }
}

export const translateNlToSql = async (token: string, query: Query): Promise<{ query: Query, tier: Tier | null }> => {
    const translateUrl = `${queryUrl}/translate`;

    try {
        const response = await axios.post<APIResponse<Query>>(translateUrl, query, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        return {
            query: response.data.data,
            tier: response.data.meta.tier
        };
    } catch (error: any) {
        handleHttpError(error?.response?.status, error, {
            422: 'Translation failed. Please check the natural language content.',
        });
    }
}

export const getQueryHistory = async (token: string, projectId: string): Promise<{ queries: Query[], tier: Tier | null }> => {
    try {
        const response = await axios.get<APIResponse<Query[]>>(queryUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                projectId: projectId
            }
        })

        return {
            queries: response.data.data,
            tier: response.data.meta.tier
        };
    } catch (error: any) {
        return handleHttpError(error?.response?.status, error);
    }
}

