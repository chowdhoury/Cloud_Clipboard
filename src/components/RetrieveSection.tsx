import React, { useState } from 'react';
import { Search, Download, Eye, Clock, FileText, Image, File } from 'lucide-react';
import { findItemByCode, formatTimeRemaining, formatFileSize } from '../utils/storage';
import { StoredItem } from '../types';

export const RetrieveSection: React.FC = () => {
  const [code, setCode] = useState('');
  const [item, setItem] = useState<StoredItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const foundItem = findItemByCode(code.toUpperCase());
    if (foundItem) {
      setItem(foundItem);
      setNotFound(false);
      setShowPreview(false);
    } else {
      setItem(null);
      setNotFound(true);
    }
  };

  const downloadFile = (item: StoredItem) => {
    if (item.type === 'file' && item.fileName) {
      const link = document.createElement('a');
      link.href = item.content;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="h-6 w-6" />;
    
    if (fileType.startsWith('image/')) return <Image className="h-6 w-6 text-blue-500" />;
    if (fileType.startsWith('text/')) return <FileText className="h-6 w-6 text-green-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const canPreview = (item: StoredItem) => {
    if (item.type === 'text') return true;
    if (item.type === 'file' && item.fileType?.startsWith('image/')) return true;
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Search className="h-6 w-6 mr-2" />
          Retrieve Content
        </h2>

        <form onSubmit={handleSearch} className="space-y-4 mb-8">
          <div className="flex space-x-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter 5-digit code"
              className="flex-1 p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={5}
            />
            <button
              type="submit"
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {notFound && (
          <div className="p-4 bg-red-50/20 border border-red-200/30 rounded-xl text-red-300 text-center">
            Content not found or has expired
          </div>
        )}

        {item && (
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {item.type === 'text' ? (
                    <FileText className="h-6 w-6 text-blue-400" />
                  ) : (
                    getFileIcon(item.fileType)
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.type === 'text' ? 'Text Content' : item.fileName}
                    </h3>
                    {item.type === 'file' && item.fileSize && (
                      <p className="text-white/60 text-sm">
                        {formatFileSize(item.fileSize)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-orange-300">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{formatTimeRemaining(item.expiresAt)}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                {canPreview(item) && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{showPreview ? 'Hide' : 'Preview'}</span>
                  </button>
                )}
                
                {item.type === 'file' && (
                  <button
                    onClick={() => downloadFile(item)}
                    className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>

            {showPreview && (
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                {item.type === 'text' ? (
                  <div className="max-h-60 overflow-y-auto">
                    <pre className="text-white/90 whitespace-pre-wrap break-words">
                      {item.content}
                    </pre>
                  </div>
                ) : item.fileType?.startsWith('image/') ? (
                  <div className="text-center">
                    <img
                      src={item.content}
                      alt={item.fileName}
                      className="max-w-full max-h-60 rounded-lg mx-auto"
                    />
                  </div>
                ) : (
                  <p className="text-white/60 text-center">Preview not available for this file type</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};