import axios from 'axios';
import { ExcelData } from '../types/ExcelData';
import { handleHttpError } from '../util/HttpUtil';

export const uploadExcel = async (token: string, file: File): Promise<ExcelData> => {
  const formData = new FormData();
  formData.append('file', file);

  const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
  const userFileDataUrl = `${baseUrl}/user-file-data`;
  const uploadExcelUrl = `${userFileDataUrl}/upload`;

  try {
    const response = await axios.post(uploadExcelUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    handleHttpError(error?.response?.status, error, {
      422: 'Data validation failed. Please check the file contents.',
    });
  }


};
