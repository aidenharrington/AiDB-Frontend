import axios from 'axios';
import { ExcelData } from '../types/ExcelData';

export const uploadExcel = async (file: File): Promise<ExcelData> => {
  const formData = new FormData();
  formData.append('file', file);

  const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
  const userFileDataUrl = `${baseUrl}/user-file-data`;
  const uploadExcelUrl = `${userFileDataUrl}/upload`;
  
  try {
    const response = await axios.post(uploadExcelUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
            throw new Error('Data validation failed. Please check the file contents.');
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

  
};
