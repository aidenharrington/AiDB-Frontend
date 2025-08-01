import axios from 'axios';
import { Project } from '../types/Project';
import { handleHttpError } from '../util/HttpUtil';
import { ProjectCreateRequest } from '../types/dtos/ProjectCreateRequest';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';

const projectsUrl = `${baseUrl}/projects`;
const projectUrl = (id: string) => `${projectsUrl}/${id}`;


export const getProjects = async (token: string): Promise<Project[]> => {

  try {
    const response = await axios.get(projectsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    return response.data;
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    return [];
  }
}

export const getProject = async (token: string, projectId: string): Promise<Project> => {
  try {
    const response = await axios.get(projectUrl(projectId), {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }
}

export const createProject = async (token: string, projectCreateRequest: ProjectCreateRequest): Promise<Project> => {
  try {
    const response = await axios.post(projectsUrl, projectCreateRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }
}

export const uploadExcel = async (token: string, projectId: string, file: File): Promise<Project> => {
  const uploadExcelUrl = (id: string) => `${projectUrl(id)}/upload`;
  
  const formData = new FormData();
  formData.append('file', file);


  try {
    const response = await axios.post(uploadExcelUrl(projectId), formData, {
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
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }


};
