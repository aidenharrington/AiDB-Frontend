import axios from 'axios';
import { Project } from '../types/Project';
import { handleHttpError } from '../util/HttpUtil';
import { ProjectCreateRequest } from '../types/dtos/ProjectCreateRequest';
import { APIResponse, Tier } from '../types/Tier';

const baseUrl = process.env.REACT_APP_API_BASE_URL || '';

const projectsUrl = `${baseUrl}/projects`;
const projectUrl = (id: string) => `${projectsUrl}/${id}`;


export const getProjects = async (token: string): Promise<{ projects: Project[], tier: Tier | null }> => {

  try {
    const response = await axios.get<APIResponse<Project[]>>(projectsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    return {
      projects: response.data.data,
      tier: response.data.meta.tier
    };
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    return { projects: [], tier: null };
  }
}

export const getProject = async (token: string, projectId: string): Promise<{ project: Project, tier: Tier | null }> => {
  try {
    const response = await axios.get<APIResponse<Project>>(projectUrl(projectId), {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const project = response.data.data;

    return {
      project: project,
      tier: response.data.meta.tier
    };
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }
}

export const createProject = async (token: string, projectCreateRequest: ProjectCreateRequest): Promise<{ project: Project, tier: Tier | null }> => {
  try {
    const response = await axios.post<APIResponse<Project>>(projectsUrl, projectCreateRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return {
      project: response.data.data,
      tier: response.data.meta.tier
    };
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }
}

export const uploadExcel = async (token: string, projectId: string, file: File): Promise<{ project: Project, tier: Tier | null }> => {
  const uploadExcelUrl = (id: string) => `${projectUrl(id)}/upload`;
  
  const formData = new FormData();
  formData.append('file', file);


  try {
    const response = await axios.post<APIResponse<Project>>(uploadExcelUrl(projectId), formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const project = response.data.data;

    return {
      project: project,
      tier: response.data.meta.tier
    };
  } catch (error: any) {
    handleHttpError(error?.response?.status, error, {
      422: 'Data validation failed. Please check the file contents.',
    });
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }


};

export const deleteProject = async (token: string, projectId: string): Promise<{ tier: Tier | null }> => {
  try {
    const response = await axios.delete<APIResponse<string>>(projectUrl(projectId), {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return {
      tier: response.data.meta.tier
    };
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }
};

export const deleteTable = async (token: string, projectId: string, tableId: string): Promise<{ tier: Tier | null }> => {
  const deleteTableUrl = `${projectUrl(projectId)}/tables/${tableId}`;
  
  try {
    const response = await axios.delete<APIResponse<string>>(deleteTableUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return {
      tier: response.data.meta.tier
    };
  } catch (error: any) {
    handleHttpError(error?.response?.status, error);
    // This line will never be reached due to handleHttpError throwing, but TypeScript needs it
    throw error;
  }
};
