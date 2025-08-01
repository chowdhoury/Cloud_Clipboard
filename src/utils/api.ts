const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UploadFileResponse {
  code: string;
  expiresAt: number;
}

export interface UploadTextResponse {
  code: string;
  expiresAt: number;
}

export interface RetrieveResponse {
  type: 'text' | 'file';
  content?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileUrl?: string;
  expiresAt: number;
}

export const uploadFile = async (file: File): Promise<ApiResponse<UploadFileResponse>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/file`, {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to upload file. Please try again.',
    };
  }
};

export const uploadText = async (text: string): Promise<ApiResponse<UploadTextResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text }),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to save text. Please try again.',
    };
  }
};

export const retrieveContent = async (code: string): Promise<ApiResponse<RetrieveResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/retrieve/${code}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to retrieve content. Please try again.',
    };
  }
};

export const downloadFile = async (code: string): Promise<Blob | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/download/${code}`);
    if (response.ok) {
      return await response.blob();
    }
    return null;
  } catch (error) {
    console.error('Download failed:', error);
    return null;
  }
};