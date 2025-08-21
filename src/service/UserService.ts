import axios from 'axios';
import { handleHttpError } from '../util/HttpUtil';
import { APIResponse, Tier } from '../types/Tier';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';

const usersUrl = `${baseUrl}/users`;

export interface UserDTO {
  userId: string;
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
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }
};
