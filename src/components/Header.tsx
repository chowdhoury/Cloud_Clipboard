import React from 'react';
import { Shield, Clock } from 'lucide-react';

interface HeaderProps {
  activeTab: 'upload' | 'retrieve';
  onTabChange: (tab: 'upload' | 'retrieve') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <Shield className="h-12 w-12 text-blue-400 mr-3" />
        <h1 className="text-5xl font-bold text-white">TempShare</h1>
      </div>
      
      <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Securely share files and text with automatic 24-hour expiration. 
        No accounts needed, just generate a code and share.
      </p>

      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
          <button
            onClick={() => onTabChange('upload')}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'upload'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Upload & Share
          </button>
          <button
            onClick={() => onTabChange('retrieve')}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'retrieve'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Retrieve Content
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>24-hour auto-delete</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Secure 5-digit codes</span>
        </div>
      </div>
    </header>
  );
};