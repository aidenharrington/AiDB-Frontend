import axios from 'axios';
import { Tier } from '../types/Tier';
import { handleHttpError } from '../util/HttpUtil';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
const metadataUrl = `${baseUrl}/metadata`;
const tierUrl = `${metadataUrl}/tier`;

export const getTierInfo = async (token: string): Promise<Tier | null> => {
  try {
    const response = await axios.get(tierUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    // Handle different possible response formats
    if (response.data.tier !== undefined) {
      return response.data.tier;
    } else if (response.data && typeof response.data === 'object') {
      // If the response is directly the tier object
      return response.data;
    }
    
    return null;
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    return null;
  }
};
