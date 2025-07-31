import { StoredItem } from '../types';

const STORAGE_KEY = 'tempshare_items';

export const generateCode = (): string => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

export const saveItem = (item: Omit<StoredItem, 'id' | 'createdAt' | 'expiresAt'>): StoredItem => {
  const now = Date.now();
  const newItem: StoredItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: now,
    expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
  };

  const items = getItems();
  items.push(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  
  return newItem;
};

export const getItems = (): StoredItem[] => {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return items.filter((item: StoredItem) => item.expiresAt > Date.now());
  } catch {
    return [];
  }
};

export const findItemByCode = (code: string): StoredItem | null => {
  const items = getItems();
  return items.find(item => item.code === code) || null;
};

export const cleanupExpiredItems = (): void => {
  const items = getItems();
  const validItems = items.filter(item => item.expiresAt > Date.now());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validItems));
};

export const formatTimeRemaining = (expiresAt: number): string => {
  const now = Date.now();
  const remaining = expiresAt - now;
  
  if (remaining <= 0) return 'Expired';
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};