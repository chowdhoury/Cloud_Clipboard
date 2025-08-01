import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, File, Copy, Check } from 'lucide-react';
import { uploadFile, uploadText } from '../utils/api';
import { UploadResponse } from '../types';

interface UploadSectionProps {
  onUploadSuccess: (code: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadResult({
        success: false,
        message: 'File size must be less than 10MB'
      });
      return;
    }

    uploadFile(file).then(response => {
      if (response.success && response.data) {
        setUploadResult({
          success: true,
          code: response.data.code,
          message: 'File uploaded successfully!'
        });
        onUploadSuccess(response.data.code);
      } else {
        setUploadResult({
          success: false,
          message: response.message || 'Upload failed'
        });
      }
    });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) return;

    uploadText(textContent).then(response => {
      if (response.success && response.data) {
        setUploadResult({
          success: true,
          code: response.data.code,
          message: 'Text saved successfully!'
        });
        setTextContent('');
        onUploadSuccess(response.data.code);
      } else {
        setUploadResult({
          success: false,
          message: response.message || 'Save failed'
        });
      }
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="h-8 w-8" />;
    
    if (fileType.startsWith('image/')) return <Image className="h-8 w-8" />;
    if (fileType.startsWith('text/')) return <FileText className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {uploadResult && (
        <div className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
          uploadResult.success 
            ? 'bg-green-50/80 border-green-200 text-green-800' 
            : 'bg-red-50/80 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{uploadResult.message}</p>
              {uploadResult.success && uploadResult.code && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm">Access Code:</span>
                  <code className="px-3 py-1 bg-white/50 rounded-lg font-mono text-lg font-bold">
                    {uploadResult.code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(uploadResult.code!)}
                    className="p-1 hover:bg-white/30 rounded transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Upload className="h-6 w-6 mr-2" />
            Upload File
          </h2>
          
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-400 bg-blue-50/10'
                : 'border-white/30 hover:border-white/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-white/70 mx-auto mb-4" />
            <p className="text-white/90 mb-2">Drag and drop your file here</p>
            <p className="text-white/60 text-sm mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Browse Files
            </button>
            <p className="text-white/50 text-xs mt-4">Max file size: 10MB</p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Text Upload */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Save Text
          </h2>
          
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-40 p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              type="submit"
              disabled={!textContent.trim()}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
            >
              Save Text
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};