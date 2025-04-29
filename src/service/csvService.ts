import axios from 'axios';

export const uploadCsv = async (file: File): Promise<string[][]> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
