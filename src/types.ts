export interface StoredItem {
  id: string;
  code: string;
  type: 'text' | 'file';
  content: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: number;
  expiresAt: number;
}

export interface UploadResponse {
  success: boolean;
  code?: string;
  message?: string;
}